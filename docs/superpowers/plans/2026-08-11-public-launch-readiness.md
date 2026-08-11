# Public Launch Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn eq-trainer.com from a public demo running in single-browser local mode into a product a stranger can sign up for, trust, recover access to, and load quickly — without deploying anything.

**Architecture:** The multi-user layer already exists and is dormant (`src/config.js` empty). This plan makes the client ready for it: web-only build with on-demand chunks, an auth screen that explains itself and handles email confirmation and password recovery, a privacy note, self-service account deletion, and a one-command deploy script that is written but **not run**.

**Tech Stack:** React 18, Vite 6, `@supabase/supabase-js` v2, recharts, pdf-lib + fontkit. No new dependencies (`CLAUDE.md` rule).

## Global Constraints

- **NO DEPLOYMENT.** `npm run deploy` is written in Task 1 but must never be executed during this plan. The owner reviews locally first.
- **No new dependencies.** `CLAUDE.md`: "add no further dependencies."
- **No test framework exists.** Verification per task = `npm run build` succeeds + a browser check against `npm run dev` (http://localhost:5173) + `node scripts/test-pdf.mjs` where PDFs are touched. Do not add a test runner.
- **All user-facing text lives in `src/content.js`** as `{en, ru, uz}` and renders via `L(lang, s)` or `t()`. Never hardcode display text in components.
- **Uzbek orthography:** Latin script, `ʻ` (U+02BB) for oʻ/gʻ, `ʼ` (U+02BC) for tutuq belgisi.
- **No emojis anywhere.** Typographic glyphs (✓ ★ ✧ ‹ ›) are allowed.
- **Design system v2:** cream `#FAF7F1` page, white borderless cards radius 14, black pill buttons, single accent `#DCA6D6`, olive `#565A2B` for completion. No colored buttons. Max one `.insight-tint` card per screen. Min 44px touch targets.
- **All state changes go through `update(fn)`** (structuredClone + save); never mutate `data` directly.
- **Sync invariants (PRD §3.5):** `api.js` is the only Supabase surface. Entries are append-only inserts; error 23505 counts as success; never upsert entries. Journey-day ops send only their own columns.
- **Never gate the app on a live session** — gate on cached uid + cached data. A failed offline token refresh degrades to offline mode, not a login screen.
- **CSS:** `color-mix()` needs a plain fallback declaration on the preceding line; keep the ≤480px and `prefers-reduced-motion` media queries intact.
- Commit after every task.

---

### Task 1: Web-only build, deploy script, and rule updates

Drops the `file://` constraint the owner released, so later tasks may use dynamic `import()`. Also replaces manual file-copying with a script — written, not run.

**Files:**
- Modify: `vite.config.js:6`
- Modify: `package.json:6-10`
- Create: `scripts/deploy.mjs`
- Modify: `CLAUDE.md` (Stack section, Commands section, QA checklist)

**Interfaces:**
- Consumes: nothing.
- Produces: a build served from the domain root (`/assets/...`), and permission for all later tasks to use dynamic `import()`.

- [ ] **Step 1: Switch the build base to the domain root**

`base: './'` produces relative asset URLs, which break dynamically-imported chunks. nginx serves this app from the root of eq-trainer.com.

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
})
```

- [ ] **Step 2: Write the deploy script**

Create `scripts/deploy.mjs`. `assets/` is replaced wholesale rather than merged, so old content-hashed bundles do not accumulate on the server.

```js
/* Build and publish to eq-trainer.com. Run with: npm run deploy */
import { execFileSync } from 'node:child_process'

const HOST = 'root@169.58.92.31'
const ROOT = '/var/www/eq-trainer.com'
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' })

run(npm, ['run', 'build'])
// Replace assets/ rather than merging: content-hashed bundles never overwrite
// each other, so a merge would pile up every past build forever.
run('ssh', [HOST, `rm -rf ${ROOT}/assets`])
run('scp', ['-r', 'dist/index.html', 'dist/assets', `${HOST}:${ROOT}/`])

console.log('\nDeployed → https://eq-trainer.com')
```

- [ ] **Step 3: Register the script**

In `package.json`, add to `"scripts"` (keep the existing three):

```json
    "deploy": "node scripts/deploy.mjs"
```

- [ ] **Step 4: Update CLAUDE.md so the rules match the code**

In the **Stack** section, replace the sentence about `base: './'` and the single-bundle rule with:

```markdown
- React 18 + Vite 6 (`base: '/'` — the app is served from the root of eq-trainer.com). Web-only since 2026-08-11: the `file://` / desktop-launcher path was retired, so dynamic `import()` and code splitting are allowed and used (PDF generator, fonts, and charts load on demand).
```

In the **Commands** section, add:

```markdown
- `npm run deploy` — build and publish to eq-trainer.com (root@169.58.92.31:/var/www/eq-trainer.com)
```

In the **QA checklist**, replace "save a practice from `dist/index.html` opened from disk" with:

```markdown
`npm run build`, then `npm run preview` and verify: save a practice; import a backup with `entries:{}` (must not white-screen); RU and UZ mode journal shows localized labels/values; new profile shows no focus suggestion; two same-day entries get unique chart labels; opening Reports downloads a PDF (lazy chunk loads).
```

Also remove the now-false clause "No secure-context-only APIs (`crypto.randomUUID` etc.) without a fallback — the app runs on `file://`" and replace with:

```markdown
- `newId()` keeps its non-crypto fallback (harmless, and server `entries.id` is uuid-typed).
```

- [ ] **Step 5: Verify the build and record the baseline size**

Run: `npm run build`
Expected: succeeds; `dist/index.html` references `/assets/index-*.js` (leading slash, not `./assets/`).
**Record the reported raw and gzip sizes in the commit message** — Tasks 2 and 3 are measured against them. Current baseline: 2,378.58 kB raw / 925.77 kB gzip.

- [ ] **Step 6: Commit**

```bash
git add vite.config.js package.json scripts/deploy.mjs CLAUDE.md
git commit -m "Web-only build: root base, deploy script, updated rules"
```

---

### Task 2: Load the PDF generator on demand

`src/pdf.js` pulls in pdf-lib, fontkit, and two base64 font modules (~310 kB of source). None of it is needed to render the dashboard.

**Files:**
- Modify: `src/App.jsx:7` (remove import), `src/App.jsx:77-88` (dynamic import inside callback)
- Modify: `src/components/Reports.jsx:5` (remove import), `src/components/Reports.jsx:46-57` (dynamic import inside handler)

**Interfaces:**
- Consumes: dynamic `import()` permission from Task 1.
- Produces: `src/pdf.js` in its own chunk, loaded only when a report is generated. No API change — `buildEntryReport`, `buildDayReport`, `downloadPdf` keep their signatures.

- [ ] **Step 1: Remove the static import in App.jsx**

Delete line 7 entirely:

```js
import { buildEntryReport, buildDayReport } from './pdf.js'
```

- [ ] **Step 2: Import inside the sync callback**

The `pdf` callback passed to `api.wireSync` is already `async`. Replace the callback body's first lines so the module loads at call time:

```js
      pdf: async (op) => {
        const d = dataRef.current
        const { buildEntryReport, buildDayReport } = await import('./pdf.js')
        if (op.kind === 'entry') {
          for (const k of EMOTION_KEYS) {
            const e = d.entries[k].find((x) => x.id === op.refId)
            if (e) return buildEntryReport({ entry: e, emotion: k, lang: d.lang, uid: user.uid })
          }
          return null
        }
        const dd = d.journey.days[op.refId]
        return dd?.done ? buildDayReport({ day: op.refId, dayData: dd, lang: d.lang, uid: user.uid }) : null
      },
```

- [ ] **Step 3: Remove the static import in Reports.jsx**

Delete line 5 entirely:

```js
import { buildEntryReport, buildDayReport, downloadPdf } from '../pdf.js'
```

- [ ] **Step 4: Import inside the download handler**

`download` is already `async`. Replace it:

```js
  const download = async (r) => {
    try {
      const { buildEntryReport, buildDayReport, downloadPdf } = await import('../pdf.js')
      const built = r.kind === 'entry'
        ? await buildEntryReport({ entry: r.entry, emotion: r.emotion, lang, uid: user.uid })
        : await buildDayReport({ day: r.day, dayData: r.dayData, lang, uid: user.uid })
      const d = new Date(r.at)
      const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      downloadPdf(built.bytes, `${stamp} — ${title(r)}.pdf`)
    } catch {
      notify(t('reportPdfError'))
    }
  }
```

- [ ] **Step 5: Verify the split and that PDFs still work**

Run: `npm run build`
Expected: a separate chunk appears in the output (e.g. `dist/assets/pdf-*.js`) and the main `index-*.js` gzip size drops substantially. Record the new numbers.

Run: `node scripts/test-pdf.mjs`
Expected: passes in EN/RU/UZ with no missing glyphs.

Run: `npm run dev`, open http://localhost:5173, save one Anger practice, go to **Reports**, click download on that record.
Expected: a PDF file downloads and opens correctly.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/components/Reports.jsx
git commit -m "Load PDF generator and fonts on demand"
```

---

### Task 3: Load charts on demand

recharts (with its d3 dependencies) is the other large block. Extracting each chart into its own module lets `React.lazy` isolate it.

**Files:**
- Create: `src/components/charts/WeeklyBars.jsx`
- Create: `src/components/charts/IntensityLine.jsx`
- Modify: `src/components/Dashboard.jsx:2` (remove recharts import), `:108-117` (use lazy component)
- Modify: `src/components/EmotionModule.jsx:2` (remove recharts import), `:358-366` (use lazy component)

**Interfaces:**
- Consumes: dynamic `import()` permission from Task 1.
- Produces:
  - `WeeklyBars({ data })` — default export; `data` is `[{ name: string, count: number }]`.
  - `IntensityLine({ data })` — default export; `data` is `[{ date: string, intensity: number }]`.

- [ ] **Step 1: Create the bar chart module**

Create `src/components/charts/WeeklyBars.jsx`. This is the exact markup lifted from `Dashboard.jsx:108-117`:

```jsx
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

/* Split out of Dashboard so recharts loads on demand, not at first paint. */
export default function WeeklyBars({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -24 }}>
        <XAxis dataKey="name" tick={{ fontSize: 13 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill="#dca6d6" />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 2: Create the line chart module**

Create `src/components/charts/IntensityLine.jsx`, lifted from `EmotionModule.jsx:358-366`:

```jsx
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/* Split out of EmotionModule so recharts loads on demand, not at first paint. */
export default function IntensityLine({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -18 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#efebe3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="intensity" stroke="#dca6d6" strokeWidth={3} dot={{ r: 5, fill: '#dca6d6' }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 3: Use the lazy chart in Dashboard**

In `src/components/Dashboard.jsx`, delete the recharts import on line 2 and add after the remaining imports:

```jsx
const WeeklyBars = React.lazy(() => import('./charts/WeeklyBars.jsx'))
```

Replace the `<ResponsiveContainer>…</ResponsiveContainer>` block at lines 108-117 with:

```jsx
        <React.Suspense fallback={<div style={{ height: 220 }} />}>
          <WeeklyBars data={weeklyData} />
        </React.Suspense>
```

The empty fallback holds the chart's height so the page does not jump while the chunk loads.

- [ ] **Step 4: Use the lazy chart in EmotionModule**

In `src/components/EmotionModule.jsx`, delete the recharts import on line 2 and add after the remaining imports:

```jsx
const IntensityLine = React.lazy(() => import('./charts/IntensityLine.jsx'))
```

Replace the `<ResponsiveContainer>…</ResponsiveContainer>` block at lines 358-366 with:

```jsx
            <React.Suspense fallback={<div style={{ height: 260 }} />}>
              <IntensityLine data={series} />
            </React.Suspense>
```

- [ ] **Step 5: Verify both charts still render**

Run: `npm run build`
Expected: a recharts chunk is emitted separately; main bundle gzip drops again. Record the numbers.

Run: `npm run dev`, then:
- Dashboard → the weekly bar chart renders (with data present; a fresh profile shows zero bars, which is correct).
- Next Level → Anger → **Progress** tab with at least 2 entries → the intensity line renders.

Expected: both charts appear, no layout jump, no console errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/charts src/components/Dashboard.jsx src/components/EmotionModule.jsx
git commit -m "Load charts on demand"
```

---

### Task 4: Privacy note

The only user-facing piece reviewable locally today (it must work in local mode too), so it comes before the Supabase-gated screens.

**Files:**
- Create: `src/components/Privacy.jsx`
- Modify: `src/content.js` (UI table — add keys)
- Modify: `src/App.jsx` (route type comment, nav wiring, footer link, `Breadcrumbs`)

**Interfaces:**
- Consumes: `AppCtx` (`t`, `go`).
- Produces: route `{ page: 'privacy' }`; UI keys `privacyNav`, `privacyTitle`, `privacyIntro`, `privacyWhat`, `privacyWhatBody`, `privacyWho`, `privacyWhoBody`, `privacyWhere`, `privacyWhereBody`, `privacyDelete`, `privacyDeleteBody`, `privacyContact`.

- [ ] **Step 1: Add the strings**

In `src/content.js`, in the `UI` table (add a `// ---- privacy ----` block near the auth-screen block):

```js
  // ---- privacy ----
  privacyNav: { en: 'Privacy', ru: 'Конфиденциальность', uz: 'Maxfiylik' },
  privacyTitle: { en: 'Your privacy', ru: 'Ваша конфиденциальность', uz: 'Sizning maxfiyligingiz' },
  privacyIntro: {
    en: 'This app asks you to write about anger, shame and fear. That is personal. Here is exactly what happens to what you write.',
    ru: 'Это приложение просит вас писать о гневе, стыде и страхе. Это личное. Вот что именно происходит с тем, что вы пишете.',
    uz: 'Bu ilova sizdan gʻazab, uyat va qoʻrquv haqida yozishni soʻraydi. Bu shaxsiy narsa. Yozganlaringiz bilan nima sodir boʻlishi mana shu.',
  },
  privacyWhat: { en: 'What is stored', ru: 'Что хранится', uz: 'Nima saqlanadi' },
  privacyWhatBody: {
    en: 'Your journal answers, the days you complete, your chosen language, and a PDF copy of each daily record. Your email address is stored so you can sign in. Nothing else is collected — there is no tracking and no analytics.',
    ru: 'Ваши ответы в дневнике, завершённые дни, выбранный язык и PDF-копия каждой ежедневной записи. Ваш адрес почты хранится, чтобы вы могли входить. Больше ничего не собирается — никакого отслеживания и никакой аналитики.',
    uz: 'Kundalikdagi javoblaringiz, tugatgan kunlaringiz, tanlagan tilingiz va har bir kunlik yozuvning PDF nusxasi. Pochta manzilingiz kirish uchun saqlanadi. Boshqa hech narsa yigʻilmaydi — kuzatuv ham, tahlil ham yoʻq.',
  },
  privacyWho: { en: 'Who can read it', ru: 'Кто может это читать', uz: 'Kim oʻqiy oladi' },
  privacyWhoBody: {
    en: 'You. Other users cannot reach your records — the database refuses their requests, so this does not depend on the app behaving correctly. One honest exception: the person who runs this service holds the database keys and could technically open the raw data. The policy is that they do not. If that is not good enough for something you want to write, do not write it here.',
    ru: 'Вы. Другие пользователи не могут добраться до ваших записей — база данных отклоняет их запросы, поэтому это не зависит от правильной работы приложения. Одно честное исключение: у человека, который поддерживает этот сервис, есть ключи от базы, и технически он может открыть данные. Правило — этого не делать. Если такой гарантии вам недостаточно для чего-то, что вы хотите написать, не пишите это здесь.',
    uz: 'Siz. Boshqa foydalanuvchilar yozuvlaringizga yeta olmaydi — maʼlumotlar bazasi ularning soʻrovlarini rad etadi, shuning uchun bu ilovaning toʻgʻri ishlashiga bogʻliq emas. Bitta halol istisno: bu xizmatni yuritadigan odamda baza kalitlari bor va u texnik jihatdan maʼlumotlarni ocha oladi. Qoida — buni qilmaslik. Agar yozmoqchi boʻlgan narsangiz uchun bu kafolat yetarli boʻlmasa, uni bu yerga yozmang.',
  },
  privacyWhere: { en: 'Where it is kept', ru: 'Где это хранится', uz: 'Qayerda saqlanadi' },
  privacyWhereBody: {
    en: 'On servers in Frankfurt, Germany, encrypted in transit and at rest. A copy also stays in your own browser so the app keeps working offline.',
    ru: 'На серверах во Франкфурте, Германия, в зашифрованном виде при передаче и хранении. Копия также остаётся в вашем браузере, чтобы приложение работало офлайн.',
    uz: 'Frankfurtdagi (Germaniya) serverlarda, uzatishda ham, saqlashda ham shifrlangan holda. Nusxasi brauzeringizda ham qoladi — shunda ilova oflayn ishlaydi.',
  },
  privacyDelete: { en: 'Deleting everything', ru: 'Удаление всего', uz: 'Hammasini oʻchirish' },
  privacyDeleteBody: {
    en: 'You can delete your account at any time from the bottom of any page. That removes your entries, your stored PDFs and your login itself. It cannot be undone, and no backup copy of your journal is kept for you afterwards.',
    ru: 'Вы можете удалить аккаунт в любой момент — внизу любой страницы. Это удаляет ваши записи, сохранённые PDF и сам вход. Отменить это нельзя, и резервная копия дневника для вас после этого не сохраняется.',
    uz: 'Hisobingizni istalgan vaqtda oʻchira olasiz — istalgan sahifaning pastidan. Bu yozuvlaringizni, saqlangan PDF fayllaringizni va kirish hisobingizni oʻchiradi. Buni qaytarib boʻlmaydi va keyin siz uchun zaxira nusxa saqlanmaydi.',
  },
  privacyContact: {
    en: 'Questions about your data: sanjar.i@maydongroup.com',
    ru: 'Вопросы о ваших данных: sanjar.i@maydongroup.com',
    uz: 'Maʼlumotlaringiz haqida savollar: sanjar.i@maydongroup.com',
  },
```

- [ ] **Step 2: Create the Privacy page**

Create `src/components/Privacy.jsx`:

```jsx
import React, { useContext } from 'react'
import { AppCtx } from '../App.jsx'

/* Plain-language privacy note. Reachable in local mode too — a visitor must be
   able to read it before deciding to create an account. */
export default function Privacy() {
  const { t } = useContext(AppCtx)
  const sections = [
    ['privacyWhat', 'privacyWhatBody'],
    ['privacyWho', 'privacyWhoBody'],
    ['privacyWhere', 'privacyWhereBody'],
    ['privacyDelete', 'privacyDeleteBody'],
  ]
  return (
    <div>
      <div className="hero"><h1>{t('privacyTitle')}</h1><div className="q">{t('privacyIntro')}</div></div>
      <div className="card">
        {sections.map(([head, body]) => (
          <div key={head} style={{ marginBottom: 18 }}>
            <h3 style={{ marginBottom: 6 }}>{t(head)}</h3>
            <p className="muted">{t(body)}</p>
          </div>
        ))}
        <p className="small muted" style={{ marginTop: 20 }}>{t('privacyContact')}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Wire it into App.jsx**

Add the import alongside the other component imports:

```jsx
import Privacy from './components/Privacy.jsx'
```

Update the route comment on line 37 to include `'privacy'`:

```jsx
  // route: {page:'home'|'journey'|'nextlevel'|'module'|'breathe'|'reports'|'privacy', emotion?}
```

Add to the `<main>` block after the Reports line:

```jsx
        {route.page === 'privacy' && <Privacy />}
```

Add to `Breadcrumbs` after the reports line:

```jsx
  if (route.page === 'privacy') parts.push({ label: t('privacyNav') })
```

Add a link in `.footer-actions` after the import button (keep the hidden file input last):

```jsx
        <button className="btn ghost sm" onClick={() => go({ page: 'privacy' })}>{t('privacyNav')}</button>
```

Note: `go` is already in scope in `TrainerApp`. It is **not** added to the header nav — the nav is for practice, not policy.

- [ ] **Step 4: Verify**

Run: `npm run build` → succeeds.
Run: `npm run dev` → click **Privacy** in the footer.
Expected: the page renders with all four sections, breadcrumb reads "Dashboard › Privacy", and switching EN/RU/UZ translates every section including the contact line.

- [ ] **Step 5: Commit**

```bash
git add src/components/Privacy.jsx src/content.js src/App.jsx
git commit -m "Privacy note, reachable from every page"
```

---

### Task 5: Auth screen — onboarding intro and a local preview route

A stranger currently sees an "EQ" mark and two input fields with no explanation. `AuthScreen` only renders when Supabase is configured, which it is not yet — so this task also adds a **dev-only** way to look at it.

**Files:**
- Modify: `src/content.js` (UI table)
- Modify: `src/components/AuthScreen.jsx`
- Modify: `src/App.jsx:23-30` (dev preview branch)

**Interfaces:**
- Consumes: nothing.
- Produces: UI keys `authIntroTitle`, `authIntroWhat`, `authIntroTime`, `authIntroPrivate`, `authPrivacyLink`; dev-only URL `http://localhost:5173/?auth`.

- [ ] **Step 1: Add the strings**

In `src/content.js`, in the `// ---- auth screen ----` block:

```js
  authIntroTitle: {
    en: 'Train your emotional intelligence',
    ru: 'Тренируйте эмоциональный интеллект',
    uz: 'Hissiy intellektingizni mashq qiling',
  },
  authIntroWhat: {
    en: 'A 30-day guided practice based on Daniel Goleman’s work, plus modules for anger, shame and fear.',
    ru: 'Тридцатидневная практика по работам Дэниела Гоулмана, плюс модули по гневу, стыду и страху.',
    uz: 'Daniel Goulmanning ishlariga asoslangan 30 kunlik mashq, hamda gʻazab, uyat va qoʻrquv modullari.',
  },
  authIntroTime: {
    en: 'About 5–10 minutes a day.',
    ru: 'Примерно 5–10 минут в день.',
    uz: 'Kuniga taxminan 5–10 daqiqa.',
  },
  authIntroPrivate: {
    en: 'What you write is yours alone — no one else can read it.',
    ru: 'Написанное принадлежит только вам — никто другой не может это прочитать.',
    uz: 'Yozganlaringiz faqat sizniki — boshqa hech kim oʻqiy olmaydi.',
  },
  authPrivacyLink: { en: 'How your data is handled', ru: 'Как обращаются с вашими данными', uz: 'Maʼlumotlaringiz bilan qanday ish tutiladi' },
```

- [ ] **Step 2: Render the intro above the form**

In `src/components/AuthScreen.jsx`, replace the `<h1>` + hint paragraph (lines 57-60) with:

```jsx
        <h1 className="serif" style={{ textAlign: 'center' }}>{t('appName')}</h1>
        <p className="muted small" style={{ textAlign: 'center', margin: '6px 0 4px' }}>
          {mode === 'signin' ? t('authSignInHint') : t('authSignUpHint')}
        </p>
        {mode === 'signup' && (
          <div className="auth-intro">
            <h2 style={{ marginBottom: 6 }}>{t('authIntroTitle')}</h2>
            <p className="muted small">{t('authIntroWhat')}</p>
            <p className="muted small">{t('authIntroTime')}</p>
            <p className="muted small">{t('authIntroPrivate')}</p>
          </div>
        )}
```

The intro shows on **sign-up** only — a returning user signing in does not need the pitch.

- [ ] **Step 3: Style the intro block**

In `src/styles.css`, near the other `.auth-*` rules:

```css
.auth-intro {
  margin: 14px 0 18px;
  padding: 14px 16px;
  background: #f6f2ea;
  border-radius: 14px;
}
.auth-intro p { margin: 4px 0 0; }
```

- [ ] **Step 4: Add the dev-only preview branch**

`AuthScreen` is unreachable until Supabase is configured. In `src/App.jsx`, replace the body of `App()`:

```jsx
export default function App() {
  const [user, setUser] = useState(undefined) // undefined=resolving, null=needs sign-in
  useEffect(() => { api.resolveUser().then(setUser) }, [])

  // Dev-only: the auth screen is unreachable until Supabase is configured, so
  // `?auth` renders it for visual review. import.meta.env.DEV is false in the
  // production build, so this branch is dropped at build time.
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('auth')) {
    return <AuthScreen onAuthed={() => {}} />
  }

  if (user === undefined) return null
  if (user === null) return <AuthScreen onAuthed={setUser} />
  return <TrainerApp key={user.uid} user={user} />
}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`, open **http://localhost:5173/?auth**, click through to sign-up mode.
Expected: the intro block appears above the form in sign-up mode and disappears in sign-in mode; EN/RU/UZ all translate.

Run: `npm run build`
Expected: succeeds. Confirm the preview branch is gone from production by searching the built bundle:
`Select-String -Path dist/assets/index-*.js -Pattern "URLSearchParams" -SimpleMatch`
Expected: no match from this branch (if recharts or another dependency matches, confirm by checking `?auth` does nothing under `npm run preview`).

- [ ] **Step 6: Commit**

```bash
git add src/content.js src/components/AuthScreen.jsx src/styles.css src/App.jsx
git commit -m "Auth screen explains the app; dev-only ?auth preview"
```

---

### Task 6: Handle email confirmation at sign-up

With confirmation ON, `signUp` returns a user but **no session**. The current code caches the uid anyway and reports success, leaving the app in a phantom "signed in offline" state that queues writes it can never send.

**Files:**
- Modify: `src/api.js:39-44`
- Modify: `src/components/AuthScreen.jsx`
- Modify: `src/content.js`

**Interfaces:**
- Consumes: `signUp(email, password)` from `api.js`.
- Produces: `signUp` now resolves to either `{ uid, email }` (session present, unchanged shape) **or** `{ pending: true, email }` (confirmation required, nothing cached). Also `resendConfirmation(email)` → `Promise<void>`.

- [ ] **Step 1: Return a pending result instead of caching a sessionless user**

In `src/api.js`, replace `signUp`:

```js
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  // With "Confirm email" ON, Supabase returns a user but NO session. Caching the
  // uid here would put the app in a phantom "signed in offline" state, queueing
  // writes for an account that cannot yet accept them.
  if (!data.session) return { pending: true, email }
  rememberUser({ uid: data.user.id, email: data.user.email })
  return { uid: data.user.id, email: data.user.email }
}

export async function resendConfirmation(email) {
  const { error } = await supabase.auth.resend({ type: 'signup', email })
  if (error) throw error
}
```

- [ ] **Step 2: Add the strings**

In `src/content.js`, in the auth block:

```js
  authCheckTitle: { en: 'Confirm your email', ru: 'Подтвердите почту', uz: 'Pochtangizni tasdiqlang' },
  authCheckBody: {
    en: (email) => `We sent a confirmation link to ${email}. Open it to activate your account, then sign in.`,
    ru: (email) => `Мы отправили ссылку для подтверждения на ${email}. Откройте её, чтобы активировать аккаунт, затем войдите.`,
    uz: (email) => `${email} manziliga tasdiqlash havolasini yubordik. Hisobingizni faollashtirish uchun uni oching, soʻng kiring.`,
  },
  authCheckSpam: {
    en: 'No email after a minute? Check your spam folder.',
    ru: 'Письма нет через минуту? Проверьте папку «Спам».',
    uz: 'Bir daqiqadan keyin ham xat kelmadimi? «Spam» papkasini tekshiring.',
  },
  authResend: { en: 'Send it again', ru: 'Отправить ещё раз', uz: 'Qayta yuborish' },
  authResent: { en: 'Sent', ru: 'Отправлено', uz: 'Yuborildi' },
  authBackToSignIn: { en: '‹ Back to sign in', ru: '‹ Назад ко входу', uz: '‹ Kirishga qaytish' },
```

- [ ] **Step 3: Render the pending state**

In `src/components/AuthScreen.jsx`, add state and handle the pending result. Add to the existing `useState` block:

```jsx
  const [pending, setPending] = useState(null)   // email awaiting confirmation
  const [resent, setResent] = useState(false)
```

Change the `submit` success line from `onAuthed({ ...u, offline: false })` to:

```jsx
      const u = mode === 'signin' ? await signIn(email.trim(), password) : await signUp(email.trim(), password)
      if (u.pending) setPending(u.email)
      else onAuthed({ ...u, offline: false })
```

Add `resendConfirmation` to the import on line 3:

```jsx
import { signIn, signUp, resendConfirmation } from '../api.js'
```

Insert this before the existing `return (`, so the pending state replaces the form entirely:

```jsx
  if (pending) {
    return (
      <div className="auth-screen">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="logo-mark" style={{ margin: '0 auto 10px' }}>EQ</div>
          <h1 className="serif">{t('authCheckTitle')}</h1>
          <p className="muted" style={{ margin: '10px 0' }}>{t('authCheckBody', pending)}</p>
          <p className="small muted">{t('authCheckSpam')}</p>
          <button className="btn ghost sm" style={{ marginTop: 14 }} disabled={resent}
            onClick={async () => {
              try { await resendConfirmation(pending); setResent(true) } catch { /* rate-limited: the first mail is still on its way */ }
            }}>
            {resent ? t('authResent') : t('authResend')}
          </button>
          <button className="linklike" style={{ margin: '14px auto 0', display: 'block' }}
            onClick={() => { setPending(null); setMode('signin'); setResent(false) }}>
            {t('authBackToSignIn')}
          </button>
        </div>
      </div>
    )
  }
```

- [ ] **Step 4: Verify**

Run: `npm run build` → succeeds.

Live behaviour cannot be verified until the Supabase project exists (Task 9's owner steps). What **can** be checked now: `npm run dev`, open `http://localhost:5173/?auth`, and confirm the sign-up form still renders and the file has no syntax errors. Note in the commit that the confirmation round-trip is deferred to the post-Supabase verification pass.

- [ ] **Step 5: Commit**

```bash
git add src/api.js src/components/AuthScreen.jsx src/content.js
git commit -m "Handle email confirmation: pending state instead of phantom session"
```

---

### Task 7: Self-service password reset

`SETUP.md` currently makes recovery a manual dashboard task for the owner. On a public site that does not scale.

**Files:**
- Modify: `src/api.js` (two new functions)
- Create: `src/components/ResetPassword.jsx`
- Modify: `src/components/AuthScreen.jsx` (replace the dead-end `authForgot` line)
- Modify: `src/App.jsx` (recovery listener)
- Modify: `src/content.js`

**Interfaces:**
- Consumes: `supabase` client from `api.js`.
- Produces:
  - `requestPasswordReset(email)` → `Promise<void>`
  - `updatePassword(newPassword)` → `Promise<void>`
  - `onPasswordRecovery(cb)` → unsubscribe function; `cb()` fires when a recovery link is opened.
  - `<ResetPassword onDone={fn} />` — default export.

- [ ] **Step 1: Add the API functions**

In `src/api.js`, after `signIn`:

```js
export async function requestPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  })
  if (error) throw error
}

export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
  if (data?.user) rememberUser({ uid: data.user.id, email: data.user.email })
}

/* supabase-js consumes the recovery token from the URL hash on load and emits
   PASSWORD_RECOVERY. Nothing listened for it before, so recovery links opened
   the app as a normal signed-in session with no way to set a new password. */
export function onPasswordRecovery(cb) {
  if (!isConfigured) return () => {}
  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') cb()
  })
  return () => data.subscription.unsubscribe()
}
```

- [ ] **Step 2: Add the strings**

In `src/content.js`, in the auth block. **Replace** the existing `authForgot` value with the short link label:

```js
  authForgot: { en: 'Forgot your password?', ru: 'Забыли пароль?', uz: 'Parolni unutdingizmi?' },
  authResetTitle: { en: 'Reset your password', ru: 'Сброс пароля', uz: 'Parolni tiklash' },
  authResetBody: {
    en: 'Enter your email and we will send you a link to set a new password.',
    ru: 'Введите почту, и мы пришлём ссылку для установки нового пароля.',
    uz: 'Pochtangizni kiriting — yangi parol oʻrnatish uchun havola yuboramiz.',
  },
  authResetSend: { en: 'Send the link', ru: 'Отправить ссылку', uz: 'Havolani yuborish' },
  authResetSent: {
    en: (email) => `If ${email} has an account, a reset link is on its way.`,
    ru: (email) => `Если у ${email} есть аккаунт, ссылка для сброса уже отправлена.`,
    uz: (email) => `Agar ${email} uchun hisob mavjud boʻlsa, tiklash havolasi yuborildi.`,
  },
  authNewTitle: { en: 'Choose a new password', ru: 'Выберите новый пароль', uz: 'Yangi parol tanlang' },
  authNewSave: { en: 'Save the new password', ru: 'Сохранить новый пароль', uz: 'Yangi parolni saqlash' },
  authNewDone: { en: 'Password changed', ru: 'Пароль изменён', uz: 'Parol oʻzgartirildi' },
```

The "sent" wording deliberately does not confirm whether the address is registered — that would let anyone test which emails have accounts.

- [ ] **Step 3: Create the new-password screen**

Create `src/components/ResetPassword.jsx`:

```jsx
import React, { useState } from 'react'
import { L, UI } from '../content.js'
import { updatePassword } from '../api.js'

/* Shown when the app is opened from a recovery link. Runs outside the app
   context (no user data loaded yet), so language is read the same way the
   auth screen reads it. */
export default function ResetPassword({ onDone }) {
  const lang = (() => {
    const l = localStorage.getItem('eqAuthLang')
    return l === 'ru' || l === 'uz' || l === 'en' ? l : 'en'
  })()
  const t = (k, ...args) => {
    const v = L(lang, UI[k])
    return typeof v === 'function' ? v(...args) : v
  }
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setError(null)
    if (password.length < 8) { setError(t('authErrWeak')); return }
    setBusy(true)
    try {
      await updatePassword(password)
      onDone()
    } catch (err) {
      setError(String(err?.message || err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="logo-mark" style={{ margin: '0 auto 10px' }}>EQ</div>
        <h1 className="serif" style={{ textAlign: 'center' }}>{t('authNewTitle')}</h1>
        <form onSubmit={submit} className="grid" style={{ gap: 12, marginTop: 16 }}>
          <div>
            <label className="field-label" htmlFor="new-pass">{t('authPassword')}</label>
            <input id="new-pass" type="password" required minLength={8} autoComplete="new-password"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="btn" type="submit" disabled={busy}>{busy ? '…' : t('authNewSave')}</button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Add the request-reset mode to AuthScreen**

In `src/components/AuthScreen.jsx`, extend the import on line 3:

```jsx
import { signIn, signUp, resendConfirmation, requestPasswordReset } from '../api.js'
```

Add state next to the others:

```jsx
  const [resetSent, setResetSent] = useState(null)
```

The `mode` state gains a third value `'reset'`. Replace the static `authForgot` paragraph (the last line before the closing `</div>`) with a button that enters reset mode:

```jsx
        {mode === 'signin' && (
          <button className="linklike" style={{ margin: '10px auto 0', display: 'block' }}
            onClick={() => { setMode('reset'); setError(null) }}>
            {t('authForgot')}
          </button>
        )}
```

Insert this block immediately before the `if (pending)` block added in Task 6:

```jsx
  if (mode === 'reset') {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="logo-mark" style={{ margin: '0 auto 10px' }}>EQ</div>
          <h1 className="serif" style={{ textAlign: 'center' }}>{t('authResetTitle')}</h1>
          {resetSent ? (
            <p className="muted" style={{ textAlign: 'center', margin: '12px 0' }}>{t('authResetSent', resetSent)}</p>
          ) : (
            <>
              <p className="muted small" style={{ textAlign: 'center', margin: '8px 0 14px' }}>{t('authResetBody')}</p>
              <form className="grid" style={{ gap: 12 }} onSubmit={async (e) => {
                e.preventDefault()
                if (busy) return
                setBusy(true)
                try { await requestPasswordReset(email.trim()); setResetSent(email.trim()) } catch { setError(t('authErrNetwork')) } finally { setBusy(false) }
              }}>
                <div>
                  <label className="field-label" htmlFor="reset-email">{t('authEmail')}</label>
                  <input id="reset-email" type="email" required autoComplete="email"
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                {error && <div className="auth-error">{error}</div>}
                <button className="btn" type="submit" disabled={busy}>{busy ? '…' : t('authResetSend')}</button>
              </form>
            </>
          )}
          <button className="linklike" style={{ margin: '14px auto 0', display: 'block' }}
            onClick={() => { setMode('signin'); setResetSent(null); setError(null) }}>
            {t('authBackToSignIn')}
          </button>
        </div>
      </div>
    )
  }
```

- [ ] **Step 5: Listen for recovery links in App.jsx**

Add the import:

```jsx
import ResetPassword from './components/ResetPassword.jsx'
```

Extend `App()` with recovery state (keeping the dev preview branch from Task 5):

```jsx
export default function App() {
  const [user, setUser] = useState(undefined)
  const [recovering, setRecovering] = useState(false)
  useEffect(() => { api.resolveUser().then(setUser) }, [])
  useEffect(() => api.onPasswordRecovery(() => setRecovering(true)), [])

  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('auth')) {
    return <AuthScreen onAuthed={() => {}} />
  }

  if (recovering) return <ResetPassword onDone={() => { setRecovering(false); window.location.replace(window.location.pathname) }} />
  if (user === undefined) return null
  if (user === null) return <AuthScreen onAuthed={setUser} />
  return <TrainerApp key={user.uid} user={user} />
}
```

`window.location.replace(window.location.pathname)` clears the recovery token from the URL so a reload does not re-enter the flow.

- [ ] **Step 6: Verify**

Run: `npm run build` → succeeds.
Run: `npm run dev`, open `http://localhost:5173/?auth`, click **Forgot your password?**
Expected: the reset form renders and "Back to sign in" returns to the form. Submitting cannot work until Supabase exists — note that in the commit.

- [ ] **Step 7: Commit**

```bash
git add src/api.js src/components/ResetPassword.jsx src/components/AuthScreen.jsx src/App.jsx src/content.js
git commit -m "Self-service password reset with recovery landing"
```

---

### Task 8: Account deletion

Erasure is an EU legal right and the right default for this content. The client can delete its own rows and files under RLS, but **not** its own `auth.users` record — that needs a `security definer` function.

**Files:**
- Modify: `supabase-setup.sql` (append the function)
- Modify: `src/api.js` (`deleteAccount`)
- Modify: `src/App.jsx` (account row action + confirmation modal)
- Modify: `src/content.js`

**Interfaces:**
- Consumes: `supabase` client; `storageList`/bucket conventions already in `api.js`.
- Produces: SQL function `public.delete_own_account()`; `deleteAccount()` → `Promise<void>`.

- [ ] **Step 1: Append the SQL function**

Add to the end of `supabase-setup.sql`:

```sql
-- ---------------------------------------------------------------------------
-- Self-service erasure. security definer is required for two reasons: a user
-- cannot delete their own auth.users record, and the reports bucket has no
-- delete policy by design (the PDF archive is append-only, see above).
-- auth.uid() inside the function is still the CALLER's id, so this can only
-- ever erase the caller's own account.
--
-- profiles, journey_days and entries all declare
--   references auth.users(id) on delete cascade
-- so deleting the auth user removes every row. Only storage needs explicit
-- handling, because objects are addressed by folder name, not a foreign key.
-- ---------------------------------------------------------------------------
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

  delete from storage.objects
   where bucket_id = 'reports'
     and (storage.foldername(name))[1] = me::text;

  delete from auth.users where id = me;
end $$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
```

Note the storage predicate matches the `reports_select` / `reports_insert` policies already in the file — objects are namespaced by `<uid>/…`, so the first path segment is the owner.

- [ ] **Step 2: Add the API function**

In `src/api.js`, near `signOut`:

```js
/* Irreversible: removes the caller's rows, stored PDFs and login. The queue and
   local cache go too, otherwise a flush would try to re-create deleted rows. */
export async function deleteAccount() {
  const { error } = await supabase.rpc('delete_own_account')
  if (error) throw error
  await supabase.auth.signOut().catch(() => {})
}
```

- [ ] **Step 3: Add the strings**

In `src/content.js`:

```js
  deleteAccount: { en: 'Delete account', ru: 'Удалить аккаунт', uz: 'Hisobni oʻchirish' },
  deleteTitle: { en: 'Delete your account?', ru: 'Удалить ваш аккаунт?', uz: 'Hisobingiz oʻchirilsinmi?' },
  deleteBody: {
    en: 'This removes every entry, every stored PDF and your login itself. It cannot be undone. Export your data first if you want to keep a copy.',
    ru: 'Это удалит все записи, все сохранённые PDF и сам вход. Отменить нельзя. Сначала выгрузите данные, если хотите сохранить копию.',
    uz: 'Bu barcha yozuvlarni, saqlangan PDF fayllarni va kirish hisobingizni oʻchiradi. Buni qaytarib boʻlmaydi. Nusxa saqlamoqchi boʻlsangiz, avval maʼlumotlaringizni yuklab oling.',
  },
  deleteConfirm: { en: 'Yes, delete everything', ru: 'Да, удалить всё', uz: 'Ha, hammasini oʻchirish' },
  deleteFailed: { en: 'Could not delete — try again', ru: 'Не удалось удалить — попробуйте ещё раз', uz: 'Oʻchirib boʻlmadi — qayta urinib koʻring' },
```

- [ ] **Step 4: Wire the action and modal**

In `src/App.jsx`, add state beside `signOutWarn`:

```jsx
  const [deleteWarn, setDeleteWarn] = useState(false)
```

Add the handler beside `doSignOut`:

```jsx
  const doDeleteAccount = async () => {
    try {
      await api.deleteAccount()
      localStorage.removeItem(storageK)
      localStorage.removeItem(`eqTrainerQueue:${user.uid}`)
      localStorage.removeItem(`eqMigrationDone:${user.uid}`)
      window.location.reload()
    } catch {
      setDeleteWarn(false)
      notify(t('deleteFailed'))
    }
  }
```

In the `cloud && (…)` account row, add after the sign-out button:

```jsx
          <span className="sep">·</span>
          <button className="linklike" onClick={() => setDeleteWarn(true)}>{t('deleteAccount')}</button>
```

Add the modal beside the sign-out warning modal:

```jsx
      {deleteWarn && (
        <div className="modal-bg" onClick={() => setDeleteWarn(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t('deleteTitle')}</h2>
            <p className="muted" style={{ margin: '10px 0' }}>{t('deleteBody')}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14, flexWrap: 'wrap' }}>
              <button className="btn ghost sm" onClick={() => setDeleteWarn(false)}>{t('cancel')}</button>
              <button className="btn ghost sm" onClick={() => exportJSON(data)}>{t('exportData')}</button>
              <button className="btn sm" onClick={doDeleteAccount}>{t('deleteConfirm')}</button>
            </div>
          </div>
        </div>
      )}
```

Offering Export inside the confirmation is deliberate — the last chance to keep a copy sits where the decision is made.

- [ ] **Step 5: Verify**

Run: `npm run build` → succeeds.
The delete action only renders when `cloud` is true, so it cannot be exercised locally. Confirm no build errors and that the app still renders normally in local mode (`npm run dev` → the account row is absent, as before).

- [ ] **Step 6: Commit**

```bash
git add supabase-setup.sql src/api.js src/App.jsx src/content.js
git commit -m "Self-service account deletion"
```

---

### Task 9: Rewrite the setup guide and update the PRD

`SETUP.md` still instructs "Confirm email: OFF (required)" and tells the owner to reset passwords by hand. Both are now wrong.

**Files:**
- Modify: `SETUP.md` (§3, §4, §5, Day-2 operations)
- Modify: `PRD.md` (§3.5, new §3.7)
- Create: `scripts/keepalive.cron` (written, not installed)

**Interfaces:**
- Consumes: everything above.
- Produces: an owner-executable checklist.

- [ ] **Step 1: Rewrite SETUP.md §3**

Replace the whole "## 3. Auth settings (2 toggles)" section with:

```markdown
## 3. Email sending (required before auth settings)

The built-in Supabase mailer is capped at a few messages per hour and is not for
production. Set up a real sender first.

1. Create a free account at https://resend.com (3,000 emails/month free).
2. Add the domain `eq-trainer.com` and copy the DNS records it shows you.
3. At your domain registrar, add those records (one TXT for SPF, one TXT for
   DKIM). Without them confirmation mail lands in spam and signup silently fails.
4. Wait for Resend to show the domain as **Verified**, then create an SMTP
   credential.
5. In Supabase: **Project Settings → Authentication → SMTP Settings** → enable
   custom SMTP and paste the Resend host, port, username and password. Sender:
   `no-reply@eq-trainer.com`.

## 4. Auth settings

1. **Authentication → Sign In / Providers → Email**:
   - **Confirm email: ON** — the app is public; without it anyone can register
     using an address they do not own.
   - **Minimum password length: 8**
2. **Authentication → URL Configuration**:
   - **Site URL:** `https://eq-trainer.com`
   - **Redirect URLs:** add `https://eq-trainer.com` — confirmation and password
     reset links fail silently without it.
3. Save.
```

Renumber the following sections (old §4 "What to hand over" becomes §5, old §5 becomes §6).

- [ ] **Step 2: Fix the Day-2 operations section**

Replace the "Forgot password" bullet with:

```markdown
- **Forgot password**: users reset it themselves — "Forgot your password?" on the
  sign-in screen emails them a link. No admin action needed.
```

Replace the "Add nobody manually" bullet with:

```markdown
- **Add nobody manually** — signup is open and self-service: each user registers
  with email + password and confirms via the emailed link.
```

Replace the "After holidays" bullet with:

```markdown
- **Pausing**: a free project pauses after ~7 days with zero traffic. The
  keep-alive cron (`scripts/keepalive.cron`, installed on 169.58.92.31) prevents
  this by touching the API daily. If the app ever reports "offline" while the
  internet works, check the dashboard for a paused project and **Restore** it.
```

- [ ] **Step 3: Write the keep-alive cron**

Create `scripts/keepalive.cron`. It is **not installed by this plan** — installation is a server change, deferred until after the owner's local review.

```cron
# EQ Trainer — keep the free Supabase project from pausing after ~7 idle days.
# Install with:  sudo cp scripts/keepalive.cron /etc/cron.d/eq-trainer-keepalive
# Replace <PROJECT-REF> and <ANON-KEY> with the values from src/config.js.
SHELL=/bin/sh
PATH=/usr/local/bin:/usr/bin:/bin

17 6 * * * root curl -fsS -o /dev/null -H "apikey: <ANON-KEY>" https://<PROJECT-REF>.supabase.co/rest/v1/ || true
```

- [ ] **Step 4: Update the PRD**

In `PRD.md` §3.5, append:

```markdown
Public launch (2026-08-11): the audience is public rather than the original internal team, so signup requires a confirmed email address and users reset their own passwords. Account deletion (`delete_own_account()`) is self-service. See `docs/superpowers/specs/2026-08-11-public-launch-readiness-design.md`.
```

Add a new section after §3.6:

```markdown
### 3.7 Public launch readiness (added 2026-08-11)

- Web-only: the `file://` desktop-launcher path is retired; the build is served from eq-trainer.com and uses on-demand chunks for the PDF generator, fonts, and charts.
- The auth screen explains what the app is before asking for an email.
- A plain-language privacy note is reachable from every page, including in local mode.
- Deployment is `npm run deploy`; a cron job on the host keeps the free Supabase project awake.
```

- [ ] **Step 5: Verify**

Read `SETUP.md` start to finish as if you were the owner doing it for the first time.
Expected: the sections are numbered consecutively, no step references a removed section, and nothing still says confirmation should be off.

Run: `npm run build` → succeeds (docs-only change, but confirms the tree is clean).

- [ ] **Step 6: Commit**

```bash
git add SETUP.md PRD.md scripts/keepalive.cron
git commit -m "Setup guide for public signup: confirmation on, SMTP, self-service reset"
```

---

## After the plan

Local review by the owner (`npm run dev`, or `npm run build && npm run preview`), covering: the privacy page, the auth screen at `?auth` in all three languages, the charts, and a PDF download from Reports.

Then the owner's Supabase steps (`SETUP.md` §1–§5), after which the remaining work is: fill `src/config.js`, run the updated `supabase-setup.sql`, install the keep-alive cron, deploy, and run the full verification pass in the spec §6 — including the paths that cannot be tested before then (confirmation round-trip, password reset, account deletion, two-account isolation, offline queue).
