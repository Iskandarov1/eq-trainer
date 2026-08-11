import React, { useEffect, useRef, useState } from 'react'
import { L, UI, EMOTION_NAMES, BOOK_TITLE, BOOK_AUTHOR, nextBookQuote } from './content.js'
import {
  loadData, saveData, exportJSON, normalizeData, cacheKey, LEGACY_KEY, newId, isUuid, EMOTION_KEYS,
} from './store.js'
import * as api from './api.js'
import Dashboard from './components/Dashboard.jsx'
import Journey from './components/Journey.jsx'
import NextLevel from './components/NextLevel.jsx'
import EmotionModule from './components/EmotionModule.jsx'
import Breathe from './components/Breathe.jsx'
import Reports from './components/Reports.jsx'
import Privacy from './components/Privacy.jsx'
import AuthScreen from './components/AuthScreen.jsx'
import ResetPassword from './components/ResetPassword.jsx'

export const AppCtx = React.createContext(null)

/* ---------------- Auth shell ----------------
   Renders the trainer keyed by uid so a user switch fully remounts state —
   the persist effect can never write one user's data under another's key.
   Gates on CACHED identity, not a live session: offline must not lock the
   user out of their own cached data. */
export default function App() {
  const [user, setUser] = useState(undefined) // undefined=resolving, null=needs sign-in
  const [recovering, setRecovering] = useState(false)
  useEffect(() => { api.resolveUser().then(setUser) }, [])
  useEffect(() => api.onPasswordRecovery(() => setRecovering(true)), [])

  // Dev-only: the auth screens are unreachable until Supabase is configured, so
  // `?auth`, `?auth=signup`, `?auth=pending`, `?auth=reset` and
  // `?auth=newpassword` render them for visual review. import.meta.env.DEV is
  // false in the production build, so this branch is dropped at build time.
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('auth')) {
    const which = new URLSearchParams(window.location.search).get('auth')
    if (which === 'newpassword') return <ResetPassword onDone={() => {}} />
    return <AuthScreen onAuthed={() => {}} initial={which} />
  }

  // A recovery link lands here with a token in the URL hash; supabase-js
  // consumes it and fires PASSWORD_RECOVERY.
  if (recovering) {
    return <ResetPassword onDone={() => { setRecovering(false); window.location.replace(window.location.pathname) }} />
  }

  if (user === undefined) return null
  if (user === null) return <AuthScreen onAuthed={setUser} />
  return <TrainerApp key={user.uid} user={user} />
}

function TrainerApp({ user }) {
  // Local mode (Supabase not configured) keeps the v1 key so existing
  // journals opened via the desktop launcher stay visible.
  const storageK = user.uid === 'local' ? LEGACY_KEY : cacheKey(user.uid)
  const [data, setData] = useState(() => loadData(storageK))
  // route: {page:'home'|'journey'|'nextlevel'|'module'|'breathe'|'reports'|'privacy', emotion?}
  const [route, setRoute] = useState({ page: 'home' })
  const [toast, setToast] = useState(null)
  const [importOffer, setImportOffer] = useState(null)
  const [signOutWarn, setSignOutWarn] = useState(false)
  const [deleteWarn, setDeleteWarn] = useState(false)
  const toastTimer = useRef(null)

  // The sync layer reads state through this ref; update() refreshes it
  // synchronously so a flush can never see a cache missing a just-saved entry.
  const dataRef = useRef(data)
  dataRef.current = data

  useEffect(() => saveData(storageK, data), [storageK, data])

  const lang = data.lang
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  const t = (key, ...args) => {
    const v = L(lang, UI[key])
    return typeof v === 'function' ? v(...args) : v
  }
  const update = (fn) => setData((d) => {
    const next = structuredClone(d)
    fn(next)
    dataRef.current = next
    return next
  })
  const go = (r) => { setRoute(r); window.scrollTo({ top: 0 }) }
  const notify = (msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }

  // ---- sync wiring (no-ops when Supabase isn't configured) ----
  const cloud = api.isConfigured && user.uid !== 'local'
  useEffect(() => {
    if (!cloud) return
    api.setActiveUid(user.uid)
    api.wireSync({
      data: () => dataRef.current,
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
    })
    let alive = true
    api.pullAll()
      .then((remote) => { if (alive) setData((d) => { const m = api.mergeRemote(d, remote); dataRef.current = m; return m }) })
      .catch(() => { /* offline / paused — cached data is the working copy */ })
      .finally(() => {
        if (!alive) return
        api.flush()
        maybeOfferLegacyImport()
      })
    // another tab changed our cache → adopt it (idempotent sync makes dupes harmless)
    const onStorage = (e) => {
      if (e.key === storageK && e.newValue) setData(normalizeData(JSON.parse(e.newValue)))
    }
    window.addEventListener('storage', onStorage)
    return () => { alive = false; window.removeEventListener('storage', onStorage) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function maybeOfferLegacyImport() {
    if (localStorage.getItem(`eqMigrationDone:${user.uid}`)) return
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return
    const d = dataRef.current
    const accountEmpty =
      EMOTION_KEYS.every((k) => !d.entries[k].length) &&
      !d.journey.startDate && !Object.keys(d.journey.days).length
    if (!accountEmpty) return
    try {
      const legacy = normalizeData(JSON.parse(raw))
      const counts = Object.fromEntries(EMOTION_KEYS.map((k) => [k, legacy.entries[k].length]))
      if (Object.values(counts).every((n) => !n) && !legacy.journey.startDate) return
      setImportOffer({ legacy, counts })
    } catch { /* corrupt legacy blob — nothing to offer */ }
  }

  const acceptImport = () => {
    const legacy = structuredClone(importOffer.legacy)
    // server ids are uuid-typed → re-key pre-uuid ids (original kept in the record)
    for (const k of EMOTION_KEYS) {
      legacy.entries[k] = legacy.entries[k].map((e) =>
        isUuid(e.id) ? e : { ...e, legacyId: e.id, id: newId() })
    }
    legacy.lang = lang
    update((d) => Object.assign(d, legacy))
    api.enqueue(api.fullSyncOps(legacy))
    // rename, never delete: the copy survives until someone deliberately cleans up
    try {
      localStorage.setItem(`${LEGACY_KEY}:migrated:${user.uid}:${Date.now()}`, localStorage.getItem(LEGACY_KEY))
      localStorage.removeItem(LEGACY_KEY)
    } catch { /* quota — legacy key simply stays */ }
    localStorage.setItem(`eqMigrationDone:${user.uid}`, 'imported')
    setImportOffer(null)
    notify(t('imported'))
  }

  const declineImport = () => {
    localStorage.setItem(`eqMigrationDone:${user.uid}`, 'declined')
    setImportOffer(null)
  }

  const sync = {
    entrySaved: (emotion, id) =>
      cloud && api.enqueue([{ t: 'entry', id, emotion }, { t: 'pdf', kind: 'entry', refId: id }]),
    dayFields: (day) => cloud && api.enqueueDebounced({ t: 'day', day: String(day), cols: 'fields' }),
    dayDone: (day) =>
      cloud && api.enqueue([{ t: 'day', day: String(day), cols: 'done' }, { t: 'pdf', kind: 'day', refId: String(day) }]),
    profile: () => cloud && api.enqueueDebounced({ t: 'profile' }),
  }

  const requestSignOut = () => {
    api.commitDebounced()
    if (api.pendingCount() > 0) setSignOutWarn(true)
    else doSignOut(true)
  }
  const doSignOut = async (wipe) => {
    await api.signOut()
    if (wipe) {
      try {
        localStorage.removeItem(storageK)
        localStorage.removeItem(`eqTrainerQueue:${user.uid}`)
      } catch { /* leave the cache */ }
    }
    window.location.reload()
  }

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

  const importRef = useRef(null)
  const onImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result)
        if (!d.entries || !d.journey) throw new Error('bad format')
        const next = { ...normalizeData(d), lang }
        for (const k of EMOTION_KEYS) {
          next.entries[k] = next.entries[k].map((x) =>
            isUuid(x.id) ? x : { ...x, legacyId: x.id, id: newId() })
        }
        update((dd) => Object.assign(dd, next))
        if (cloud) api.enqueue(api.fullSyncOps(next))
        notify(t('imported'))
      } catch {
        notify(t('importError'))
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const ctx = { data, update, lang, t, go, route, notify, sync, user }

  return (
    <AppCtx.Provider value={ctx}>
      <header className="header">
        <div className="logo" onClick={() => go({ page: 'home' })}>
          <div className="logo-mark">EQ</div>
          <div>
            <div className="logo-name">{t('appName')}</div>
            <div className="logo-tag">{t('tagline')}</div>
          </div>
        </div>
        <nav className="nav">
          <button className={route.page === 'home' ? 'active' : ''} onClick={() => go({ page: 'home' })}>{t('home')}</button>
          <button className={route.page === 'journey' ? 'active' : ''} onClick={() => go({ page: 'journey' })}>{t('journey')}</button>
          <button className={route.page === 'nextlevel' || route.page === 'module' ? 'active' : ''} onClick={() => go({ page: 'nextlevel' })}>{t('nextLevel')}</button>
          <button className={route.page === 'breathe' ? 'active' : ''} onClick={() => go({ page: 'breathe' })}>{t('breatheNav')}</button>
          <button className={route.page === 'reports' ? 'active' : ''} onClick={() => go({ page: 'reports' })}>{t('reportsNav')}</button>
        </nav>
        <div className="lang">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => { update((d) => { d.lang = 'en' }); sync.profile() }}>EN</button>
          <button className={lang === 'ru' ? 'active' : ''} onClick={() => { update((d) => { d.lang = 'ru' }); sync.profile() }}>RU</button>
          <button className={lang === 'uz' ? 'active' : ''} onClick={() => { update((d) => { d.lang = 'uz' }); sync.profile() }}>UZ</button>
        </div>
      </header>

      <Breadcrumbs />

      <main className="fade-in" key={JSON.stringify(route)}>
        {route.page === 'home' && <Dashboard />}
        {route.page === 'journey' && <Journey />}
        {route.page === 'nextlevel' && <NextLevel />}
        {route.page === 'module' && <EmotionModule emotion={route.emotion} />}
        {route.page === 'breathe' && <Breathe />}
        {route.page === 'reports' && <Reports />}
        {route.page === 'privacy' && <Privacy />}
      </main>

      <BookQuote />

      <div className="footer-actions">
        <button className="btn ghost sm" onClick={() => exportJSON(data)}>{t('exportData')}</button>
        <button className="btn ghost sm" onClick={() => importRef.current?.click()}>{t('importData')}</button>
        <button className="btn ghost sm" onClick={() => go({ page: 'privacy' })}>{t('privacyNav')}</button>
        <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={onImport} />
      </div>
      {cloud && (
        <div className="account-row caps">
          <SyncBadge t={t} />
          <span className="sep">·</span>
          <span>{user.email}</span>
          <span className="sep">·</span>
          <button className="linklike" onClick={requestSignOut}>{t('signOut')}</button>
          <span className="sep">·</span>
          <button className="linklike" onClick={() => setDeleteWarn(true)}>{t('deleteAccount')}</button>
        </div>
      )}
      <div className="trust-note">{cloud ? t('trustNoteCloud') : t('trustNote')}</div>

      {importOffer && (
        <div className="modal-bg">
          <div className="modal">
            <h2>{t('migrateTitle')}</h2>
            <p className="muted" style={{ margin: '10px 0' }}>{t('migrateBody')}</p>
            <ul className="migrate-list">
              {EMOTION_KEYS.filter((k) => importOffer.counts[k]).map((k) => (
                <li key={k}>{L(lang, EMOTION_NAMES[k])}: {importOffer.counts[k]}</li>
              ))}
              {importOffer.legacy.journey.startDate && <li>{t('migrateJourney', importOffer.legacy.journey.startDate)}</li>}
            </ul>
            <p className="small muted" style={{ margin: '10px 0' }}>{t('migrateConfirmHint')}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
              <button className="btn ghost sm" onClick={declineImport}>{t('migrateNo')}</button>
              <button className="btn sm" onClick={acceptImport}>{t('migrateYes')}</button>
            </div>
          </div>
        </div>
      )}

      {signOutWarn && (
        <div className="modal-bg" onClick={() => setSignOutWarn(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t('signOutWarnTitle', api.pendingCount())}</h2>
            <p className="muted" style={{ margin: '10px 0' }}>{t('signOutWarnBody')}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14, flexWrap: 'wrap' }}>
              <button className="btn ghost sm" onClick={() => setSignOutWarn(false)}>{t('cancel')}</button>
              <button className="btn ghost sm" onClick={() => doSignOut(false)}>{t('signOutKeep')}</button>
              <button className="btn sm" onClick={() => { api.flush(); setSignOutWarn(false); notify(t('syncStarted')) }}>{t('syncFirst')}</button>
            </div>
          </div>
        </div>
      )}

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

      {toast && <div className="toast">{toast}</div>}
    </AppCtx.Provider>
  )
}

function SyncBadge({ t }) {
  const [s, setS] = useState(api.syncState())
  useEffect(() => api.onSyncState(setS), [])
  if (s.status === 'local') return null
  const label =
    s.status === 'syncing' ? t('syncSyncing')
    : s.status === 'error' ? t('syncError')
    : s.pending > 0 ? t('syncPending', s.pending)
    : s.status === 'offline' ? t('syncOffline')
    : t('syncSynced')
  return <span className={`sync-badge ${s.status}${s.pending > 0 ? ' pending' : ''}`}>{label}</span>
}

// Goleman book quote — a new one on every page open (PRD §6, source #6)
function BookQuote() {
  const { route, lang, t } = React.useContext(AppCtx)
  const routeKey = JSON.stringify(route)
  const q = React.useMemo(() => nextBookQuote(), [routeKey])
  const text = L(lang, q.text)
  const by = L(lang, q.by ?? BOOK_AUTHOR)
  return (
    <figure className="book-quote">
      <blockquote>{lang === 'en' ? `“${text}”` : `«${text}»`}</blockquote>
      <figcaption className="caps">
        {by} · {L(lang, BOOK_TITLE)} · {t('bookPage', q.page)}
      </figcaption>
    </figure>
  )
}

function Breadcrumbs() {
  const { route, go, t, lang } = React.useContext(AppCtx)
  const parts = [{ label: t('home'), r: { page: 'home' } }]
  if (route.page === 'journey') parts.push({ label: t('journey') })
  if (route.page === 'nextlevel') parts.push({ label: t('nextLevel') })
  if (route.page === 'breathe') parts.push({ label: t('breatheNav') })
  if (route.page === 'reports') parts.push({ label: t('reportsNav') })
  if (route.page === 'privacy') parts.push({ label: t('privacyNav') })
  if (route.page === 'module') {
    parts.push({ label: t('nextLevel'), r: { page: 'nextlevel' } })
    parts.push({ label: L(lang, EMOTION_NAMES[route.emotion]) })
  }
  return (
    <div className="crumbs">
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep">›</span>}
          {p.r ? <button onClick={() => go(p.r)}>{p.label}</button> : <span className="here">{p.label}</span>}
        </React.Fragment>
      ))}
    </div>
  )
}
