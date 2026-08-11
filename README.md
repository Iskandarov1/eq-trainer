# EQ Trainer

Grow your emotional intelligence — the Daniel Goleman way. Live at **https://eq-trainer.com**.

- **30-Day Journey** — four guided weeks (Self-Awareness → Self-Management → Social Awareness → Relationship Management) with daily practices, day-by-day unlocking, streaks, and the Day-31 EI Ritual.
- **Next Level** — master Anger, Shame, and Fear: interactive 4-step lessons, guided practice forms (with a 4-7-8 breathing exercise), a searchable journal with first-vs-latest comparison, mastery scores, and intensity charts.
- **Dashboard** — progress rings, weekly summary chart, achievement badges, and personalized insights.
- **English + Русский + Oʻzbekcha**, switchable any time.
- **Accounts and sync** — each user's journal is private to them, synced to a common database, with a PDF archive of every daily record. Runs local-only (no accounts) while `src/config.js` is empty; see `SETUP.md` to switch the backend on.

## Run it

```
npm install
npm run dev        # development, on http://localhost:5173
npm run build      # production build to dist/
npm run preview    # serve the build on http://localhost:4173
npm run deploy     # build and publish to eq-trainer.com
```

The app is web-only: it is served from the root of a domain and no longer runs by
opening `dist/index.html` from disk.

While Supabase is unconfigured the auth screens are unreachable, so in dev they
can be previewed at `?auth`, `?auth=signup`, `?auth=pending`, `?auth=reset` and
`?auth=newpassword`.

## Demo data

`demo-data.json` contains realistic sample entries (9 practices + journey day 1). To see the app "alive" on a fresh browser, click **Import backup** at the bottom of the page and pick this file. One time is enough — everything after that autosaves.

## Project docs

- `PRD.md` — product requirements
- `CLAUDE.md` — technical guide for AI-assisted development
