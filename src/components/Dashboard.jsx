import React, { useContext } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { AppCtx } from '../App.jsx'
import { L, MODULES, EMOTION_NAMES } from '../content.js'
import { masteryScore, earnedBadges, weeklyCounts, mostImproved, focusEmotion, journeyStats } from '../store.js'

export default function Dashboard() {
  const { data, lang, t, go } = useContext(AppCtx)
  const entries = data.entries
  const total = entries.anger.length + entries.shame.length + entries.fear.length
  const badges = earnedBadges(entries)
  const weekly = weeklyCounts(entries)
  const improved = mostImproved(entries)
  const focus = focusEmotion(entries)
  const { done, cur } = journeyStats(data.journey)
  const started = !!data.journey.startDate

  const nextBadge = badges.filter((b) => !b.earned).sort((a, b) => a.remaining - b.remaining)[0]
  const weeklyData = ['anger', 'shame', 'fear'].map((k) => ({
    name: L(lang, EMOTION_NAMES[k]),
    count: weekly[k],
    color: MODULES[k].color,
  }))
  const weeklyTop = ['anger', 'shame', 'fear'].reduce((a, b) => (weekly[b] > weekly[a] ? b : a), 'anger')

  return (
    <div>
      <div className="hero">
        <h1>{t('appName')}</h1>
        <div className="q">{t('heroQuote')}</div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 18 }}>
        {/* Journey card */}
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => go({ page: 'journey' })}>
          <h2>🌱 {t('journeyCard')}</h2>
          {started ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '12px 0 8px' }}>
                <span style={{ fontSize: 34, fontWeight: 800 }}>{Math.min(cur, 30)}</span>
                <span className="muted">/ 30 · {t('day')}</span>
              </div>
              <div className="meter"><div style={{ width: `${(done / 30) * 100}%` }} /></div>
              <div className="small muted" style={{ marginTop: 6 }}>{done} {t('daysCompleted')}</div>
            </>
          ) : (
            <p className="muted" style={{ margin: '10px 0' }}>{t('startJourneyHint')}</p>
          )}
          <button className="btn brand sm" style={{ marginTop: 12 }}>{t('goToJourney')} →</button>
        </div>

        {/* Next Level card */}
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => go({ page: 'nextlevel' })}>
          <h2>⚡ {t('nextLevelCard')}</h2>
          <p className="muted small" style={{ margin: '10px 0' }}>{t('nextLevelIntro')}</p>
          <div className="small" style={{ fontWeight: 700 }}>{t('totalPractices', total)}</div>
          <button className="btn sm" style={{ marginTop: 12, background: '#7048e8' }}>{t('goToNextLevel')} →</button>
        </div>
      </div>

      {/* Overall progress */}
      <div className="card" style={{ marginBottom: 18 }}>
        <h2 style={{ marginBottom: 16 }}>📊 {t('overallProgress')}</h2>
        <div className="rings">
          {['anger', 'shame', 'fear'].map((k) => (
            <Ring
              key={k}
              value={masteryScore(entries[k])}
              color={MODULES[k].color}
              emoji={MODULES[k].emoji}
              label={L(lang, EMOTION_NAMES[k])}
              sub={`${entries[k].length} ${t('entriesWord')}`}
              onClick={() => go({ page: 'module', emotion: k })}
            />
          ))}
        </div>
        <div className="grid grid-2" style={{ marginTop: 18 }}>
          <div className="quote">
            🏅 {t('mostImproved')}:{' '}
            <b>{improved ? `${MODULES[improved.emotion].emoji} ${L(lang, EMOTION_NAMES[improved.emotion])} (${improved.change}%)` : t('notEnoughData')}</b>
          </div>
          {focus && (
            <div className="quote" style={{ borderColor: MODULES[focus].color }}>
              🎯 {t('focusSuggestion', L(lang, EMOTION_NAMES[focus]).toLowerCase())}
            </div>
          )}
        </div>
      </div>

      {/* Weekly summary */}
      <div className="card" style={{ marginBottom: 18 }}>
        <h2 style={{ marginBottom: 4 }}>🗓️ {t('weeklySummary')}</h2>
        <p className="muted small" style={{ marginBottom: 12 }}>{t('practicesPerEmotion')}</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData} margin={{ top: 8, right: 16, bottom: 0, left: -24 }}>
            <XAxis dataKey="name" tick={{ fontSize: 13 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {weeklyData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-2" style={{ marginTop: 10 }}>
          <div className="quote">
            📈 {weekly[weeklyTop] > 0 ? t('trendText', L(lang, EMOTION_NAMES[weeklyTop]).toLowerCase()) : t('trendNone')}
          </div>
          <div className="quote" style={{ borderColor: '#f5b301' }}>
            🚀 {t('nextMilestone')}: {nextBadge ? t('milestoneText', nextBadge.remaining, L(lang, nextBadge.name)) : t('allBadges')}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="card">
        <h2 style={{ marginBottom: 14 }}>🏆 {t('achievements')}</h2>
        <div className="badge-grid">
          {badges.map((b) => (
            <div key={b.id} className={`badge ${b.earned ? 'earned' : ''}`}>
              <div className="bemoji">{b.emoji}</div>
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

function Ring({ value, color, emoji, label, sub, onClick }) {
  const R = 52
  const C = 2 * Math.PI * R
  return (
    <div className="ring-item" style={{ cursor: 'pointer' }} onClick={onClick}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={R} fill="none" stroke="#eef0f5" strokeWidth="11" />
        <circle
          cx="65" cy="65" r={R} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - value / 100)}
          transform="rotate(-90 65 65)" style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x="65" y="58" textAnchor="middle" fontSize="22">{emoji}</text>
        <text x="65" y="84" textAnchor="middle" fontSize="19" fontWeight="800" fill={color}>{value}</text>
      </svg>
      <div className="lbl">{label}</div>
      <div className="val">{sub}</div>
    </div>
  )
}
