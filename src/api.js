// The ONLY module that talks to Supabase (auth, database, storage). Everything
// else reads/writes the local cache; this layer syncs it in the background via
// a per-user offline queue. Swapping the backend later = rewriting this file.
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js'
import { normalizeData, EMOTION_KEYS, CHECKIN_SLOTS } from './store.js'

export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

// detectSessionInUrl off: no OAuth redirects exist, and URL-hash parsing on
// file:// paths is pointless risk. Session persists in localStorage (works on
// file:// — the whole app already depends on localStorage there).
const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    })
  : null

// ---------- current user ----------
// The app gates on a CACHED uid, never on a live session: a failed offline
// token refresh must degrade to offline mode, not a login screen.
const LAST_USER_KEY = 'eqLastUser'

export function cachedUser() {
  try { return JSON.parse(localStorage.getItem(LAST_USER_KEY)) || null } catch { return null }
}

let uid = cachedUser()?.uid ?? null

function rememberUser(u) {
  uid = u?.uid ?? null
  try {
    if (u) localStorage.setItem(LAST_USER_KEY, JSON.stringify(u))
    else localStorage.removeItem(LAST_USER_KEY)
  } catch { /* quota — cachedUser just won't survive a restart */ }
}

// ---------- auth ----------
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  rememberUser({ uid: data.user.id, email: data.user.email })
  return { uid: data.user.id, email: data.user.email }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  rememberUser({ uid: data.user.id, email: data.user.email })
  return { uid: data.user.id, email: data.user.email }
}

export async function signOut() {
  try { await supabase.auth.signOut() } catch { /* offline sign-out is still a sign-out */ }
  rememberUser(null)
}

export async function changePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}

// ---------- sync state (for the header indicator) ----------
// status: 'local' (not configured) | 'synced' | 'syncing' | 'offline' | 'error'
const listeners = new Set()
let state = { status: isConfigured ? 'offline' : 'local', pending: 0 }

export function syncState() { return state }
export function onSyncState(fn) { listeners.add(fn); return () => listeners.delete(fn) }
function setState(patch) {
  state = { ...state, ...patch }
  listeners.forEach((fn) => fn(state))
}

// ---------- offline queue ----------
// Ops are DIRTY MARKERS, not payload snapshots: at flush time the current
// value is read from the cache (natural coalescing; latest state always wins).
// Entries carry their full row (append-only, immutable). PDF ops carry only a
// reference — bytes are regenerated at flush (localStorage quota).
//   {t:'entry',   id, emotion}
//   {t:'day',     day, cols:'fields'|'done'}   // split columns: a stale fields
//                                              // push can never revert done
//   {t:'checkin', date, slot}                  // per-slot column, same split-
//                                              // column safety as journey days
//   {t:'profile'}
//   {t:'pdf', kind:'entry'|'day'|'checkin', refId}  // entry id | day number | date
const qKey = () => `eqTrainerQueue:${uid}`
const quarantineKey = () => `eqTrainerQuarantine:${uid}`

function readQueue() {
  try { return JSON.parse(localStorage.getItem(qKey())) || [] } catch { return [] }
}

function writeQueue(q) {
  try {
    localStorage.setItem(qKey(), JSON.stringify(q))
    if (state.status === 'error') setState({ status: 'offline' })
  } catch {
    // A silently dropped op is permanent data loss — surface it, loudly.
    setState({ status: 'error' })
  }
  setState({ pending: q.length })
}

const opKey = (op) =>
  op.t === 'entry' ? `entry:${op.id}`
  : op.t === 'day' ? `day:${op.day}:${op.cols}`
  : op.t === 'checkin' ? `checkin:${op.date}:${op.slot}`
  : op.t === 'pdf' ? `pdf:${op.kind}:${op.refId}`
  : 'profile'

export function enqueue(ops) {
  if (!isConfigured || !uid) return
  const q = readQueue()
  for (const op of ops) {
    const k = opKey(op)
    const i = q.findIndex((x) => opKey(x) === k)
    if (i >= 0) q[i] = op
    else q.push(op)
  }
  writeQueue(q)
  scheduleFlush()
}

export function pendingCount() { return readQueue().length }

// ---------- debounced markers (day fields / profile change per keystroke) ----------
const debounced = new Map() // opKey -> op
let debounceTimer = null

export function enqueueDebounced(op) {
  if (!isConfigured || !uid) return
  debounced.set(opKey(op), op)
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(commitDebounced, 2000)
}

// Also called on pagehide: synchronous localStorage write only, no network.
export function commitDebounced() {
  clearTimeout(debounceTimer)
  if (!debounced.size) return
  const ops = [...debounced.values()]
  debounced.clear()
  enqueue(ops)
}

if (typeof window !== 'undefined' && isConfigured) {
  window.addEventListener('pagehide', commitDebounced)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') commitDebounced()
  })
  window.addEventListener('online', () => scheduleFlush(0))
  setInterval(() => scheduleFlush(), 45000)
}

// ---------- flush engine ----------
// The flusher needs the current cache + a PDF builder; the app shell injects
// them (avoids circular imports and keeps this module UI-free).
let getData = () => null
let buildPdf = null // async ({kind, refId, data, lang}) => { path, bytes } | null
export function wireSync({ data, pdf }) { getData = data; buildPdf = pdf }

let flushing = false
let backoffUntil = 0
let failures = 0

function scheduleFlush(delay) {
  if (!isConfigured || !uid) return
  if (delay === 0) backoffUntil = 0
  setTimeout(flush, delay ?? 50)
}

// Error classes: network/5xx/paused → retry (backoff); 401 → refresh+retry;
// 429 → backoff, NEVER auth failure (shared corporate NAT); 400/403/422 →
// quarantine + surface, never infinite-retry.
function classify(error) {
  const code = error?.status ?? error?.statusCode
  if (code === 401) return 'auth'
  if (code === 429) return 'backoff'
  if (code >= 400 && code < 500) return 'quarantine'
  return 'retry'
}

export async function flush() {
  if (!isConfigured || !uid || flushing || Date.now() < backoffUntil) return
  let q = readQueue()
  if (!q.length) { if (state.status !== 'error') setState({ status: 'synced', pending: 0 }); return }
  flushing = true
  setState({ status: 'syncing', pending: q.length })
  let refreshed = false
  try {
    while (q.length) {
      const op = q[0]
      try {
        await pushOp(op)
      } catch (error) {
        const cls = classify(error)
        if (cls === 'auth' && !refreshed) {
          refreshed = true
          const { error: rerr } = await supabase.auth.refreshSession()
          if (rerr) throw rerr
          continue // retry same op with fresh token
        }
        if (cls === 'quarantine') {
          try {
            const bad = JSON.parse(localStorage.getItem(quarantineKey())) || []
            bad.push({ op, error: String(error?.message ?? error), at: new Date().toISOString() })
            localStorage.setItem(quarantineKey(), JSON.stringify(bad))
          } catch { /* keep going */ }
          q.shift()
          writeQueue(q)
          setState({ status: 'error' })
          continue
        }
        throw error // retry / backoff / failed refresh → leave op queued
      }
      q.shift()
      writeQueue(q)
    }
    failures = 0
    setState({ status: state.status === 'error' ? 'error' : 'synced', pending: 0 })
  } catch {
    failures += 1
    backoffUntil = Date.now() + Math.min(5 * 60000, 15000 * 2 ** Math.min(failures, 5))
    setState({ status: 'offline', pending: readQueue().length })
  } finally {
    flushing = false
  }
}

async function pushOp(op) {
  const data = getData()
  if (op.t === 'entry') {
    const entry = data?.entries?.[op.emotion]?.find((e) => e.id === op.id)
    if (!entry) return // deleted/never existed locally — nothing to push
    const { error } = await supabase.from('entries').insert({
      id: entry.id, user_id: uid, emotion: op.emotion, at: entry.date, payload: entry,
    })
    // duplicate PK = a previous attempt committed = success
    if (error && error.code !== '23505') throw error
  } else if (op.t === 'day') {
    const d = data?.journey?.days?.[op.day]
    if (!d) return
    const row = op.cols === 'done'
      ? { user_id: uid, day: parseInt(op.day, 10), done: !!d.done, done_at: d.doneAt ?? new Date().toISOString() }
      : { user_id: uid, day: parseInt(op.day, 10), fields: d.fields || {} }
    const { error } = await supabase.from('journey_days').upsert(row, { onConflict: 'user_id,day' })
    if (error) throw error
  } else if (op.t === 'checkin') {
    const s = data?.checkins?.[op.date]?.[op.slot]
    if (!s?.savedAt) return // unsaved draft (or deleted) — nothing to publish
    const { error } = await supabase.from('checkins').upsert(
      { user_id: uid, date: op.date, [op.slot]: s },
      { onConflict: 'user_id,date' },
    )
    if (error) throw error
  } else if (op.t === 'profile') {
    const { error } = await supabase.from('profiles').upsert({
      id: uid,
      lang: data.lang,
      journey_start: data.journey.startDate,
      ritual: data.journey.ritual,
    })
    if (error) throw error
  } else if (op.t === 'pdf') {
    if (!buildPdf) return
    const built = await buildPdf(op)
    if (!built) return // source record gone — drop the op
    const { error } = await supabase.storage
      .from('reports')
      .upload(built.path, built.bytes, { contentType: 'application/pdf', upsert: false })
    // already archived = success (append-only bucket)
    if (error && error.statusCode !== '409' && error.status !== 409 &&
        !/already exists/i.test(error.message || '')) throw error
  }
}

// Ops covering an entire data object (legacy import / JSON backup import).
// Everything is idempotent server-side, so re-syncing existing rows is safe.
export function fullSyncOps(data) {
  const ops = [{ t: 'profile' }]
  for (const [day, dd] of Object.entries(data.journey?.days || {})) {
    ops.push({ t: 'day', day, cols: 'fields' })
    if (dd?.done) {
      ops.push({ t: 'day', day, cols: 'done' })
      ops.push({ t: 'pdf', kind: 'day', refId: day })
    }
  }
  for (const k of EMOTION_KEYS) {
    for (const e of data.entries?.[k] || []) {
      ops.push({ t: 'entry', id: e.id, emotion: k })
      ops.push({ t: 'pdf', kind: 'entry', refId: e.id })
    }
  }
  for (const [date, ci] of Object.entries(data.checkins || {})) {
    let anySaved = false
    for (const s of CHECKIN_SLOTS) {
      if (ci[s]?.savedAt) { ops.push({ t: 'checkin', date, slot: s }); anySaved = true }
    }
    if (anySaved) ops.push({ t: 'pdf', kind: 'checkin', refId: date })
  }
  return ops
}

// ---------- pull + merge ----------
export async function pullAll() {
  const [p, d, e, c] = await Promise.all([
    supabase.from('profiles').select('*').maybeSingle(),
    supabase.from('journey_days').select('*'),
    supabase.from('entries').select('*'),
    supabase.from('checkins').select('*'),
  ])
  const firstError = p.error || d.error || e.error || c.error
  if (firstError) throw firstError
  return { profile: p.data, days: d.data || [], entries: e.data || [], checkins: c.data || [] }
}

// Queue-aware merge: rows with a pending local op are locally newer → local
// wins; everything else the server wins. Entries are a union by id.
export function mergeRemote(local, remote) {
  const pendingKeys = new Set(readQueue().map(opKey))
  const merged = structuredClone(local)

  if (remote.profile && !pendingKeys.has('profile')) {
    merged.lang = remote.profile.lang || merged.lang
    merged.journey.startDate = remote.profile.journey_start || null
    merged.journey.ritual = remote.profile.ritual || merged.journey.ritual
  }
  for (const row of remote.days) {
    const day = String(row.day)
    const local_ = merged.journey.days[day]
    const fieldsPending = pendingKeys.has(`day:${day}:fields`)
    const donePending = pendingKeys.has(`day:${day}:done`)
    const next = local_ ? { ...local_ } : { fields: {}, done: false }
    if (!fieldsPending) next.fields = row.fields || {}
    if (!donePending) { next.done = !!row.done; if (row.done_at) next.doneAt = row.done_at }
    // done never reverts, whatever the source says
    next.done = next.done || !!local_?.done || !!row.done
    merged.journey.days[day] = next
  }
  for (const row of remote.checkins || []) {
    const date = row.date
    const next = { ...(merged.checkins[date] || {}) }
    for (const s of CHECKIN_SLOTS) {
      // a pending local op means this slot is locally newer — local wins
      if (pendingKeys.has(`checkin:${date}:${s}`)) continue
      if (row[s]) next[s] = row[s]
    }
    if (Object.keys(next).length) merged.checkins[date] = next
  }
  for (const k of EMOTION_KEYS) {
    const have = new Set(merged.entries[k].map((x) => x.id))
    for (const row of remote.entries) {
      if (row.emotion === k && !have.has(row.payload?.id)) merged.entries[k].push(row.payload)
    }
    merged.entries[k].sort((a, b) => new Date(a.date) - new Date(b.date))
  }
  return normalizeData(merged)
}

// ---------- reports (read back an archived PDF, e.g. to open it) ----------
export async function downloadReport(path) {
  const { data, error } = await supabase.storage.from('reports').download(path)
  if (error) throw error
  return data // Blob
}

// ---------- session bootstrap ----------
// Resolve the working uid: live session if reachable, else cached uid (offline
// mode). Returns null only when there is truly no one to run the app as.
export async function resolveUser() {
  if (!isConfigured) return { uid: 'local', email: null, offline: false }
  try {
    const { data } = await supabase.auth.getSession()
    if (data?.session?.user) {
      const u = { uid: data.session.user.id, email: data.session.user.email }
      rememberUser(u)
      return { ...u, offline: false }
    }
  } catch { /* network down / project paused → fall through to cache */ }
  const cached = cachedUser()
  if (cached) { uid = cached.uid; return { ...cached, offline: true } }
  return null
}

export function setActiveUid(u) { uid = u }
