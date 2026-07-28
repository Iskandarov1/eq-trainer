import React, { useContext, useState } from 'react'
import { AppCtx } from '../App.jsx'
import { L, WEEKS } from '../content.js'
import { weekForDay, journeyStats } from '../store.js'

export default function Journey() {
  const { data, update, lang, t } = useContext(AppCtx)
  const j = data.journey
  const { done, cur, streak } = journeyStats(j)
  const [openDay, setOpenDay] = useState(null)

  if (!j.startDate) {
    return (
      <div>
        <div className="hero">
          <h1>{t('journeyCard')}</h1>
          <div className="q">{t('heroQuote')}</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 44 }}>🌱</div>
          <h2 style={{ margin: '10px 0 6px' }}>{t('journey')}</h2>
          <p className="muted" style={{ maxWidth: 460, margin: '0 auto 18px' }}>{t('startJourneyHint')}</p>
          <button className="btn brand" onClick={() => update((d) => { d.journey.startDate = new Date().toISOString().slice(0, 10) })}>
            🚀 {t('startJourney')}
          </button>
        </div>
        <WeekPreviews lang={lang} />
      </div>
    )
  }

  const day = openDay ?? Math.min(cur, 30)
  const journeyDone = done >= 30 || cur > 30

  return (
    <div>
      <div className="hero">
        <h1>{t('journeyCard')}</h1>
        <div className="q">{t('heroQuote')}</div>
      </div>

      <div className="stat-row" style={{ marginBottom: 18 }}>
        <div className="stat"><div className="n">{Math.min(cur, 30)}<span className="muted" style={{ fontSize: 15 }}> / 30</span></div><div className="l">{t('day')}</div></div>
        <div className="stat"><div className="n">{done}</div><div className="l">{t('daysCompleted')}</div></div>
        <div className="stat"><div className="n">🔥 {streak}</div><div className="l">{t('streak')}</div></div>
      </div>

      {journeyDone && (
        <div className="card" style={{ marginBottom: 18, borderColor: 'var(--amber)', background: 'var(--surface-2)' }}>
          <h2>🎉 {t('congratsJourney')}</h2>
        </div>
      )}

      <DayView day={day} isToday={day === cur} />

      <h2 style={{ margin: '26px 0 12px' }}>{t('weeks')}</h2>
      <div className="grid">
        {WEEKS.map((w) => (
          <WeekCard key={w.id} w={w} cur={cur} days={j.days} onOpenDay={(d) => { setOpenDay(d); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
        ))}
      </div>

      <Ritual visible={cur > 30 || done >= 30} />
    </div>
  )
}

function WeekPreviews({ lang }) {
  return (
    <div className="grid" style={{ marginTop: 18 }}>
      {WEEKS.map((w) => (
        <div key={w.id} className="card week-card" style={{ '--wcolor': w.color }}>
          <h3>{w.emoji} {L(lang, w.title)}</h3>
          <p className="muted" style={{ margin: '6px 0' }}>{L(lang, w.quote)}</p>
          <p className="small muted">🎯 {L(lang, w.goal)}</p>
        </div>
      ))}
    </div>
  )
}

function WeekCard({ w, cur, days, onOpenDay }) {
  const { lang, t } = useContext(AppCtx)
  const curClamped = Math.min(cur, 30)
  const state = curClamped > w.days[1] ? 'done' : curClamped >= w.days[0] ? 'current' : 'locked'
  const range = []
  for (let d = w.days[0]; d <= w.days[1]; d++) range.push(d)
  return (
    <div className="card week-card" style={{ '--wcolor': w.color }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <h3 style={{ flex: 1 }}>{w.emoji} {L(lang, w.title)}</h3>
        <span className={`week-state ${state}`}>
          {state === 'current' ? t('currentWeek') : state === 'done' ? t('completedW') : t('upcoming')}
        </span>
      </div>
      <p className="muted" style={{ margin: '8px 0 4px', fontStyle: 'italic' }}>{L(lang, w.quote)}</p>
      <p className="small" style={{ margin: '4px 0' }}>{L(lang, w.intro)}</p>
      <p className="small muted">🎯 {t('weekGoal')}: {L(lang, w.goal)}</p>
      <div className="day-dots">
        {range.map((d) => {
          const unlocked = d <= cur
          return (
            <div
              key={d}
              className={`day-dot ${days[d]?.done ? 'done' : ''} ${d === cur ? 'today' : ''} ${[7, 14, 21, 30].includes(d) ? 'milestone' : ''} ${unlocked ? 'clickable' : 'locked'}`}
              title={unlocked ? `${t('browseDay')} ${d}` : t('locked')}
              onClick={() => unlocked && onOpenDay(d)}
            >
              {d}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const MILESTONES = [7, 14, 21, 30]

function DayView({ day, isToday }) {
  const { data, update, lang, t, notify } = useContext(AppCtx)
  const [celebrate, setCelebrate] = useState(false)
  const w = weekForDay(day)
  if (!w) return null
  const dayData = data.journey.days[day] || { fields: {}, done: false }
  const setField = (pid, fid, val) =>
    update((d) => {
      const dd = (d.journey.days[day] ||= { fields: {}, done: false })
      dd.fields[`${pid}.${fid}`] = val
    })

  return (
    <div className="card week-card" style={{ '--wcolor': w.color }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div className="caps">{t('day')} {day} {t('of30')}</div>
          <h2 className="serif" style={{ marginTop: 2 }}>{w.emoji} {L(lang, w.title)}</h2>
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
                if (f.t === 'check')
                  return (
                    <label key={f.id} className={`opt-row ${val ? 'on' : ''}`} style={{ '--accent': w.color }}>
                      <input type="checkbox" checked={!!val} onChange={(e) => setField(p.id, f.id, e.target.checked)} />
                      <span>{L(lang, f.label)}</span>
                    </label>
                  )
                if (f.t === 'text')
                  return (
                    <div key={f.id}>
                      <label className="field-label">{L(lang, f.label)}</label>
                      <input type="text" value={val || ''} placeholder={f.ph ? L(lang, f.ph) : ''} onChange={(e) => setField(p.id, f.id, e.target.value)} />
                    </div>
                  )
                return (
                  <div key={f.id}>
                    <label className="field-label">{L(lang, f.label)}</label>
                    <textarea value={val || ''} placeholder={f.ph ? L(lang, f.ph) : ''} onChange={(e) => setField(p.id, f.id, e.target.value)} />
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
          style={{ background: w.color, color: '#fff' }}
          disabled={dayData.done}
          onClick={() => {
            update((d) => { (d.journey.days[day] ||= { fields: {} }).done = true })
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
        <div className="big">🎉</div>
        <h2>{t('milestoneTitle', day)}</h2>
        <p className="muted" style={{ marginBottom: 18 }}>{t('milestoneBody')}</p>
        <button className="btn brand" onClick={onClose}>{t('continueWord')}</button>
      </div>
    </div>
  )
}

function Ritual({ visible }) {
  const { data, update, t } = useContext(AppCtx)
  if (!visible) return null
  return (
    <div className="card" style={{ marginTop: 22 }}>
      <h2>🎯 {t('ritualTitle')}</h2>
      <p className="muted" style={{ margin: '8px 0' }}>{t('ritualIntro')}</p>
      <ul style={{ margin: '0 0 12px 20px', fontSize: 14.5 }}>
        <li>{t('ritualMorning')}</li>
        <li>{t('ritualDay')}</li>
        <li>{t('ritualEvening')}</li>
      </ul>
      <textarea
        value={data.journey.ritual}
        placeholder={t('ritualPlaceholder')}
        onChange={(e) => update((d) => { d.journey.ritual = e.target.value })}
      />
      <div className="quote" style={{ marginTop: 14 }}>{t('finalWords')}</div>
    </div>
  )
}
