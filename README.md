# EQ Trainer

Grow your emotional intelligence — the Daniel Goleman way. A private, offline-friendly web app with:

- **30-Day Journey** — four guided weeks (Self-Awareness → Self-Management → Social Awareness → Relationship Management) with daily practices, day-by-day unlocking, streaks, and the Day-31 EI Ritual.
- **Next Level** — master Anger, Shame, and Fear: interactive 4-step lessons, guided practice forms (with a 4-7-8 breathing exercise), a searchable journal with first-vs-latest comparison, mastery scores, and intensity charts.
- **Dashboard** — progress rings, weekly summary chart, achievement badges, and personalized insights.
- **English + Русский**, switchable any time. All data stays in your browser (localStorage); use Export/Import backup at the bottom of the page to move it between devices.

## Run it

```
npm install
npm run dev        # development, opens on http://localhost:5173
```

## Build a standalone version

```
npm run build
```

Then open `dist/index.html` — it works directly from disk, no server needed. Copy the `dist` folder anywhere (USB stick, phone, shared drive).

## Quick launch & demo data

- Double-click **`Открыть EQ Trainer.bat`** (one level up, in `Desktop\Другие`) — it opens the built app (`dist/index.html`) in your default browser.
- `demo-data.json` contains realistic sample entries (9 practices + journey day 1). To see the app "alive" on a fresh browser/device, click **Импорт данных / Import backup** at the bottom of the page and pick this file. One time is enough — everything after that autosaves.

## Project docs

- `PRD.md` — product requirements
- `CLAUDE.md` — technical guide for AI-assisted development
