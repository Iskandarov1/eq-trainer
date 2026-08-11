# EQ Trainer — Supabase setup (owner's guide)

One-time setup, ~20 minutes (plus waiting for DNS to propagate). After this the app has multi-user accounts, a common database, and PDF report storage. You do steps 1–4 yourself — they involve your account credentials and your domain registrar — then hand over the two values from step 5.

## 1. Create the account and project

1. Go to https://supabase.com → **Start your project** → sign up with your email (or GitHub). Use a strong password and enable 2FA (Account → Security) — this account is the master key to all users' data.
2. Create a **New project**:
   - Name: `eq-trainer`
   - Database password: generate and store it somewhere safe (you rarely need it, but don't lose it)
   - Region: **Europe (Frankfurt) — eu-central-1**
   - Plan: Free
3. Wait ~2 minutes while the project provisions.

## 2. Run the database setup script

1. In the left sidebar: **SQL Editor** → **New query**.
2. Open `supabase-setup.sql` (next to this file), copy ALL of it, paste, press **Run**.
3. It should finish with "Success. No rows returned". Run it only once.

This creates the tables, the author-only security rules (row-level security), the private `reports` storage bucket for PDFs, and the `delete_own_account()` function behind the app's "Delete account" action.

## 3. Email sending (do this before the auth settings)

The built-in Supabase mailer is capped at a few messages per hour and is not meant for production. The app is public, so set up a real sender first.

1. Create a free account at https://resend.com (3,000 emails/month free).
2. Add the domain `eq-trainer.com` and copy the DNS records it shows you.
3. At your domain registrar, add those records (one TXT for SPF, one TXT for DKIM). **Without them, confirmation mail lands in spam and signup silently fails for real users.**
4. Wait until Resend shows the domain as **Verified**, then create an SMTP credential.
5. In Supabase: **Project Settings → Authentication → SMTP Settings** → enable custom SMTP and paste the Resend host, port, username and password. Sender address: `no-reply@eq-trainer.com`.

(Brevo — 300 emails/day free — works the same way if Resend is unavailable to you. Set up one, not both.)

## 4. Auth settings

1. Sidebar: **Authentication** → **Sign In / Providers** → **Email**:
   - **Confirm email: ON** — the app is public. Without it, anyone can register using an email address they do not own, including someone else's.
   - **Minimum password length: 8**
2. **Authentication** → **URL Configuration**:
   - **Site URL:** `https://eq-trainer.com`
   - **Redirect URLs:** add `https://eq-trainer.com` — confirmation and password-reset links fail silently without it.
3. Save.

## 5. What to hand over

Sidebar: **Project Settings** → **API**. Copy these two values:

- **Project URL** (looks like `https://abcdefgh.supabase.co`)
- **anon / public key** (a long string starting with `eyJ…`)

These two are **safe to share and to commit into the app** — they only allow what the security rules permit. NEVER share the `service_role` key or your dashboard password with anyone.

## 6. Where the values go

Paste both into `src/config.js` in this project, then publish with `npm run deploy`.

## Day-2 operations

- **Add nobody manually** — signup is open and self-service: each user registers with email + password and activates their account via the emailed confirmation link.
- **Forgot password**: users reset it themselves — "Forgot your password?" on the sign-in screen emails them a link. No admin action needed.
- **Deleting an account**: users do this themselves from the bottom of any page; it removes their entries, their stored PDFs and their login. There is no undo and no backup kept for them.
- **Pausing**: a free project **pauses after ~7 days with zero traffic**. Symptom: the app says "offline / not synced" while the internet works. The keep-alive cron (`scripts/keepalive.cron`, installed on 169.58.92.31) prevents this by touching the API daily. If it ever happens anyway: dashboard → **Restore project** (~2 minutes, no data lost). If the app becomes critical, the Pro plan ($25/mo) removes pausing entirely.
- **Backups / portability**: Database → Backups (daily on free tier). Everything is standard PostgreSQL + files; a full export is possible at any time, so moving to another host later is a data migration, not a rewrite.

## Security notes (read once)

- Each user can read/write **only their own rows and their own PDF folder** — enforced by the database server, not by app code.
- You, as the project owner, can technically see raw data in the dashboard. The agreed policy is **author-only**: don't. The app's privacy note tells every user exactly this, so the promise is now public, not internal.
- The app's local cache and login token live in each user's browser storage; anyone with access to that browser profile could read them. That is why sign-out clears the local copy once everything is synced.
- Signup is open to anyone on the internet. If bot registrations ever appear, Supabase supports a CAPTCHA on auth endpoints (Authentication → Attack Protection) — deliberately left off until there is a reason for it.
