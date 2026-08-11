import React, { useContext, useMemo, useState } from 'react'
import { AppCtx } from '../App.jsx'
import { L, EMOTION_NAMES, FIELD_LABELS, FIELD_PHS, optionLabel, UI, isBareStarter, localizeStarter } from '../content.js'
import { EMOTION_KEYS, CHECKIN_SLOTS, fmtDate, fmtDateTime, fmtMonthYear, weekForDay, entryText } from '../store.js'
import { buildEntryReport, buildDayReport, buildCheckinReport, downloadPdf } from '../pdf.js'

/* Reports — every saved answer as a daily written record: read in-app as a
   formatted page, download as PDF. The list is derived from local data, so it
   works offline; the PDF archive in cloud storage is maintained by the sync
   layer independently. */
export default function Reports() {
  const { data, lang, t, user, notify } = useContext(AppCtx)
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(null)

  const records = useMemo(() => {
    const list = []
    for (const k of EMOTION_KEYS) {
      for (const e of data.entries[k]) {
        list.push({ id: `e:${e.id}`, kind: 'entry', at: e.date, emotion: k, entry: e, exact: true })
      }
    }
    for (const [day, dd] of Object.entries(data.journey.days)) {
      if (!dd?.done) continue
      // pre-feature days have no doneAt — approximate from the journey start
      const exact = Boolean(dd.doneAt)
      const at = dd.doneAt ||
        (data.journey.startDate
          ? new Date(new Date(data.journey.startDate + 'T12:00:00').getTime() + (Number(day) - 1) * 86400000).toISOString()
          : new Date().toISOString())
      list.push({ id: `d:${day}`, kind: 'day', at, day, dayData: dd, exact })
    }
    for (const [date, ci] of Object.entries(data.checkins)) {
      const times = CHECKIN_SLOTS.map((s) => ci[s]?.savedAt).filter(Boolean).sort()
      if (!times.length) continue // drafts only — not a record yet
      list.push({ id: `c:${date}`, kind: 'checkin', at: times[times.length - 1], date, ci, exact: true })
    }
    return list.sort((a, b) => new Date(b.at) - new Date(a.at))
  }, [data])

  const filtered = records.filter((r) =>
    filter === 'all' ? true
    : filter === 'journey' ? r.kind === 'day'
    : filter === 'checkin' ? r.kind === 'checkin'
    : r.emotion === filter)

  const open = openId && filtered.find((r) => r.id === openId)

  const title = (r) =>
    r.kind === 'entry'
      ? t('reportEntryTitle', L(lang, EMOTION_NAMES[r.emotion]))
      : r.kind === 'checkin'
        ? t('checkinTitle')
        : `${t('reportDayTitle', r.day)} — ${L(lang, weekForDay(Number(r.day))?.title ?? { en: '' })}`

  const download = async (r) => {
    try {
      const built = r.kind === 'entry'
        ? await buildEntryReport({ entry: r.entry, emotion: r.emotion, lang, uid: user.uid })
        : r.kind === 'checkin'
          ? await buildCheckinReport({ date: r.date, checkin: r.ci, lang, uid: user.uid })
          : await buildDayReport({ day: r.day, dayData: r.dayData, lang, uid: user.uid })
      const d = new Date(r.at)
      const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      downloadPdf(built.bytes, `${stamp} — ${title(r)}.pdf`)
    } catch {
      notify(t('reportPdfError'))
    }
  }

  if (open) return <ReportView r={open} title={title(open)} onBack={() => setOpenId(null)} onDownload={() => download(open)} />

  if (!records.length) {
    return (
      <div>
        <div className="hero"><h1>{t('reportsNav')}</h1><div className="q">{t('reportsHint')}</div></div>
        <div className="card muted">{t('reportsEmpty')}</div>
      </div>
    )
  }

  // group by month, list already newest-first
  const groups = []
  for (const r of filtered) {
    const label = fmtMonthYear(lang, r.at)
    if (!groups.length || groups[groups.length - 1].label !== label) groups.push({ label, items: [] })
    groups[groups.length - 1].items.push(r)
  }

  const chips = [
    ['all', t('reportsAll')],
    ['checkin', t('checkinTitle')],
    ...EMOTION_KEYS.map((k) => [k, L(lang, EMOTION_NAMES[k])]),
    ['journey', t('journey')],
  ]

  return (
    <div>
      <div className="hero"><h1>{t('reportsNav')}</h1><div className="q">{t('reportsHint')}</div></div>

      <div className="chips" style={{ marginBottom: 16 }}>
        {chips.map(([k, label]) => (
          <button key={k} type="button" className={`chip ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>
            {label}
          </button>
        ))}
      </div>

      {!filtered.length && <div className="card muted">{t('reportsEmpty')}</div>}

      {groups.map((g) => (
        <div key={g.label} style={{ marginBottom: 18 }}>
          <div className="caps" style={{ margin: '12px 0 8px' }}>{g.label}</div>
          <div className="grid">
            {g.items.map((r) => (
              <div key={r.id} className="entry report-row" onClick={() => setOpenId(r.id)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="report-title">{title(r)}</div>
                  <div className="date">
                    {r.exact ? fmtDateTime(lang, r.at) : fmtDate(lang, r.at)}
                    {r.kind === 'entry' && r.entry.intensity ? ` · ${t('intensity')}: ${r.entry.intensity}/10` : ''}
                  </div>
                  {r.kind === 'entry' && <div className="preview">{entryText(r.entry).slice(0, 110)}</div>}
                  {r.kind === 'checkin' && (
                    <div className="preview">
                      {CHECKIN_SLOTS.filter((s) => r.ci[s]?.savedAt).map((s) => r.ci[s].text).join(' · ').slice(0, 110)}
                    </div>
                  )}
                </div>
                <button className="btn ghost sm" onClick={(e) => { e.stopPropagation(); download(r) }}>
                  {t('reportDownload')}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------------- full-page in-app report view ---------------- */

const ENTRY_SKIP = new Set(['id', 'date', 'intensity', 'legacyId'])

function ReportView({ r, title, onBack, onDownload }) {
  const { lang, t } = useContext(AppCtx)
  return (
    <div className="report-view">
      <button className="btn ghost sm" onClick={onBack}>‹ {t('reportsNav')}</button>
      <div className="card" style={{ marginTop: 14 }}>
        <h1 className="serif" style={{ marginBottom: 4 }}>{title}</h1>
        <div className="caps" style={{ marginBottom: 18 }}>
          {r.exact ? fmtDateTime(lang, r.at) : fmtDate(lang, r.at)}
          {r.kind === 'entry' && r.entry.intensity ? ` · ${t('intensity')}: ${r.entry.intensity}/10` : ''}
        </div>
        {r.kind === 'entry' ? <EntryBody e={r.entry} />
          : r.kind === 'checkin' ? <CheckinBody ci={r.ci} />
          : <DayBody day={r.day} dayData={r.dayData} />}
        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <button className="btn sm" onClick={onDownload}>{t('reportDownload')}</button>
        </div>
      </div>
    </div>
  )
}

function EntryBody({ e }) {
  const { lang } = useContext(AppCtx)
  return (
    <div className="report-body">
      {Object.entries(e).map(([k, v]) => {
        if (ENTRY_SKIP.has(k) || v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) return null
        const val = Array.isArray(v)
          ? v.filter((x) => (typeof x === 'string' ? x.trim() : x)).map((x) => optionLabel(lang, x)).join(', ')
          : typeof v === 'boolean'
            ? (v ? L(lang, UI.yesWord) : '—')
            : k === 'tookDate'
              ? fmtDate(lang, v)
              : k === 'emotion' || k === 'threat'
                ? optionLabel(lang, String(v))
                : localizeStarter(String(v), FIELD_PHS[k], lang)
        if (!val) return null
        return (
          <div key={k} className="report-field">
            <div className="k caps">{FIELD_LABELS[k] ? L(lang, FIELD_LABELS[k]) : k}</div>
            <div className="v">{val}</div>
          </div>
        )
      })}
    </div>
  )
}

const CHECKIN_LABELS = { morning: 'ritualMorning', day: 'ritualDay', evening: 'ritualEvening' }
const CHECKIN_PHS = { morning: UI.ritualMorningPh, day: UI.ritualDayPh, evening: UI.ritualEveningPh }

function CheckinBody({ ci }) {
  const { lang, t } = useContext(AppCtx)
  return (
    <div className="report-body">
      {CHECKIN_SLOTS.map((s) =>
        ci[s]?.savedAt ? (
          <div key={s} className="report-field">
            <div className="k caps">{t(CHECKIN_LABELS[s])}</div>
            <div className="v">{localizeStarter(ci[s].text, CHECKIN_PHS[s], lang)}</div>
          </div>
        ) : null,
      )}
    </div>
  )
}

function DayBody({ day, dayData }) {
  const { lang } = useContext(AppCtx)
  const week = weekForDay(Number(day))
  if (!week) return null
  return (
    <div className="report-body">
      {week.practices.map((p) => {
        const answered = (p.fields || []).filter((f) => {
          const v = dayData.fields?.[`${p.id}.${f.id}`]
          return v !== undefined && v !== null && v !== '' && f.t !== 'breathing' && !isBareStarter(v, f.ph)
        })
        if (!answered.length) return null
        return (
          <div key={p.id} style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 8 }}>{L(lang, p.title)}</h3>
            {answered.map((f) => {
              const v = dayData.fields[`${p.id}.${f.id}`]
              return (
                <div key={f.id} className="report-field">
                  {f.label && <div className="k caps">{L(lang, f.label)}</div>}
                  <div className="v">{typeof v === 'boolean' ? (v ? L(lang, UI.yesWord) : '—') : localizeStarter(String(v), f.ph, lang)}</div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
