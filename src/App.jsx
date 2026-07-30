import React, { useEffect, useRef, useState } from 'react'
import { L, UI, EMOTION_NAMES, MODULES, BOOK_TITLE, BOOK_AUTHOR, nextBookQuote } from './content.js'
import { loadData, saveData, exportJSON, normalizeData } from './store.js'
import Dashboard from './components/Dashboard.jsx'
import Journey from './components/Journey.jsx'
import NextLevel from './components/NextLevel.jsx'
import EmotionModule from './components/EmotionModule.jsx'
import Breathe from './components/Breathe.jsx'

export const AppCtx = React.createContext(null)

export default function App() {
  const [data, setData] = useState(loadData)
  // route: {page:'home'|'journey'|'nextlevel'|'module', emotion?, day?}
  const [route, setRoute] = useState({ page: 'home' })
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => saveData(data), [data])

  const lang = data.lang
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  const t = (key, ...args) => {
    const v = L(lang, UI[key])
    return typeof v === 'function' ? v(...args) : v
  }
  const update = (fn) => setData((d) => { const next = structuredClone(d); fn(next); return next })
  const go = (r) => { setRoute(r); window.scrollTo({ top: 0 }) }
  const notify = (msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
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
        setData({ ...normalizeData(d), lang })
        notify(t('imported'))
      } catch {
        notify(t('importError'))
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const ctx = { data, update, lang, t, go, route, notify }

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
        </nav>
        <div className="lang">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => update((d) => { d.lang = 'en' })}>EN</button>
          <button className={lang === 'ru' ? 'active' : ''} onClick={() => update((d) => { d.lang = 'ru' })}>RU</button>
          <button className={lang === 'uz' ? 'active' : ''} onClick={() => update((d) => { d.lang = 'uz' })}>UZ</button>
        </div>
      </header>

      <Breadcrumbs />

      <main className="fade-in" key={JSON.stringify(route)}>
        {route.page === 'home' && <Dashboard />}
        {route.page === 'journey' && <Journey />}
        {route.page === 'nextlevel' && <NextLevel />}
        {route.page === 'module' && <EmotionModule emotion={route.emotion} />}
        {route.page === 'breathe' && <Breathe />}
      </main>

      <BookQuote />

      <div className="footer-actions">
        <button className="btn ghost sm" onClick={() => exportJSON(data)}>{t('exportData')}</button>
        <button className="btn ghost sm" onClick={() => importRef.current?.click()}>{t('importData')}</button>
        <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={onImport} />
      </div>
      <div className="trust-note">{t('trustNote')}</div>

      {toast && <div className="toast">{toast}</div>}
    </AppCtx.Provider>
  )
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
