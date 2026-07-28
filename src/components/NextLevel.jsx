import React, { useContext } from 'react'
import { AppCtx } from '../App.jsx'
import { L, MODULES, EMOTION_NAMES } from '../content.js'
import { masteryScore } from '../store.js'

export default function NextLevel() {
  const { data, lang, t, go } = useContext(AppCtx)
  return (
    <div>
      <div className="hero" style={{ background: 'radial-gradient(600px 300px at 90% -20%, rgba(255,255,255,.15), transparent 60%), linear-gradient(125deg, #343a8f, #7048e8 55%, #c2255c)' }}>
        <h1>⚡ {t('nextLevel')}</h1>
        <div className="q">{t('nextLevelIntro')}</div>
        <div className="q" style={{ marginTop: 8 }}>{t('nlQuote')}</div>
      </div>
      <div className="grid grid-3">
        {Object.entries(MODULES).map(([key, m]) => {
          const entries = data.entries[key]
          const score = masteryScore(entries)
          return (
            <div
              key={key}
              className="card"
              style={{ cursor: 'pointer', '--accent': m.color, borderTop: `4px solid ${m.color}` }}
              onClick={() => go({ page: 'module', emotion: key })}
            >
              <div style={{ fontSize: 36 }}>{m.emoji}</div>
              <h2 style={{ margin: '8px 0 2px' }}>{L(lang, EMOTION_NAMES[key])}</h2>
              <div className="muted" style={{ fontWeight: 600, fontSize: 14 }}>{L(lang, m.subtitle)}</div>
              <p className="small muted" style={{ margin: '10px 0 14px' }}>{L(lang, m.explanation).split('.')[0]}.</p>
              <div className="meter"><div style={{ width: `${score}%` }} /></div>
              <div className="small muted" style={{ marginTop: 6 }}>
                {t('masteryScore')}: <b style={{ color: m.color }}>{score}/100</b> · {entries.length} {t('entriesWord')}
              </div>
            </div>
          )
        })}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h2>💪 {t('finalTipsTitle')}</h2>
        <div className="grid grid-3" style={{ marginTop: 14 }}>
          {[
            ['🧭', 'tipCheckin', 'tipCheckinDesc'],
            ['🧘', 'tipMeditate', 'tipMeditateDesc'],
            ['🎭', 'tipRehearse', 'tipRehearseDesc'],
          ].map(([emoji, title, desc]) => (
            <div key={title} className="pstep">
              <div style={{ fontSize: 28 }}>{emoji}</div>
              <h3 style={{ margin: '8px 0 6px' }}>{t(title)}</h3>
              <p className="muted small">{t(desc)}</p>
            </div>
          ))}
        </div>
        <div className="quote" style={{ marginTop: 16 }}>📌 {t('wavesQuote')}</div>
      </div>
    </div>
  )
}
