-- EQ Trainer — one-time Supabase project setup
-- Paste this whole file into: Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to run exactly once on a fresh project.

-- ============ Tables ============

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  lang text not null default 'en' check (lang in ('en','ru','uz')),
  journey_start date,
  ritual jsonb not null default '{"morning":"","day":"","evening":""}',
  updated_at timestamptz not null default now()
);

create table public.journey_days (
  user_id uuid not null references auth.users(id) on delete cascade,
  day int not null check (day between 1 and 31),
  fields jsonb not null default '{}',
  saves jsonb not null default '{}', -- per-practice Save stamps: { practiceId: ISO }
  done boolean not null default false,
  done_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- Daily check-ins: one row per user per calendar day; each slot column holds
-- {"text": "...", "savedAt": "ISO"} and is upserted independently (the client
-- sends only the slot it saved, so slots can never overwrite each other).
create table public.checkins (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  morning jsonb,
  day jsonb,
  evening jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

create table public.entries (
  id uuid primary key,                      -- client-generated, NO default (retry idempotency)
  user_id uuid not null references auth.users(id) on delete cascade,
  emotion text not null check (emotion in ('anger','shame','fear','envy')),
  at timestamptz not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index entries_user_emotion_at on public.entries (user_id, emotion, at);

-- ============ updated_at triggers (server clock, never client) ============

create extension if not exists moddatetime schema extensions;

create trigger profiles_updated before update on public.profiles
  for each row execute function extensions.moddatetime(updated_at);
create trigger journey_days_updated before update on public.journey_days
  for each row execute function extensions.moddatetime(updated_at);
create trigger checkins_updated before update on public.checkins
  for each row execute function extensions.moddatetime(updated_at);

-- ============ Auto-create profile row on signup ============

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ Row-level security: author-only ============

alter table public.profiles     enable row level security;
alter table public.journey_days enable row level security;
alter table public.entries      enable row level security;
alter table public.checkins     enable row level security;

create policy profiles_own on public.profiles for all to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy journey_days_own on public.journey_days for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy entries_own on public.entries for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy checkins_own on public.checkins for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- ============ Private storage bucket for PDF reports ============

insert into storage.buckets (id, name, public) values ('reports', 'reports', false);

create policy reports_select on storage.objects for select to authenticated
  using (bucket_id = 'reports' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy reports_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'reports' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Deliberately NO update/delete storage policies: the PDF archive is append-only.

-- ============ Self-service erasure ============
-- security definer is required for two reasons: a user cannot delete their own
-- auth.users record, and the reports bucket has no delete policy by design
-- (append-only, above). auth.uid() inside the function is still the CALLER's
-- id, so this can only ever erase the caller's own account.
--
-- profiles, journey_days and entries all declare
--   references auth.users(id) on delete cascade
-- so deleting the auth user removes every row. Only storage needs explicit
-- handling, because objects are addressed by folder name, not a foreign key.

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public, auth, storage
as $$
declare
  me uuid := auth.uid();
begin
  if me is null then
    raise exception 'not authenticated';
  end if;

  -- storage.protect_delete() blocks direct SQL deletes on storage.objects so
  -- callers cannot orphan files on disk. This is its sanctioned opt-in, and
  -- set_config(..., true) scopes it to THIS transaction only, so it can never
  -- leak into another statement. The rows go now; the bytes are removed from
  -- disk by scripts/storage-sweep.sh, which deletes objects with no DB row.
  perform set_config('storage.allow_delete_query', 'true', true);

  delete from storage.objects
   where bucket_id = 'reports'
     and (storage.foldername(name))[1] = me::text;

  delete from auth.users where id = me;
end $$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
