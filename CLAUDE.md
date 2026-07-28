# EQ Trainer — project guide

Personal emotional-intelligence trainer based on Daniel Goleman's framework. Source-of-truth docs: `..\Daniel Goleman 1 month plan.pdf` and `..\Add a _Next Level_ section .docx`. Product spec: `PRD.md`.

## Stack
- React 18 + Vite 6 (`base: './'` — the build must keep working when `dist/index.html` is opened from disk via `file://`).
- recharts for charts. Plain CSS in `src/styles.css`. No TypeScript, no router, no other dependencies — keep it that way.

## Commands
- `npm run dev` — dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the build

## Architecture
- `src/App.jsx` — root: route state object (`{page, emotion?}`), header/nav, breadcrumbs, toast, export/import.
- `src/content.js` — ALL user-facing text and program content. Every string is `{en, ru}`; render via `L(lang, s)` or the `t()` helper (UI table). Never hardcode display text in components.
- `src/store.js` — localStorage persistence (key `eqTrainerData`), analytics (mastery, intensity series, badges), `newId()`, `normalizeData()`, `fmtDate()`.
- `src/components/` — Dashboard, Journey (30-day plan), NextLevel (module cards + Final Tips), EmotionModule (Learn/Practice/Journal/Progress tabs), BreathingGuide, ErrorBoundary.

## Data shape
```js
{ lang: 'en'|'ru',
  journey: { startDate: 'YYYY-MM-DD'|null, days: { [n]: { fields: {}, done: bool } }, ritual: '' },
  entries: { anger: [], shame: [], fear: [] } }
```
Journal entries: `{ id, date: ISO, intensity? (only if slider touched), ...fieldValues }`. Fear entries add `tookDate` when "I took this step" is checked.

## Conventions & invariants
- **Option selections are stored as stable keys** (e.g. `dignity`, `physical`), rendered via `optionLabel(lang, v)`. `OPTION_LABELS` also maps legacy English display strings — old saved data must always keep rendering (backward compatibility is required; never migrate/rewrite stored entries).
- Journal field keys get display names from `FIELD_LABELS` in content.js — add an entry there for any new practice field.
- No secure-context-only APIs (`crypto.randomUUID` etc.) without a fallback — the app runs on `file://`.
- All state changes go through `update(fn)` (structuredClone + save); never mutate `data` directly.
- CSS: `color-mix()` needs a plain fallback declaration on the previous line; keep the ≤480px and `prefers-reduced-motion` media queries intact.
- Design system (2026-07 redesign, research-based — see PRD §8): all colors via CSS custom properties in `:root` with a `prefers-color-scheme: dark` override — never hardcode surface/text colors in components; serif (`var(--serif)`) is reserved for emotional voice (greetings, quotes, titles), `.caps` class for metadata; gradient budget is ONE gradient surface per screen (`.hero` / `.module-hero`); min 44px touch targets; celebrations only at milestone days 7/14/21/30.

## QA checklist (manual — no test framework)
`npm run build`, then verify: save a practice from `dist/index.html` opened from disk; import a backup with `entries:{}` (must not white-screen); RU mode journal shows localized labels/values; new profile shows no focus suggestion; two same-day entries get unique chart labels.
