# EQ Trainer — backend (self-hosted Supabase)

The backend is **self-hosted on your own server**, not on supabase.com. It was
provisioned on 2026-08-16 and is running. This file is the operator's guide.

## What is running

On `169.58.92.31`, under `/opt/supabase`:

- **Postgres** with the app schema (`profiles`, `journey_days`, `checkins`, `entries`), row-level security, the private `reports` storage bucket, and `delete_own_account()`.
- **GoTrue** (auth), **PostgREST** (the REST API), **Storage**, and the gateway — plus Studio, realtime and edge-functions from the standard stack.
- Everything binds to **127.0.0.1 only**. Nothing in the stack is reachable from the internet directly.

The app reaches it **on its own origin**: nginx on `eq-trainer.com` proxies
`/auth/v1`, `/rest/v1` and `/storage/v1` to the gateway on `127.0.0.1:8000`.
That is why `src/config.js` says `SUPABASE_URL = 'https://eq-trainer.com'` — no
separate API subdomain, no second certificate, no CORS preflight.

Secrets live in `/opt/supabase/.env`. **Back that file up somewhere off the
server**: without `JWT_SECRET`, a restored database cannot validate any existing
token or API key.

## Email (configured 2026-08-17)

Mail goes out through **Resend** (free tier: 3,000/month, 100/day, one domain),
sending as `no-reply@eq-trainer.com`. DKIM, SPF and the bounce MX are published
on `eq-trainer.com` and verified. `ENABLE_EMAIL_AUTOCONFIRM=false`, so signup
requires confirming the address.

Verified working end to end: confirmation mail **delivered** to an external
address (not spam), its link activates the account, password reset delivers and
lands on the set-new-password screen, and the 6-digit code in each mail works as
an alternative to the link.

- SMTP settings live in `/opt/supabase/.env` (`SMTP_*`). The password is a Resend
  API key with sending access only — rotate it in the Resend dashboard and update
  that one value if it ever leaks.
- **`ADDITIONAL_REDIRECT_URLS` must list every origin a link may return to.**
  It is `https://eq-trainer.com` only. Adding `http://localhost:5173` temporarily
  is how to test recovery locally; remove it afterwards.
- GoTrue rate-limits password-reset mail per address (a 429 on repeated requests
  is that, not a fault).
- After changing any `SMTP_*` or auth setting: `cd /opt/supabase && docker compose up -d --force-recreate auth`

## Day-2 operations

- **Managing the stack**: `cd /opt/supabase` then `sh run.sh status | start | stop | restart [service] | logs [service]`.
- **Add nobody manually** — signup is open and self-service.
- **Forgot password**: users reset it themselves once SMTP is configured. Until then, there is no self-service reset.
- **Deleting an account**: users do it themselves from the bottom of any page. It removes their rows and login immediately; the archived PDFs are removed from disk by the sweeper within 15 minutes.
- **No pausing.** That was a hosted-free-tier limitation and does not apply here.
- **Disk**: the whole box has ~80 GB free. At roughly 16 KB per archived report, storage is not a near-term concern — but it grows with every save, so watch `df -h`.

## Backups — these are now your responsibility

`/opt/supabase/backup.sh` runs nightly at 03:23 (`/etc/cron.d/supabase-backup`),
writing to `/var/backups/supabase`:

- `db_*.sql.gz` — `pg_dumpall`, so roles and grants are included, not just tables
- `storage_*.tar.gz` — the archived PDFs
- `env_*.bak` — the secrets, without which a restore cannot validate tokens

14 days are kept. **They are written to the same disk as the data they protect.**
That defends against a bad migration or an accidental deletion — *not* against
losing the server. Set `BACKUP_REMOTE` at the top of `backup.sh` to an scp target
to close that gap; that is the single most valuable thing left to do here.

Restore outline: `zcat db_<stamp>.sql.gz | docker compose exec -T db psql -U postgres`,
untar the storage archive over `/opt/supabase/volumes/storage`, restore `.env`, restart.
**Rehearse this before you need it** — an untested backup is a guess.

## Security notes

- Each user can read and write **only their own rows and their own PDF folder**, enforced by the database, not by app code. Verified against a real second account: cross-user reads return empty, cross-user writes are refused, and another user's PDF returns an error.
- The `anon` key in `src/config.js` is public by design and safe to commit. The `service_role` key in `/opt/supabase/.env` is not — it bypasses every policy.
- You hold the database. You can read anyone's journal. The app's privacy note tells users exactly that, so the promise not to is public.
- Signup is open to the internet. If bots ever appear, GoTrue supports a CAPTCHA (`GOTRUE_SECURITY_CAPTCHA_ENABLED`) — deliberately off until there is a reason.
