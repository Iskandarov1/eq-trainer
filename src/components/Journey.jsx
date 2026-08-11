import React, { useContext, useEffect, useState } from 'react'
import { AppCtx } from '../App.jsx'
import { L, WEEKS, UI, starterFor } from '../content.js'
import { weekForDay, journeyStats, todayKey, fmtDate, CHECKIN_SLOTS } from '../store.js'
import BreathingGuide from './BreathingGuide.jsx'

export default function Journey() {
  const { data, update, lang, t, sync } = useContext(AppCtx)
  const j = data.journey
  const { done, cur, streak } = journeyStats(j)
  const [openDay, setOpenDay] = useState(null)
  const [tabId, setTabId] = useState(() => weekForDay(Math.min(Math.max(cur, 1), 30))?.id || WEEKS[0].id)

  if (!j.startDate) {
    return (
      <div>
        <div className="hero">
          <h1>{t('journeyCard')}</h1>
          <div className="q">{t('heroQuote')}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <h2 style={{ margin: '10px 0 6px' }}>{t('journey')}</h2>
          <p className="muted" style={{ maxWidth: 460, margin: '0 auto 18px' }}>{t('startJourneyHint')}</p>
          <button className="btn brand" onClick={() => { update((d) => { d.journey.startDate = new Date().toISOString().slice(0, 10) }); sync.profile() }}>
            {t('startJourney')}
          </button>
        </div>
        <DailyCheckin />
        <WeekPreviews lang={lang} />
      </div>
    )
  }

  const journeyDone = done >= 30 || cur > 30
  const activeWeek = WEEKS.find((w) => w.id === tabId) || WEEKS[0]
  const inWeek = (d, w) => d >= w.days[0] && d <= w.days[1]
  const day = openDay ?? (inWeek(Math.min(cur, 30), activeWeek) ? Math.min(cur, 30) : activeWeek.days[0])
  const selectDay = (d) => { setTabId(weekForDay(d).id); setOpenDay(d) }
  const pickWeek = (w) => { setTabId(w.id); setOpenDay(inWeek(Math.min(cur, 30), w) ? Math.min(cur, 30) : w.days[0]) }
  const weekState = (w) => (Math.min(cur, 30) > w.days[1] ? 'done' : inWeek(Math.min(cur, 30), w) ? 'current' : 'locked')

  return (
    <div>
      <div className="hero">
        <h1>{t('journeyCard')}</h1>
        <div className="q">{t('heroQuote')}</div>
      </div>

      <div className="stat-row" style={{ marginBottom: 18 }}>
        <div className="stat"><div className="n">{Math.min(cur, 30)}<span className="muted" style={{ fontSize: 15 }}> / 30</span></div><div className="l">{t('day')}</div></div>
        <div className="stat"><div className="n">{done}</div><div className="l">{t('daysCompleted')}</div></div>
        <div className="stat"><div className="n" style={{ color: 'var(--amber)' }}>{streak}</div><div className="l">{t('streak')}</div></div>
      </div>

      {journeyDone && (
        <div className="card" style={{ marginBottom: 18, borderColor: 'var(--amber)', background: 'var(--surface-2)' }}>
          <h2>{t('congratsJourney')}</h2>
        </div>
      )}

      <div className="tabs">
        {WEEKS.map((w, i) => (
          <button key={w.id} className={tabId === w.id ? 'active' : ''} onClick={() => pickWeek(w)}>
            {t('weekWord')} {i + 1}
          </button>
        ))}
        <button className={tabId === 'path' ? 'active' : ''} onClick={() => setTabId('path')}>{t('pathTab')}</button>
      </div>

      {tabId === 'path' ? (
        <JourneyPath cur={cur} days={j.days} onOpenDay={(d) => { selectDay(d); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
      ) : (
        <>
          <div className="card week-card" style={{ '--wcolor': activeWeek.color, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div className="caps">{t('weekWord')} {WEEKS.indexOf(activeWeek) + 1}</div>
                <h3 className="serif" style={{ fontSize: 18, marginTop: 2 }}>{L(lang, activeWeek.title)}</h3>
              </div>
              <span className={`week-state ${weekState(activeWeek)}`}>
                {weekState(activeWeek) === 'current' ? t('currentWeek') : weekState(activeWeek) === 'done' ? t('completedW') : t('upcoming')}
              </span>
            </div>
            <p className="muted" style={{ margin: '8px 0 4px', fontStyle: 'italic' }}>{L(lang, activeWeek.quote)}</p>
            <p className="small" style={{ margin: '4px 0' }}>{L(lang, activeWeek.intro)}</p>
            <p className="small muted">{t('weekGoal')}: {L(lang, activeWeek.goal)}</p>
            <div className="week-days">
              {Array.from({ length: activeWeek.days[1] - activeWeek.days[0] + 1 }, (_, i) => activeWeek.days[0] + i).map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`path-node ${j.days[d]?.done ? 'done' : ''} ${d === cur ? 'today' : ''} ${[7, 14, 21, 30].includes(d) ? 'milestone' : ''} ${d === day ? 'sel' : ''} clickable`}
                  title={`${t('browseDay')} ${d}`}
                  onClick={() => setOpenDay(d)}
                >
                  {j.days[d]?.done ? ([7, 14, 21, 30].includes(d) ? '★' : '✓') : d}
                </button>
              ))}
            </div>
          </div>
          <DayView day={day} isToday={day === cur} />
        </>
      )}

      <DailyCheckin />
    </div>
  )
}

/* Duolingo-style unlock path, calm tone: dashed spine, winding nodes,
   week headers as chapters, amber milestones, pulsing today, dimmed locked future */
const PATH_OFFSETS = [0, -1, 0, 1] // gentle S-curve
function JourneyPath({ cur, days, onOpenDay }) {
  const { lang, t } = useContext(AppCtx)
  return (
    <div className="path">
      {WEEKS.map((w, wi) => {
        const curClamped = Math.min(cur, 30)
        const state = curClamped > w.days[1] ? 'done' : curClamped >= w.days[0] ? 'current' : 'locked'
        const range = []
        for (let d = w.days[0]; d <= w.days[1]; d++) range.push(d)
        return (
          <div key={w.id} className="path-seg" style={{ '--wcolor': w.color }}>
            <div className="path-week-head card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div className="caps">{t('weekWord')} {wi + 1}</div>
                  <h3 className="serif" style={{ fontSize: 18, marginTop: 2 }}>{L(lang, w.title)}</h3>
                </div>
                <span className={`week-state ${state}`}>
                  {state === 'current' ? t('currentWeek') : state === 'done' ? t('completedW') : t('upcoming')}
                </span>
              </div>
              {state !== 'locked' && <p className="small muted" style={{ marginTop: 6 }}>{t('weekGoal')}: {L(lang, w.goal)}</p>}
            </div>
            {range.map((d, i) => {
              const future = d > cur
              const isDone = !!days[d]?.done
              const milestone = [7, 14, 21, 30].includes(d)
              return (
                <button
                  key={d}
                  type="button"
                  className={`path-node clickable ${isDone ? 'done' : ''} ${d === cur ? 'today' : ''} ${milestone ? 'milestone' : ''} ${future ? 'locked' : ''}`}
                  style={{ transform: `translateX(${PATH_OFFSETS[i % PATH_OFFSETS.length] * 36}px)` }}
                  title={`${t('browseDay')} ${d}`}
                  onClick={() => onOpenDay(d)}
                >
                  {isDone ? (milestone ? '★' : '✓') : d}
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function WeekPreviews({ lang }) {
  return (
    <div className="grid" style={{ marginTop: 18 }}>
      {WEEKS.map((w) => (
        <div key={w.id} className="card week-card" style={{ '--wcolor': w.color }}>
          <h3>{L(lang, w.title)}</h3>
          <p className="muted" style={{ margin: '6px 0' }}>{L(lang, w.quote)}</p>
          <p className="small muted">{L(lang, w.goal)}</p>
        </div>
      ))}
    </div>
  )
}

const MILESTONES = [7, 14, 21, 30]

function DayView({ day, isToday }) {
  const { data, update, lang, t, notify, sync } = useContext(AppCtx)
  const [celebrate, setCelebrate] = useState(false)
  const w = weekForDay(day)
  if (!w) return null
  const dayData = data.journey.days[day] || { fields: {}, done: false }
  const setField = (pid, fid, val) => {
    update((d) => {
      const dd = (d.journey.days[day] ||= { fields: {}, done: false })
      dd.fields[`${pid}.${fid}`] = val
    })
    sync.dayFields(day)
  }

  return (
    <div className="card week-card" style={{ '--wcolor': w.color }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div className="caps">{t('day')} {day} {t('of30')}</div>
          <h2 className="serif" style={{ marginTop: 2 }}>{L(lang, w.title)}</h2>
        </div>
        {dayData.done && <span className="week-state done" style={{ marginLeft: 'auto' }}>{t('dayDone')}</span>}
      </div>
      <div className="quote" style={{ margin: '12px 0', borderColor: w.color }}>{L(lang, w.quote)}</div>
      <h3 style={{ margin: '14px 0 10px' }}>{t('todayPractices')}</h3>
      <div className="grid">
        {w.practices.map((p) => (
          <div key={p.id} className="pstep" style={{ '--accent': w.color }}>
            <h3>{L(lang, p.title)}</h3>
            <p className="muted small" style={{ marginBottom: 12 }}>{L(lang, p.desc)}</p>
            <div className="grid" style={{ gap: 12 }}>
              {p.fields.map((f) => {
                const val = dayData.fields[`${p.id}.${f.id}`]
                if (f.t === 'breathing')
                  return <BreathingGuide key={f.id} pattern={f.pattern} target={f.target} />
                if (f.t === 'check')
                  return (
                    <label key={f.id} className={`opt-row ${val ? 'on' : ''}`} style={{ '--accent': w.color }}>
                      <input type="checkbox" checked={!!val} onChange={(e) => setField(p.id, f.id, e.target.checked)} />
                      <span>{L(lang, f.label)}</span>
                    </label>
                  )
                const prefill = f.ph ? starterFor(lang, f.ph) : ''
                if (f.t === 'text')
                  return (
                    <div key={f.id}>
                      {f.label && <label className="field-label">{L(lang, f.label)}</label>}
                      <input type="text" value={val ?? prefill} onChange={(e) => setField(p.id, f.id, e.target.value)} />
                    </div>
                  )
                return (
                  <div key={f.id}>
                    {f.label && <label className="field-label">{L(lang, f.label)}</label>}
                    <textarea value={val ?? prefill} onChange={(e) => setField(p.id, f.id, e.target.value)} />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button
          className="btn"
          disabled={dayData.done}
          onClick={() => {
            update((d) => {
              const dd = (d.journey.days[day] ||= { fields: {} })
              dd.done = true
              dd.doneAt = new Date().toISOString()
            })
            sync.dayDone(day)
            if (MILESTONES.includes(day)) setCelebrate(true)
            else notify(t('saved'))
          }}
        >
          {dayData.done ? t('dayDone') : `✓ ${t('markDayDone')}`}
        </button>
      </div>
      {celebrate && <Celebrate day={day} onClose={() => setCelebrate(false)} />}
    </div>
  )
}

/* Milestone-only celebration (days 7/14/21/30) — everyday completion stays subtle */
const CONFETTI_COLORS = ['#0ca678', '#f59f00', '#e8590c', '#7048e8', '#1971c2']
function Celebrate({ day, onClose }) {
  const { t } = useContext(AppCtx)
  return (
    <div className="celebrate-bg" onClick={onClose}>
      <div className="celebrate" onClick={(e) => e.stopPropagation()}>
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className="confetti"
            style={{
              left: `${(i * 7 + 4) % 100}%`,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animationDelay: `${(i % 7) * 0.25}s`,
            }}
          />
        ))}
        <div className="big" style={{ color: 'var(--amber)' }}>★</div>
        <h2>{t('milestoneTitle', day)}</h2>
        <p className="muted" style={{ marginBottom: 18 }}>{t('milestoneBody')}</p>
        <button className="btn brand" onClick={onClose}>{t('continueWord')}</button>
      </div>
    </div>
  )
}

/* Daily check-in — one fresh record per calendar day. Each of the three parts
   has its own Save/Edit: saved answers lock (and sync + archive as a PDF
   snapshot); unsaved drafts still persist locally on every keystroke, so a
   half-typed morning answer survives closing the page. Past days are permanent
   records readable in Reports. */
const CHECKIN_PARTS = [
  ['morning', 'ritualMorning', UI.ritualMorningPh],
  ['day', 'ritualDay', UI.ritualDayPh],
  ['evening', 'ritualEvening', UI.ritualEveningPh],
]
const hhmm = (iso) => {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// A draft that is just the untouched sentence starter (in ANY language — it got
// stored in whatever language was active when the user clicked in and typed
// nothing lasting) counts as empty, so the shown starter follows the language
// switch instead of sticking to the old one.
const bareStarter = (txt, ph) =>
  ['en', 'ru', 'uz'].some((l) => txt.trim() === starterFor(l, ph).trim())

function DailyCheckin() {
  const { data, update, lang, t, go, sync, notify } = useContext(AppCtx)
  const today = todayKey()
  const ci = data.checkins[today] || {}

  // One-time seed: text typed into the old persistent Ritual becomes today's
  // drafts, so nothing anyone already wrote is lost by this feature.
  useEffect(() => {
    const r = data.journey.ritual
    if (Object.keys(data.checkins).length || !(r.morning || r.day || r.evening)) return
    update((d) => {
      const c = (d.checkins[today] ||= {})
      for (const [s, , ph] of CHECKIN_PARTS) {
        const v = d.journey.ritual[s]
        if (v?.trim() && !bareStarter(v, ph) && !c[s]) c[s] = { text: v }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const history = Object.keys(data.checkins)
    .filter((d) => d !== today && CHECKIN_SLOTS.some((s) => data.checkins[d][s]?.savedAt))
    .sort()
    .reverse()
    .slice(0, 7)

  return (
    <div className="card" style={{ marginTop: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <h2>{t('checkinTitle')}</h2>
        <span className="caps" style={{ marginLeft: 'auto' }}>{fmtDate(lang, `${today}T12:00:00`)}</span>
      </div>
      <p className="muted" style={{ margin: '8px 0 14px' }}>{t('checkinIntro')}</p>
      <div className="grid" style={{ gap: 12 }}>
        {CHECKIN_PARTS.map(([key, labelKey, ph]) => {
          const slot = ci[key]
          const saved = Boolean(slot?.savedAt)
          const starter = starterFor(lang, ph)
          const raw = slot?.text ?? ''
          const empty = !raw.trim() || bareStarter(raw, ph)
          const text = empty ? '' : raw
          return (
            <div key={key}>
              <label className="field-label">{t(labelKey)}</label>
              {saved ? (
                <>
                  <div className="checkin-saved">{slot.text}</div>
                  <div className="checkin-foot">
                    <span className="caps">{t('checkinSavedAt', hhmm(slot.savedAt))}</span>
                    <button
                      className="btn ghost sm"
                      onClick={() => update((d) => { delete d.checkins[today][key].savedAt })}
                    >
                      {t('checkinEdit')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <textarea
                    value={text || starter}
                    onChange={(e) => update((d) => {
                      const c = (d.checkins[today] ||= {})
                      c[key] = { text: e.target.value }
                    })}
                  />
                  <div className="checkin-foot">
                    <button
                      className="btn sm"
                      disabled={empty}
                      onClick={() => {
                        update((d) => {
                          const c = (d.checkins[today] ||= {})
                          c[key] = { text: text.trim(), savedAt: new Date().toISOString() }
                        })
                        sync.checkinSaved(today, key)
                        notify(t('saved'))
                      }}
                    >
                      {t('checkinSave')}
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
      {history.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div className="caps" style={{ marginBottom: 8 }}>{t('checkinHistory')}</div>
          <div className="checkin-history">
            {history.map((d) => (
              <button key={d} type="button" className="checkin-day-row" onClick={() => go({ page: 'reports' })}>
                <span>{fmtDate(lang, `${d}T12:00:00`)}</span>
                <span className="muted">
                  {CHECKIN_SLOTS.filter((s) => data.checkins[d][s]?.savedAt).length}/3
                </span>
              </button>
            ))}
          </div>
          <p className="small muted" style={{ margin: '8px 0 0' }}>{t('checkinHistoryHint')}</p>
        </div>
      )}
      <div className="quote" style={{ marginTop: 14 }}>{t('finalWords')}</div>
    </div>
  )
}
