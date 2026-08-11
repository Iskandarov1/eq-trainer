# EQ Trainer — public launch readiness (design)

**Date:** 2026-08-11
**Status:** approved by owner, ready for implementation planning
**Milestone:** make eq-trainer.com a real product before adding any new features

---

## 1. Context

`eq-trainer.com` went live on 2026-08-10, served as static files from
`/var/www/eq-trainer.com` on `169.58.92.31` (nginx, Let's Encrypt, HTTP→HTTPS).

The site is publicly reachable **in v1 local mode**: `src/config.js` is empty, so
the whole multi-user layer shipped in `d758393` — `api.js`, `AuthScreen.jsx`, the
offline queue, PDF-to-storage — is dormant. Every visitor's journal lives only in
their own browser's `localStorage`.

That is the defect this milestone exists to fix. A 30-day programme that cannot
remember a user for 30 days is not a product: clearing the browser, switching to a
phone, or using a different machine all silently destroy the work.

Two items were left explicitly pending on 2026-08-05 and remain pending:

1. The Supabase project was never created (it needs the owner's credentials).
2. Live cloud behaviour was never verified, because there was nothing to verify
   against.

### Owner decisions taken during this brainstorm

| Question | Decision |
|---|---|
| Who is the app for? | **Public** — anyone on the internet may sign up |
| Must it still run from disk (`file://`, the `.bat` launcher)? | **No — web only** |
| Sequence | **Foundation first**, no new features this milestone |
| Signup policy | **Email confirmation ON + self-service password reset** |
| Account deletion | **In scope** |
| Speed work | **In scope** |

---

## 2. Definition of done

eq-trainer.com serves a signed-in, synced, fast-loading app that a stranger can
understand, trust, and recover access to without contacting the owner.

Concretely, all of the following are true and have been demonstrated against the
live domain:

- A new visitor understands what the app is before being asked for an email.
- Signup requires a confirmed email address; a forgotten password is recoverable
  by the user alone.
- Two accounts cannot see each other's data.
- Work saved offline syncs exactly once on reconnect, with no duplicates.
- A daily PDF lands in the correct user's private storage folder.
- A user can delete their account and everything in it.
- The first load is materially faster than the current 2.4 MB single bundle.
- Deploying a change is one command.

---

## 3. The signup reversal (and why)

`SETUP.md` §3 currently instructs **Confirm email: OFF**, marked "(required)".
That was correct for the app it described — an internal tool for a handful of
colleagues, launched from a `.bat` file — for two reasons:

- Supabase's built-in mailer cannot reliably send to arbitrary addresses.
- Password-reset links had nowhere to land, because the app opened from disk.

Both reasons are now void: there is a real domain for links to land on. What the
setting leaves behind is not acceptable in public:

- Anyone may register **with an email address they do not own**, including
  someone else's.
- An open signup endpoint on a public domain attracts bots. Credential scanners
  found the photo-extractor host within hours of it going live; this is the same
  exposure surface.
- **There is no password reset at all.** `SETUP.md` §"Day-2 operations" makes
  recovery a manual dashboard task for the owner. With strangers signing up, every
  forgotten password becomes an unpaid, unbounded support obligation.

**Decision: email confirmation ON, plus self-service password reset.**

This requires an email sender. Supabase's built-in SMTP is rate-limited to a
handful of messages per hour and is explicitly not for production use, so a
free-tier provider sends from `no-reply@eq-trainer.com`, with SPF and DKIM records
on the domain so mail is not filed as spam.

**Provider: Resend** (free tier ~3,000 messages/month, straightforward domain
verification, SMTP credentials Supabase accepts directly). Fallback if Resend is
unavailable to the owner: **Brevo** (300/day free). Pick one; do not configure both.

### Latent bug this exposes

`src/api.js:39` assumes signup always yields a live session:

```js
const { data, error } = await supabase.auth.signUp({ email, password })
if (error) throw error
rememberUser({ uid: data.user.id, email: data.user.email })
```

With confirmation ON, `signUp` returns a user but **`data.session === null`**.
The current code would cache the uid, `AuthScreen` would call `onAuthed`, and the
app would treat the visitor as "signed in, offline" — queueing writes that can
never flush, against an account that does not yet exist in a usable state. This
must be fixed as part of enabling confirmation, not after.

---

## 4. Scope

### 4.1 Backend activation

**Owner steps** (credentials involved; cannot be delegated):

1. Create the Supabase project — `SETUP.md` §1, region **Europe (Frankfurt)**.
2. Run `supabase-setup.sql` once in the SQL editor — `SETUP.md` §2.
3. Create a free email-provider account (Resend or Brevo).
4. Add the SPF and DKIM DNS records for `eq-trainer.com` at the registrar. Exact
   record values will be supplied; DNS is not reachable from this workspace, so
   this step is the owner's.
5. In Supabase: point SMTP at the provider; set **Confirm email ON**, minimum
   password length 8, **Site URL `https://eq-trainer.com`**, and add the same
   origin to the redirect allowlist (confirmation and recovery links fail
   silently without it).
6. Hand over the **Project URL** and **anon key** (both public by design).

**Implementation steps:**

7. Fill `src/config.js`, rebuild, deploy.

### 4.2 Auth flows

Files: `src/api.js`, `src/components/AuthScreen.jsx`, `src/App.jsx`,
`src/content.js`.

- **`signUp` returns a pending state** when `data.session === null`: do not cache
  the uid, do not call `onAuthed`. `AuthScreen` renders a "confirm your email"
  state naming the address, with a resend option.
- **`requestPasswordReset(email)`** wrapping `resetPasswordForEmail` with
  `redirectTo: https://eq-trainer.com`.
- **`updatePassword(newPassword)`** for the recovery landing.
- **Recovery landing.** The app has no router; the recovery link arrives as a URL
  hash. `supabase-js` v2 consumes it and emits a `PASSWORD_RECOVERY` auth event —
  the app must subscribe to `onAuthStateChange` at boot and render a
  set-new-password screen when it fires. Nothing listens today.
- `AuthScreen`'s static `authForgot` line (a dead-end sentence) becomes a real
  "forgot password" action.
- All new copy goes in `content.js` as `{en, ru, uz}`, per the existing convention.

**Invariant preserved:** the app still gates on a **cached uid**, never on a live
session (`api.js` §"current user"). None of the above may introduce a path where a
failed offline token refresh drops the user at a login screen.

### 4.3 Onboarding

A stranger currently sees an "EQ" mark, an email field and a password field, with
no statement of what the app is. `AuthScreen` gains a short intro above the form:
what it is, that it is a 30-day guided practice of roughly 5–10 minutes a day, and
who can see the entries.

Deliberately **not** a separate landing page or marketing site — one screen, three
languages, no router.

### 4.4 Speed

With `file://` dropped, the single-bundle rule is obsolete. Current build:
2,378 kB raw / 926 kB gzipped, all loaded before first paint.

- Lazy-load `src/pdf.js` and, transitively, the two base64 font modules
  (`notoSansRegular.js`, `notoSansBold.js` — ~310 kB of source between them)
  behind the Reports download action.
- Lazy-load the recharts-dependent views (Dashboard progress, EmotionModule
  Progress tab).
- Switch `vite.config.js` `base` from `'./'` to `'/'`: nginx serves the app from
  the domain root, and relative bases interact badly with dynamically loaded
  chunks.

No target number is promised before measurement; the acceptance criterion is a
measured before/after recorded in the implementation notes.

**`CLAUDE.md` must be updated in the same commit** — it currently mandates
`base: './'`, forbids dynamic `import()` and `manualChunks`, and its QA checklist
opens `dist/index.html` from disk. Leaving those rules contradicting the code is
worse than either state alone.

### 4.5 Privacy and data rights

The app will hold strangers' writing about anger, shame and fear, stored in the EU.

- **Privacy note**, reachable from the app and from the auth screen, trilingual,
  in plain language. It must state honestly that the project owner can technically
  view raw data in the Supabase dashboard and that the policy is author-only —
  the same honesty `SETUP.md` §"Security notes" already applies internally.
- **Account deletion.** A `security definer` SQL function `delete_own_account()`
  added to `supabase-setup.sql`, removing the caller's storage objects, rows, and
  their `auth.users` record; the client calls it via `supabase.rpc` and then signs
  out. Guarded by an explicit irreversible-action confirmation in the UI.
  Rationale: erasure is an EU legal right and the correct default for this content
  regardless of jurisdiction.

### 4.6 Operations

- **`npm run deploy`** — build, then upload `dist/` to
  `root@169.58.92.31:/var/www/eq-trainer.com/` over `scp` (Git Bash on Windows has
  `scp` but not reliably `rsync`). Stale content-hashed assets are cleared by
  replacing the remote `assets/` directory rather than merging into it, so old
  bundles do not accumulate. Replaces the current manual copy.
- **Keep-alive.** A free Supabase project pauses after ~7 days without activity;
  the symptom is the app reporting "offline" while the network is fine. A daily
  cron entry on the existing server issues a trivial authenticated request to keep
  it awake. Costs nothing; defers the $25/month plan until traffic justifies it.
- **Docs.** `SETUP.md` rewritten for the public configuration (confirmation ON,
  SMTP, Site URL, DNS records, self-service reset in day-2 ops); `PRD.md` §3.5
  updated and a public-launch section added.

---

## 5. Out of scope

Named explicitly so they are not smuggled in:

- The 10 book-derived features (`docs/book-feature-backlog.md`).
- The 7 v2 roadmap items (`PRD.md` §7).
- Installable/offline PWA.
- Analytics or tracking of any kind.
- CAPTCHA on signup — Supabase's built-in auth rate limits are the first line;
  revisit only if bot signups actually appear.

---

## 6. Verification

Nothing is claimed working until demonstrated against **the live domain**.

Existing checklist (`CLAUDE.md` §QA), adapted — the `file://` item is replaced by
a load of `https://eq-trainer.com`:

- Import a backup with `entries:{}` — must not white-screen.
- RU and UZ journals show localised labels and values.
- A new profile shows no focus suggestion.
- Two same-day entries get unique chart labels.
- `node scripts/test-pdf.mjs` passes (Cyrillic and ʻ/ʼ glyphs).

Cloud checks, never previously possible:

- Sign-up → practice → row appears under the right uid, PDF in Storage.
- A second account sees nothing belonging to the first.
- Save offline → queue grows → reconnect → syncs once, no duplicates.
- Day marked done, then fields edited elsewhere → `done` never reverts.
- Legacy import previews counts and **renames** (not deletes) the old key.
- Sign-out with unsynced changes warns.

New paths introduced by this milestone:

- Confirmation email arrives and its link signs the user in.
- Password reset works end to end, including the recovery landing screen.
- Account deletion leaves no rows and no stored PDFs behind.
- Measured first-load size before and after the splitting work.

---

## 7. Risks

- **Free-tier limits** — 500 MB database, 1 GB storage. At roughly 50 kB per PDF
  that is on the order of 20,000 daily reports; adequate for now, worth watching.
- **Deliverability** — without correct SPF/DKIM, confirmation mail lands in spam
  and signup silently fails for real users. This is the most likely launch defect
  and must be tested with a real external address, not only a test inbox.
- **Sensitive data at public scale** — the owner becomes custodian of strangers'
  emotional journals. The privacy note and working deletion are the minimum
  discharge of that responsibility.
- **Supabase pausing** — mitigated by the cron keep-alive; if the site is quiet
  for a week without it, the app appears broken to every user at once.
- **Existing local-mode visitors** — anyone who used the site between 2026-08-10
  and this milestone has data only in their browser. The existing legacy-import
  flow covers moving it into an account on first sign-in; it must be confirmed to
  fire on the web build, not only the old launcher path.

---

## 8. Sequence

The order is constrained by the owner's manual steps, which gate everything cloud-
related. Work that does not depend on them can proceed in parallel.

1. **Independent of Supabase:** speed/code-splitting work, `CLAUDE.md` updates,
   `npm run deploy`, onboarding copy, privacy note text.
2. **Owner:** Supabase project, email provider, DNS records, auth settings; hand
   over URL + anon key.
3. **Then:** `config.js`, auth-flow code (confirmation, reset, recovery landing),
   `delete_own_account()`, keep-alive cron.
4. **Finally:** full verification pass against the live domain, then docs.
