import React, { useContext } from 'react'
import { AppCtx } from '../App.jsx'
import { L, MODULES, EMOTION_NAMES } from '../content.js'
import { masteryScore } from '../store.js'

export default function NextLevel() {
  const { data, lang, t, go } = useContext(AppCtx)
  return (
    <div>
      <div className="hero">
        <h1>{t('nextLevel')}</h1>
        <div className="q">{t('nextLevelIntro')}</div>
        <div className="q" style={{ marginTop: 8 }}>{t('nlQuote')}</div>
      </div>
      <div className="grid grid-2">
        {Object.entries(MODULES).map(([key, m]) => {
          const entries = data.entries[key]
          const score = masteryScore(entries)
          return (
            <div
              key={key}
              className="card"
              style={{ cursor: 'pointer', background: m.color, color: '#fff' }}
              onClick={() => go({ page: 'module', emotion: key })}
            >
              <div className="caps" style={{ color: 'rgba(255,255,255,0.6)' }}>{L(lang, m.subtitle)}</div>
              <h2 style={{ margin: '8px 0 2px', color: '#fff', fontSize: 24 }}>{L(lang, EMOTION_NAMES[key])}</h2>
              <p className="small" style={{ margin: '10px 0 14px', color: 'rgba(255,255,255,0.78)' }}>{L(lang, m.explanation).split('.')[0]}.</p>
              <div className="meter" style={{ background: 'rgba(255,255,255,0.25)' }}><div style={{ width: `${score}%`, background: '#fff' }} /></div>
              <div className="small" style={{ marginTop: 6, color: 'rgba(255,255,255,0.8)' }}>
                {t('masteryScore')}: <b>{score}/100</b> · {entries.length} {t('entriesWord')}
              </div>
            </div>
          )
        })}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h2>{t('finalTipsTitle')}</h2>
        <div className="grid grid-3" style={{ marginTop: 14 }}>
          {[
            ['tipCheckin', 'tipCheckinDesc'],
            ['tipMeditate', 'tipMeditateDesc'],
            ['tipRehearse', 'tipRehearseDesc'],
          ].map(([title, desc], i) => (
            <div key={title} className="pstep">
              <div className="caps">{`0${i + 1}`}</div>
              <h3 style={{ margin: '8px 0 6px' }}>{t(title)}</h3>
              <p className="muted small">{t(desc)}</p>
            </div>
          ))}
        </div>
        <div className="quote" style={{ marginTop: 16 }}>{t('wavesQuote')}</div>
      </div>
    </div>
  )
}
