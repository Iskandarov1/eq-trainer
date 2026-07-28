import React, { useContext, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AppCtx } from '../App.jsx'
import { L, MODULES, EMOTION_NAMES, FIELD_LABELS, optionLabel } from '../content.js'
import { masteryScore, intensitySeries, intensityChange, newId, entryText, fmtDate } from '../store.js'
import BreathingGuide from './BreathingGuide.jsx'

export default function EmotionModule({ emotion }) {
  const { lang, t } = useContext(AppCtx)
  const m = MODULES[emotion]
  const [tab, setTab] = useState('learn')

  return (
    <div style={{ '--accent': m.color }}>
      <div className="module-hero" style={{ '--accent': m.color }}>
        <div className="emoji">{m.emoji}</div>
        <h1>{L(lang, EMOTION_NAMES[emotion])}: {L(lang, m.subtitle)}</h1>
        <p className="expl">{L(lang, m.explanation)}</p>
      </div>

      <div className="tabs">
        {['learn', 'practice', 'journal', 'progress'].map((k) => (
          <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{t(k)}</button>
        ))}
      </div>

      {tab === 'learn' && <Learn m={m} />}
      {tab === 'practice' && <Practice emotion={emotion} m={m} onSaved={() => setTab('journal')} />}
      {tab === 'journal' && <Journal emotion={emotion} m={m} />}
      {tab === 'progress' && <Progress emotion={emotion} m={m} />}
    </div>
  )
}

/* ---------------- LEARN: 4 interactive step cards ---------------- */
function Learn({ m }) {
  const { lang, t } = useContext(AppCtx)
  const [open, setOpen] = useState(0)
  return (
    <div className="card">
      <h2>🎯 {t('golemanApproach')}</h2>
      <p className="muted small" style={{ margin: '6px 0 14px' }}>{t('tapCard')}</p>
      <div className="learn-grid">
        {m.steps.map((s, i) => (
          <div key={i} className={`learn-card ${open === i ? 'open' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
            <h4>{L(lang, s.title)}</h4>
            <div className="body">{L(lang, s.body)}</div>
            <div className="expander">{open === i ? '▲' : '▼'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- PRACTICE: guided form → saves a journal entry ---------------- */
function Practice({ emotion, m, onSaved }) {
  const { lang, t, update, notify } = useContext(AppCtx)
  const [form, setForm] = useState({})
  const set = (id, v) => setForm((f) => ({ ...f, [id]: v }))

  const save = () => {
    const entry = { id: newId(), date: new Date().toISOString(), ...form }
    if (emotion === 'fear' && form.took && !form.tookDate) entry.tookDate = new Date().toISOString()
    update((d) => { d.entries[emotion].push(entry) })
    setForm({})
    notify(t('saved'))
    onSaved?.()
  }

  // A lone slider move is not a reflection — require real content to save
  const hasContent = Object.entries(form).some(([k, v]) =>
    k !== 'intensity' && (typeof v === 'string' ? v.trim() : Array.isArray(v) ? v.some((x) => (typeof x === 'string' ? x.trim() : x)) : v)
  )

  return (
    <div>
      {m.practiceSteps.map((step, i) => (
        <div key={i} className="pstep">
          <h3>{L(lang, step.title)}</h3>
          {step.hint && <div className="hint">{L(lang, step.hint)}</div>}
          <div className="grid" style={{ gap: 12 }}>
            {step.fields.map((f) => <Field key={f.id} f={f} value={form[f.id]} set={set} />)}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button className="btn" style={{ background: m.color, color: '#fff' }} disabled={!hasContent} onClick={save}>
          💾 {t('save')}
        </button>
      </div>
    </div>
  )
}

function Field({ f, value, set }) {
  const { lang, t } = useContext(AppCtx)
  switch (f.t) {
    case 'textarea':
      return (
        <div>
          {f.label && <label className="field-label">{L(lang, f.label)}</label>}
          <textarea value={value || ''} placeholder={f.ph ? L(lang, f.ph) : t('optionalNote')} onChange={(e) => set(f.id, e.target.value)} />
        </div>
      )
    case 'chips':
    case 'chips-multi': {
      const multi = f.t === 'chips-multi'
      const sel = multi ? value || [] : value
      return (
        <div className="chips">
          {f.opts.map((o) => {
            const label = L(lang, o)
            const on = multi ? sel.includes(o.k) : sel === o.k
            return (
              <button
                key={o.k}
                type="button"
                className={`chip ${on ? 'on' : ''}`}
                onClick={() => set(f.id, multi ? (on ? sel.filter((x) => x !== o.k) : [...sel, o.k]) : on ? null : o.k)}
              >
                {label}
              </button>
            )
          })}
        </div>
      )
    }
    case 'slider':
      return (
        <div>
          <label className="field-label">{t('intensityNow')}</label>
          <div className="slider-row">
            <input type="range" min="1" max="10" value={value ?? 5} onChange={(e) => set(f.id, Number(e.target.value))} />
            <div className="slider-val">{value ?? 5}</div>
          </div>
        </div>
      )
    case 'checks':
      return (
        <div className="opt-col">
          {f.opts.map((o) => {
            const sel = value || []
            const on = sel.includes(o.k)
            return (
              <label key={o.k} className={`opt-row ${on ? 'on' : ''}`}>
                <input type="checkbox" checked={on} onChange={() => set(f.id, on ? sel.filter((x) => x !== o.k) : [...sel, o.k])} />
                <span>{L(lang, o)}</span>
              </label>
            )
          })}
        </div>
      )
    case 'radio':
      return (
        <div className="opt-col">
          {f.opts.map((o) => (
            <label key={o.k} className={`opt-row ${value === o.k ? 'on' : ''}`}>
              <input type="radio" checked={value === o.k} onChange={() => set(f.id, o.k)} />
              <span>{L(lang, o)}</span>
            </label>
          ))}
        </div>
      )
    case 'check':
      return (
        <label className={`opt-row ${value ? 'on' : ''}`}>
          <input type="checkbox" checked={!!value} onChange={(e) => set(f.id, e.target.checked)} />
          <span>{f.label ? L(lang, f.label) : ''}</span>
        </label>
      )
    case 'inputs5': {
      const items = value || ['', '', '', '', '']
      return (
        <div>
          <label className="field-label">{L(lang, f.label)}</label>
          <div className="grid" style={{ gap: 8 }}>
            {items.map((v, i) => (
              <input
                key={i}
                type="text"
                value={v}
                placeholder={`${i + 1}.`}
                onChange={(e) => set(f.id, items.map((x, j) => (j === i ? e.target.value : x)))}
              />
            ))}
          </div>
        </div>
      )
    }
    case 'breathing':
      return <BreathingGuide />
    default:
      return null
  }
}

/* ---------------- JOURNAL: list, filter, search, compare ---------------- */
function Journal({ emotion, m }) {
  const { data, lang, t } = useContext(AppCtx)
  const entries = data.entries[emotion]
  const [q, setQ] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [openId, setOpenId] = useState(null)
  const [compare, setCompare] = useState(false)

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      // compare in LOCAL days — e.date is UTC ISO, the date pickers and displayed dates are local
      const dt = new Date(e.date)
      const d = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
      if (from && d < from) return false
      if (to && d > to) return false
      if (q && !entryText(e).toLowerCase().includes(q.toLowerCase())) return false
      return true
    })
  }, [entries, q, from, to])

  if (!entries.length) return <div className="card muted">{t('noEntries')}</div>

  return (
    <div>
      <div className="filters">
        <div style={{ flex: 2 }}>
          <label className="field-label">🔎</label>
          <input type="search" placeholder={t('searchEntries')} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div>
          <label className="field-label">{t('from')}</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="field-label">{t('to')}</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        {entries.length >= 2 && (
          <button className="btn ghost sm" style={{ height: 44 }} onClick={() => setCompare(true)}>
            ⚖️ {t('compare')}
          </button>
        )}
      </div>
      <div className="grid">
        {[...filtered].reverse().map((e) => (
          <div key={e.id} className="entry" onClick={() => setOpenId(openId === e.id ? null : e.id)}>
            <div className="date">
              📅 {new Date(e.date).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
              {e.intensity ? ` · ${t('intensity')}: ${e.intensity}/10` : ''}
            </div>
            <div className="preview">{preview(e, m)}</div>
            {openId === e.id && <EntryFull e={e} />}
          </div>
        ))}
      </div>
      {compare && (
        <div className="modal-bg" onClick={() => setCompare(false)}>
          <div className="modal" onClick={(ev) => ev.stopPropagation()}>
            <h2 style={{ marginBottom: 14 }}>⚖️ {t('compare')}</h2>
            <div className="grid grid-2">
              <div>
                <h3 style={{ color: m.color }}>{t('firstEntry')}</h3>
                <div className="small muted">{fmtDate(lang, entries[0].date)}</div>
                <EntryFull e={entries[0]} />
              </div>
              <div>
                <h3 style={{ color: m.color }}>{t('latestEntry')}</h3>
                <div className="small muted">{fmtDate(lang, entries[entries.length - 1].date)}</div>
                <EntryFull e={entries[entries.length - 1]} />
              </div>
            </div>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <button className="btn sm" onClick={() => setCompare(false)}>{t('close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function preview(e, m) {
  for (const k of m.journalFields) if (typeof e[k] === 'string' && e[k].trim()) return e[k].slice(0, 120)
  return '…'
}

const SKIP = new Set(['id', 'date', 'intensity']) // intensity is already on the entry's date line
function EntryFull({ e }) {
  const { lang } = useContext(AppCtx)
  return (
    <div className="full" onClick={(ev) => ev.stopPropagation()}>
      {Object.entries(e).map(([k, v]) => {
        if (SKIP.has(k) || v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) return null
        const val = Array.isArray(v)
          ? v.filter((x) => (typeof x === 'string' ? x.trim() : x)).map((x) => optionLabel(lang, x)).join(', ')
          : typeof v === 'boolean'
            ? (v ? '✓' : '—')
            : k === 'tookDate'
              ? fmtDate(lang, v)
              : k === 'emotion' || k === 'threat' // only selection fields — free text must never be remapped
                ? optionLabel(lang, String(v))
                : String(v)
        if (!val) return null
        return (
          <div key={k}>
            <div className="k">{FIELD_LABELS[k] ? L(lang, FIELD_LABELS[k]) : k}</div>
            <div>{val}</div>
          </div>
        )
      })}
    </div>
  )
}

/* ---------------- PROGRESS: counter, mastery, intensity chart, insight ---------------- */
function Progress({ emotion, m }) {
  const { data, lang, t } = useContext(AppCtx)
  const entries = data.entries[emotion]
  const score = masteryScore(entries)
  const series = intensitySeries(entries, lang)
  const change = intensityChange(entries)
  const name = L(lang, EMOTION_NAMES[emotion]).toLowerCase()

  return (
    <div className="grid">
      <div className="stat-row">
        <div className="stat"><div className="n">{entries.length}</div><div className="l">{t('practiceCount', entries.length, name)}</div></div>
        <div className="stat">
          <div className="n" style={{ color: m.color }}>{score}<span className="muted" style={{ fontSize: 15 }}>/100</span></div>
          <div className="l">{t('masteryScore')} · {t('masteryHint')}</div>
          <div className="meter" style={{ marginTop: 8 }}><div style={{ width: `${score}%`, background: m.color }} /></div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 12 }}>📈 {t('intensityOverTime')}</h3>
        {series.length < 2 ? (
          <p className="muted">{t('needMore')}</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={series} margin={{ top: 8, right: 16, bottom: 0, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e9f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="intensity" stroke={m.color} strokeWidth={3} dot={{ r: 5, fill: m.color }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="quote" style={{ marginTop: 12, borderColor: m.color }}>
              💡 {change === null ? t('insightFlat') : change < 0 ? t('insightDown', Math.abs(change), name) : change > 0 ? t('insightUp', change, name) : t('insightFlat')}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
