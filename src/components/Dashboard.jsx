import React, { useContext } from 'react'
import { AppCtx } from '../App.jsx'
import { L, MODULES, EMOTION_NAMES, WEEKS } from '../content.js'
import { masteryScore, earnedBadges, weeklyCounts, mostImproved, focusEmotion, journeyStats, weekForDay, EMOTION_KEYS } from '../store.js'

const WeeklyBars = React.lazy(() => import('./charts/WeeklyBars.jsx'))

export default function Dashboard() {
  const { data, lang, t, go } = useContext(AppCtx)
  const entries = data.entries
  const total = EMOTION_KEYS.reduce((s, k) => s + entries[k].length, 0)
  const badges = earnedBadges(entries)
  const weekly = weeklyCounts(entries)
  const improved = mostImproved(entries)
  const focus = focusEmotion(entries)
  const { done, cur, streak } = journeyStats(data.journey)
  const started = !!data.journey.startDate

  const nextBadge = badges.filter((b) => !b.earned).sort((a, b) => a.remaining - b.remaining)[0]
  const weeklyData = EMOTION_KEYS.map((k) => ({
    name: L(lang, EMOTION_NAMES[k]),
    count: weekly[k],
    color: MODULES[k].color,
  }))
  const weeklyTop = EMOTION_KEYS.reduce((a, b) => (weekly[b] > weekly[a] ? b : a), 'anger')

  const hour = new Date().getHours()
  const greet = hour < 12 ? 'goodMorning' : hour < 18 ? 'goodAfternoon' : 'goodEvening'
  const day = Math.min(cur, 30)
  const week = started ? weekForDay(day) : WEEKS[0]

  return (
    <div>
      {/* Greeting: the emotional voice */}
      <div style={{ margin: '6px 0 20px' }}>
        <h1 className="greeting">{t(greet)}</h1>
        <p className="muted" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', maxWidth: 680 }}>{t('heroQuote')}</p>
      </div>

      {/* The single primary action */}
      <div className="today-hero" style={{ marginBottom: 18 }} onClick={() => go({ page: 'journey' })}>
        <div className="caps">
          {started
            ? `${t('todayLabel')} · ${t('day')} ${day} ${t('of30')} · ${t('weekWord')} ${WEEKS.indexOf(week) + 1}`
            : `${t('todayLabel')} · ${t('day')} 1`}
        </div>
        <div className="title">{started ? L(lang, week.title) : t('journeyCard')}</div>
        <div className="caps">{t('estPractice')}</div>
        <button className="btn light" style={{ marginTop: 8 }}>{started ? t('viewDay') : t('startJourney')} →</button>
      </div>

      {/* Compact stats */}
      <div className="stat-row" style={{ marginBottom: 18 }}>
        <div className="stat"><div className="n" style={{ color: 'var(--amber)' }}>{streak}</div><div className="l">{t('streak')}</div></div>
        <div className="stat"><div className="n">{done}</div><div className="l">{t('daysCompleted')}</div></div>
        <div className="stat"><div className="n">{total}</div><div className="l">{t('entriesWord')}</div></div>
      </div>

      {/* Next Level + Breathe entry points */}
      <div className="grid grid-2" style={{ marginBottom: 18 }}>
        <div className="card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }} onClick={() => go({ page: 'nextlevel' })}>
          <div style={{ flex: 1 }}>
            <h2>{t('nextLevelCard')}</h2>
            <p className="muted small" style={{ marginTop: 6 }}>{t('nextLevelIntro')}</p>
          </div>
          <button className="btn sm">{t('goToNextLevel')} →</button>
        </div>
        <div className="card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }} onClick={() => go({ page: 'breathe' })}>
          <div style={{ flex: 1 }}>
            <h2>{t('breathe')}</h2>
            <p className="muted small" style={{ marginTop: 6 }}>{t('breatheIntro')}</p>
          </div>
          <button className="btn sm">{t('breatheStart')} →</button>
        </div>
      </div>

      {/* Overall progress */}
      <div className="card" style={{ marginBottom: 18 }}>
        <h2 style={{ marginBottom: 16 }}>{t('overallProgress')}</h2>
        <div className="rings">
          {EMOTION_KEYS.map((k) => (
            <Ring
              key={k}
              value={masteryScore(entries[k])}
              color="#dca6d6"
              label={L(lang, EMOTION_NAMES[k])}
              sub={`${entries[k].length} ${t('entriesWord')}`}
              onClick={() => go({ page: 'module', emotion: k })}
            />
          ))}
        </div>
        <div className="grid grid-2" style={{ marginTop: 18 }}>
          <div className="quote">
            {t('mostImproved')}:{' '}
            <b>{improved ? `${L(lang, EMOTION_NAMES[improved.emotion])} (${improved.change}%)` : t('notEnoughData')}</b>
          </div>
          {focus && (
            <div className="insight-tint">
              {t('focusSuggestion', L(lang, EMOTION_NAMES[focus]).toLowerCase())}
            </div>
          )}
        </div>
      </div>

      {/* Weekly summary */}
      <div className="card" style={{ marginBottom: 18 }}>
        <h2 style={{ marginBottom: 4 }}>{t('weeklySummary')}</h2>
        <p className="muted small" style={{ marginBottom: 12 }}>{t('practicesPerEmotion')}</p>
        <React.Suspense fallback={<div style={{ height: 220 }} />}>
          <WeeklyBars data={weeklyData} />
        </React.Suspense>
        <div className="grid grid-2" style={{ marginTop: 10 }}>
          <div className="quote">
            {weekly[weeklyTop] > 0 ? t('trendText', L(lang, EMOTION_NAMES[weeklyTop]).toLowerCase()) : t('trendNone')}
          </div>
          <div className="quote" style={{ borderColor: '#f5b301' }}>
            {t('nextMilestone')}: {nextBadge ? t('milestoneText', nextBadge.remaining, L(lang, nextBadge.name)) : t('allBadges')}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="card">
        <h2 style={{ marginBottom: 14 }}>{t('achievements')}</h2>
        <div className="badge-grid">
          {badges.map((b) => (
            <div key={b.id} className={`badge ${b.earned ? 'earned' : ''}`}>
              <div className="bmark">{b.earned ? '★' : '✧'}</div>
              <div className="bname">{L(lang, b.name)}</div>
              <div className="bdesc">{L(lang, b.desc)}</div>
              <div className="bstate">{b.earned ? `✓ ${t('earned')}` : t('notYet', b.remaining)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Ring({ value, color, label, sub, onClick }) {
  const R = 52
  const C = 2 * Math.PI * R
  return (
    <div className="ring-item" style={{ cursor: 'pointer' }} onClick={onClick}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(128, 140, 135, 0.25)" strokeWidth="11" />
        <circle
          cx="65" cy="65" r={R} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - value / 100)}
          transform="rotate(-90 65 65)" style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x="65" y="74" textAnchor="middle" fontSize="28" fontWeight="300" fill="#141414">{value}</text>
      </svg>
      <div className="lbl">{label}</div>
      <div className="val">{sub}</div>
    </div>
  )
}
