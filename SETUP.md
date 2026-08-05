# EQ Trainer — Supabase setup (owner's guide)

One-time setup, ~10 minutes. After this the app has multi-user accounts, a common database, and PDF report storage. You do steps 1–5 yourself (they involve your account credentials); then hand over two values from step 6.

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

This creates the tables, the author-only security rules (row-level security), and the private `reports` storage bucket for PDFs.

## 3. Auth settings (2 toggles)

1. Sidebar: **Authentication** → **Sign In / Providers** → **Email**:
   - **Confirm email: OFF** (required — otherwise signups dead-end, because the built-in mailer can't send to arbitrary addresses)
   - **Minimum password length: 8**
2. Save.

## 4. What to hand over

Sidebar: **Project Settings** → **API**. Copy these two values:

- **Project URL** (looks like `https://abcdefgh.supabase.co`)
- **anon / public key** (a long string starting with `eyJ…`)

These two are **safe to share and to commit into the app** — they only allow what the security rules permit. NEVER share the `service_role` key or your dashboard password with anyone.

## 5. Where the values go

Paste both into `src/config.js` in this project — then the app is rebuilt and distributed as usual (`dist/` folder + launcher).

## Day-2 operations

- **Add nobody manually** — signup is open: each user registers in the app with email + password (no confirmation email is sent).
- **Forgot password**: Authentication → Users → click the user → **Reset password** (or set a new one via the admin API). The app itself has no self-service reset (it runs from a local file, so email reset links have nowhere to land).
- **After holidays**: a free project **pauses after ~7 days with zero traffic**. Symptom: the app says "offline / not synced" while the internet works. Fix: log into the dashboard → **Restore project** (takes ~2 minutes). Data is not lost. If the team uses the app daily this rarely triggers. If the app becomes critical, the Pro plan ($25/mo) removes pausing.
- **Backups / portability**: Database → Backups (daily on free tier). Everything is standard PostgreSQL + files; a full export is possible at any time, so moving to another host later is a data migration, not a rewrite.

## Security notes (read once)

- Each user can read/write **only their own rows and their own PDF folder** — enforced by the database server, not by app code.
- You, as the project owner, can technically see raw data in the dashboard. The agreed policy is **author-only**: don't. The team has been told records are private.
- The app's local cache and login token live in the browser's local storage on each user's computer; anyone using the same Windows account on that computer could access them. Users on shared computers should use the app's sign-out (it clears the local copy once everything is synced).
