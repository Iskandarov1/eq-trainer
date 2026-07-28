# EQ Trainer — Product Requirements Document

**Owner:** Sanjar Iskandarov · **Status:** v1.0 shipped · **Sources of truth:** `Daniel Goleman 1 month plan.pdf`, `Add a _Next Level_ section .docx` (both in `Desktop\Другие`) · **Research base:** five video sources (§6)

## 1. Vision

A personal emotional-intelligence trainer that turns Daniel Goleman's EI framework into a daily guided practice. The user grows the four EI domains through a structured 30-day journey, then masters the three hardest emotions (Anger, Shame, Fear) in an advanced "Next Level" module. Everything is private: all data lives in the browser (localStorage), no accounts, no server.

## 2. Target user & context

- An individual (RU/EN speaking) who wants a practical, self-paced EI program.
- Uses the app 2–10 minutes at a time, often on a phone.
- May run the built app straight from disk (`dist/index.html`) — no hosting required.

## 3. Functional requirements

### 3.1 The 30-Day Journey (from the Goleman plan PDF)
- Four weeks, each with quote, intro, goal, and daily practices with input fields:
  - **W1 (days 1–7) Self-Awareness:** emotional check-ins 3×/day (write it down, don't judge), precise emotion naming, evening reflection journal.
  - **W2 (8–14) Self-Management:** Pause Power, visualization for composure, gratitude reframe, morning intention.
  - **W3 (15–21) Social Awareness:** empathy practice, non-verbal cues, "Other Lens" journaling, mindful listening.
  - **W4 (22–30) Relationship Management:** intentional connection, difficult-conversation rehearsal, conflict alchemy, relationship journal.
- Day gating (one day at a time), day completion, streaks, progress stats.
- **Day 31+:** the EI Ritual (morning intention / daytime check-in / evening reflection) + personal ritual text + Goleman's final words.

### 3.2 Next Level (from the docx spec)
- Reachable from nav **and breadcrumbs**; breadcrumb "Next Level" shows the 3 modules.
- Four emotion modules — **Anger** ("The Fire That Burns — or Builds"), **Shame** ("The Silent Saboteur"), **Fear** ("The Ancient Protector"), and **Envy** ("The Hidden Compass", added 2026-07-28 by owner request; content authored in-house following the same signal→name→reframe→redirect structure since the source PDF covers only the first three — no attributed quotes in it) — each with:
  - **Learn:** explanation + the 4-step Goleman approach as interactive expandable cards.
  - **Practice:** the guided form exactly as specified (textareas with prescribed placeholders, quick-select chips, intensity slider 1–10, checkboxes, fear's 4-7-8 animated breathing guide + 5 grounding inputs, "I took this step" with date tracker). Saves to journal with date/time.
  - **Journal:** entry list, date-range filter, search, click-to-expand, "First time vs Most recent" compare.
  - **Progress:** practice counter, mastery score 0–100 (frequency + reflection depth), intensity line chart (recharts), insight "Your [emotion] intensity has decreased by X%".
- **Final Tips** section (from the PDF): daily check-in, 10-min emotion meditation, response rehearsal, "You cannot stop the waves…" quote.

### 3.3 Dashboard
- Three circular mastery rings (Anger/Shame/Fear), total practices, most-improved emotion, focus suggestion (hidden until the user has data).
- Weekly summary bar chart (practices per emotion, last 7 days), trend text, next-milestone text.
- Achievement badges: Anger Alchemist (10), Shame Shifter (10), Fear Facer (10), Emotion Master (30 total).

### 3.4 Cross-cutting
- **Localization:** every user-facing string in EN and RU; selections stored as stable keys and rendered in the active language (legacy English-string entries still localize).
- **Persistence:** localStorage under `eqTrainerData`; JSON export/import with damaged-backup protection; render-error boundary.
- **Portability:** works from `file://` (relative asset paths, no secure-context-only APIs).
- **Accessibility/UX:** responsive to 360px, `prefers-reduced-motion` respected, theme-color/meta description set.

## 4. Non-goals (v1)
- No accounts, sync, or backend; no push notifications; no Uzbek localization (candidate for v2); no automated test suite (manual QA checklist in README).

## 5. Success criteria
- All checklist items from the docx spec verified working (audited + browser-tested).
- A user can complete a full practice on day 1 without instructions.
- Data survives reload, export/import round-trip, and language switching.

## 6. Research base (video sources)

Per the owner's direction, quotes and phrases in the app are sourced from these videos (Marc Brackett — Yale Center for Emotional Intelligence, RULER method, "Permission to Feel"; Daniel Goleman):

1. https://youtu.be/SWvHZkkrAjc — Brackett: mastering emotions (emotion scientist vs. emotion judge, granular labeling, permission to feel)
2. https://youtu.be/FBgM7jndkLQ — Brackett on Huberman Lab: regulation (Meta-Moment: trigger → pause → best self → respond; PRIME goals; strategy depends on emotion + person + context; anxiety/stress/pressure/fear distinctions)
3. https://www.youtube.com/watch?v=erfgEHHfFkU — Goleman: the 4 EI domains (self-awareness is foundational; EI is learnable at any age)
4. https://www.youtube.com/watch?v=bUhMnQE22lM — Goleman, "Emotional Intelligence" part 1 (two minds; the amygdala hijack; emotions as action programs)
5. https://youtu.be/HTfYv3IEOqM — Goleman on Focus (inner/other/outer attention; attention as a trainable mental muscle)

**Principles the app embodies (v1):** anti-suppression framing; notice-don't-react (amygdala-hijack pause training); daily check-ins as the Recognize/Understand steps; precise emotion naming (granularity); 4-7-8 breathing as pause creation; response rehearsal; curiosity-framed (non-judging) feedback copy; practice streaks as deliberate training.

## 7. v2 roadmap (research-grounded)

1. **Mood Meter check-in** — 2-axis (pleasantness × energy) quadrant picker before labeling (Brackett, Mood Meter).
2. **Emotion vocabulary expansion** — 8–12 granular labels per quadrant/module, stored as stable keys per the existing `OPTION_LABELS` convention (granularity is itself regulating).
3. **Meta-Moment guided flow** — trigger → pause → "what would my best self do?" → respond; launchable anywhere, logged to journal (Brackett/Huberman).
4. **Best-self profile** — user defines their best self per role; surfaced in Meta-Moments and the Day-31 ritual.
5. **Pleasant-emotion savoring track** — log + savor positive moments (PRIME: regulation includes maintaining/enhancing pleasant states).
6. **Context-aware strategy picker** — suggest 2–3 strategies filtered by emotion and situation; track which worked (ER = goals + strategies as a function of emotion, person, context).
7. **Temporal-distancing prompt** — "How will this matter in a week / a year?" optional field (evidence-based reappraisal).
8. **Uzbek localization** — third language using the existing `{en, ru}` → `{en, ru, uz}` string convention.

## 8a. Design system v2 (owner-directed re-theme, 2026-07-28 — CURRENT)

Sources fixed by the owner (studied live on Mobbin): **Mindvalley iOS** = overall design language, **Cosmos iOS** = brand colors, **Breathwrk iOS** = breathing session. No emojis anywhere (owner directive).

- **Palette (Cosmos):** page `#FAF7F1` warm cream; surfaces pure white, borderless, soft shadow, radius 14; text `#141414` / `#8A8A84`; single interactive accent pink-lilac `#DCA6D6`; completion olive `#565A2B`; earth tones for modules/weeks (clay `#B0563C`, brown `#5C4632`, olive, mauve `#9A6B93`); gold `#F5A623` reserved for badges/streak. Single theme (no dark mode toggle — dark exists only as poster/session surfaces, like the sources).
- **Structure (Mindvalley):** heavy grotesk headlines, no serif in UI chrome; tiny-caps metadata; every button a pill — black `#111` fill primary, white-on-dark, outlined secondary on dark; dark `#101014` hero surfaces with abstract violet/mauve blur blobs; emotion modules as full-color "quest poster" cards (caps subtitle + heavy white title + white progress meter); one lavender gradient (`#C7C2EF→#F5F3FB`) insight card per screen, everything else flat.
- **Session (Breathwrk):** constant `#1F242E` blue-charcoal field with smoky blobs; three concentric white-opacity circles (0.22/0.12/0.05) that scale with the 4-7-8 phases; letterspaced phase word; 64px light-weight per-second countdown; translucent pill Stop; Escape exits.
- **Charts:** single accent series `#DCA6D6`, gridlines `#EFEBE3`, large light-weight numerals.

## 8b. Design system v1.1 (superseded, kept for history)

Grounded in two research passes: live pattern research on Mobbin (How We Feel, Stoic, Finch, Calm, Headspace, Duolingo, 5 Minute Journal) and UX-teardown research on the same category. Implemented:

- **Warm tonal palette** with automatic dark mode (`prefers-color-scheme`): bg `#f7f7f2`/`#121412`, brand `#0ca678`/`#38d9a9`, elevation by surface tone in dark, AA contrast.
- **Two typographic voices**: serif (Georgia stack) for emotional moments — greetings, quotes, day titles; sans for UI; letterspaced tiny-caps (`.caps`) for metadata ("TODAY · DAY 12 · WEEK 2").
- **Single-action home**: serif greeting → one dark "Today" hero card (Stoic pattern) → compact stat chips (streak/days/entries) → everything else demoted.
- **Gradient budget**: one gradient surface per screen; all other surfaces flat/neutral.
- **Program grammar** on journey day view (caps day-meta over serif week title, Headspace pattern).
- **Unlock path** (Duolingo mechanic, calm tone): the 30 days render as a winding vertical path along a dashed spine — done days filled with week color (✓), current day enlarged and pulsing, future days visible but dimmed, milestones (7/14/21/30) amber-ringed (★ when done), week headers as serif "chapter" cards; locked weeks hide their goal until reached.
- **Two-tier celebrations** (Duolingo mechanics, calm tone): everyday completion = toast; milestones = confetti overlay.
- **Full-screen breathing player** (Calm pattern): running 4-7-8 guide takes over the screen in the module's hue; Escape/Stop exits.
- **Accessibility**: ≥44px touch targets, `:focus-visible` rings, `prefers-reduced-motion` (breathing circle stays static), pill buttons.
- **Privacy as feature**: "Your journal never leaves this device" trust line in the footer.

Deferred design backlog (from the same research): one-question-per-screen practice wizard, prompt-starter chips above textareas, streak freezes/repair, shareable milestone recap cards, week strip on the dashboard, emotion picker as colored word-circles (pairs with the v2 Mood Meter). The Duolingo unlock path shipped 2026-07-28 (see above).
