import { WEEKS, BADGES } from './content.js'

// Legacy single-user key (v1). Multi-user caches are per-uid: eqTrainerData:<uid>
export const LEGACY_KEY = 'eqTrainerData'
export const cacheKey = (uid) => `eqTrainerData:${uid}`

const DEFAULTS = {
  lang: 'en',
  journey: { startDate: null, days: {}, ritual: { morning: '', day: '', evening: '' } },
  entries: { anger: [], shame: [], fear: [], envy: [] },
  // daily check-ins: { 'YYYY-MM-DD': { morning|day|evening: { text, savedAt? } } }
  // savedAt present = saved & locked in the UI; absent = editable draft
  checkins: {},
}

export const EMOTION_KEYS = ['anger', 'shame', 'fear', 'envy']
export const CHECKIN_SLOTS = ['morning', 'day', 'evening']

// crypto.randomUUID is unavailable on plain-HTTP origins. The fallback is kept
// (harmless) and must still produce a REAL RFC-4122 v4 uuid — the server's
// entries.id column is uuid-typed and ids are the idempotency key.
export const newId = () => {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID()
  const b = new Uint8Array(16)
  crypto.getRandomValues(b)
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

export const isUuid = (s) =>
  typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)

// Deep validation so a damaged/edited backup can never crash a later render
export function normalizeData(d) {
  const base = structuredClone(DEFAULTS)
  const validEntries = (arr) =>
    Array.isArray(arr) ? arr.filter((e) => e && typeof e === 'object' && typeof e.date === 'string') : []
  return {
    ...base,
    ...d,
    journey: {
      startDate: typeof d.journey?.startDate === 'string' ? d.journey.startDate : null,
      days: d.journey?.days && typeof d.journey.days === 'object' && !Array.isArray(d.journey.days) ? d.journey.days : {},
      ritual: normalizeRitual(d.journey?.ritual),
    },
    entries: {
      anger: validEntries(d.entries?.anger),
      shame: validEntries(d.entries?.shame),
      fear: validEntries(d.entries?.fear),
      envy: validEntries(d.entries?.envy ?? d.entries?.jealousy), // 'jealousy' was this module's key for a brief window
    },
    checkins: normalizeCheckins(d.checkins),
  }
}

// Drafts (text, no savedAt) survive normalization on purpose — an unsaved
// morning answer must still be there when the page reopens in the afternoon.
function normalizeCheckins(c) {
  if (!c || typeof c !== 'object' || Array.isArray(c)) return {}
  const out = {}
  for (const [date, ci] of Object.entries(c)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !ci || typeof ci !== 'object') continue
    const day = {}
    for (const s of CHECKIN_SLOTS) {
      const v = ci[s]
      if (!v || typeof v !== 'object' || typeof v.text !== 'string') continue
      day[s] = typeof v.savedAt === 'string' ? { text: v.text, savedAt: v.savedAt } : { text: v.text }
    }
    if (Object.keys(day).length) out[date] = day
  }
  return out
}

// ritual was a single string before it split into morning/day/evening parts
function normalizeRitual(r) {
  if (typeof r === 'string') return { morning: r, day: '', evening: '' }
  const part = (x) => (typeof x === 'string' ? x : '')
  return { morning: part(r?.morning), day: part(r?.day), evening: part(r?.evening) }
}

export function loadData(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? normalizeData(JSON.parse(raw)) : structuredClone(DEFAULTS)
  } catch {
    return structuredClone(DEFAULTS)
  }
}

export function saveData(key, d) {
  try { localStorage.setItem(key, JSON.stringify(d)) } catch { /* storage full/blocked */ }
}

// ---------- journey helpers ----------
export function currentDay(startDate) {
  if (!startDate) return 0
  const ms = Date.now() - new Date(startDate + 'T00:00:00').getTime()
  return Math.max(1, Math.min(31, Math.floor(ms / 86400000) + 1))
}

export function weekForDay(day) {
  return WEEKS.find((w) => day >= w.days[0] && day <= w.days[1]) || null
}

export function journeyStats(journey) {
  const done = Object.values(journey.days).filter((d) => d?.done).length
  const cur = currentDay(journey.startDate)
  let streak = 0
  for (let d = Math.min(cur, 30); d >= 1; d--) {
    if (journey.days[d]?.done) streak++
    else if (d < cur) break // today not done yet doesn't break the streak
  }
  return { done, cur, streak }
}

// ---------- next-level analytics ----------
// Non-reflection keys: ids/dates/selection keys must not count as text (search + depth score)
const NON_TEXT_KEYS = new Set(['id', 'date', 'tookDate', 'emotion', 'threat'])
export const entryText = (e) =>
  Object.entries(e)
    .filter(([k, v]) => !NON_TEXT_KEYS.has(k) && typeof v === 'string')
    .map(([, v]) => v)
    .join(' ')

export const LOCALES = { en: 'en-GB', ru: 'ru-RU' }
// Chrome's uz CLDR data lacks month names (any named-month format renders a raw "M07"
// token), so Uzbek dates are always formatted manually: dd.mm.yyyy / "23-iyul 2026, 10:01".
const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
const two = (n) => String(n).padStart(2, '0')

// Local calendar date — check-in day boundaries follow the device clock,
// same as the journey's currentDay()
export const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`
}

export const fmtDate = (lang, iso) => {
  const d = new Date(iso)
  if (lang === 'uz') return `${two(d.getDate())}.${two(d.getMonth() + 1)}.${d.getFullYear()}`
  return d.toLocaleDateString(LOCALES[lang] ?? 'en-GB')
}

export const fmtMonthYear = (lang, iso) => {
  const d = new Date(iso)
  if (lang === 'uz') return `${UZ_MONTHS[d.getMonth()][0].toUpperCase()}${UZ_MONTHS[d.getMonth()].slice(1)} ${d.getFullYear()}`
  return d.toLocaleDateString(LOCALES[lang] ?? 'en-GB', { month: 'long', year: 'numeric' })
}

export const fmtDateTime = (lang, iso) => {
  const d = new Date(iso)
  if (lang === 'uz') return `${d.getDate()}-${UZ_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${two(d.getHours())}:${two(d.getMinutes())}`
  return d.toLocaleString(LOCALES[lang] ?? 'en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

export function masteryScore(entries) {
  if (!entries.length) return 0
  const freq = Math.min(70, entries.length * 7)
  const avgDepth = entries.reduce((s, e) => s + entryText(e).length, 0) / entries.length
  const depth = Math.min(30, Math.round(avgDepth / 15))
  return Math.min(100, freq + depth)
}

export function intensitySeries(entries, lang) {
  const points = entries
    .filter((e) => e.intensity)
    .map((e) => ({ date: fmtDate(lang, e.date), intensity: e.intensity }))
  const seen = {}
  for (const p of points) {
    seen[p.date] = (seen[p.date] || 0) + 1
    if (seen[p.date] > 1) p.date = `${p.date} (${seen[p.date]})`
  }
  return points
}

// % change between avg of first half and last half of intensities; null if <2 points
export function intensityChange(entries) {
  const vals = entries.filter((e) => e.intensity).map((e) => e.intensity)
  if (vals.length < 2) return null
  const half = Math.max(1, Math.floor(vals.length / 2))
  const first = vals.slice(0, half).reduce((a, b) => a + b, 0) / half
  const last = vals.slice(-half).reduce((a, b) => a + b, 0) / half
  if (!first) return null
  return Math.round(((last - first) / first) * 100)
}

export function earnedBadges(entries) {
  const counts = Object.fromEntries(EMOTION_KEYS.map((k) => [k, entries[k].length]))
  const total = EMOTION_KEYS.reduce((s, k) => s + counts[k], 0)
  return BADGES.map((b) => {
    const have = b.scope === 'total' ? total : counts[b.scope]
    return { ...b, have, earned: have >= b.need, remaining: Math.max(0, b.need - have) }
  })
}

export function weeklyCounts(entries) {
  const weekAgo = Date.now() - 7 * 86400000
  const count = (arr) => arr.filter((e) => new Date(e.date).getTime() >= weekAgo).length
  return Object.fromEntries(EMOTION_KEYS.map((k) => [k, count(entries[k])]))
}

// emotion with the biggest intensity decrease (most improved); null if no data
export function mostImproved(entries) {
  let best = null
  for (const k of EMOTION_KEYS) {
    const ch = intensityChange(entries[k])
    if (ch !== null && ch < 0 && (best === null || ch < best.change)) best = { emotion: k, change: ch }
  }
  return best
}

// emotion with lowest practice count → focus suggestion; null until the user has any practice
export function focusEmotion(entries) {
  if (EMOTION_KEYS.every((k) => !entries[k].length)) return null
  return EMOTION_KEYS.reduce((min, k) => (entries[k].length < entries[min].length ? k : min), 'anger')
}

export function exportJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `eq-trainer-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}
