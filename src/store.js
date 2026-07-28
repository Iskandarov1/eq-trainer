import { WEEKS, BADGES } from './content.js'

const KEY = 'eqTrainerData'

const DEFAULTS = {
  lang: 'en',
  journey: { startDate: null, days: {}, ritual: { morning: '', day: '', evening: '' } },
  entries: { anger: [], shame: [], fear: [], jealousy: [] },
}

export const EMOTION_KEYS = ['anger', 'shame', 'fear', 'jealousy']

// crypto.randomUUID is unavailable on file:// and plain-HTTP origins (dist is opened from disk)
export const newId = () =>
  globalThis.crypto?.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)

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
      jealousy: validEntries(d.entries?.jealousy),
    },
  }
}

// ritual was a single string before it split into morning/day/evening parts
function normalizeRitual(r) {
  if (typeof r === 'string') return { morning: r, day: '', evening: '' }
  const part = (x) => (typeof x === 'string' ? x : '')
  return { morning: part(r?.morning), day: part(r?.day), evening: part(r?.evening) }
}

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? normalizeData(JSON.parse(raw)) : structuredClone(DEFAULTS)
  } catch {
    return structuredClone(DEFAULTS)
  }
}

export function saveData(d) {
  try { localStorage.setItem(KEY, JSON.stringify(d)) } catch { /* storage full/blocked */ }
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

export const fmtDate = (lang, iso) =>
  new Date(iso).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB')

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
