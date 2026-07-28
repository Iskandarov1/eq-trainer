# EQ Trainer — Product Requirements Document

**Owner:** Sanjar Iskandarov · **Status:** v1.0 shipped · **Sources of truth:** `Daniel Goleman 1 month plan.pdf`, `Add a _Next Level_ section .docx` (both in `Desktop\Другие`)

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
- Three emotion modules — **Anger** ("The Fire That Burns — or Builds"), **Shame** ("The Silent Saboteur"), **Fear** ("The Ancient Protector") — each with:
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
