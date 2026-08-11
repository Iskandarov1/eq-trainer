import React, { useContext } from 'react'
import { AppCtx } from '../App.jsx'

/* Plain-language privacy note. Reachable in local mode too — a visitor must be
   able to read it before deciding to create an account. */
export default function Privacy() {
  const { t } = useContext(AppCtx)
  const sections = [
    ['privacyWhat', 'privacyWhatBody'],
    ['privacyWho', 'privacyWhoBody'],
    ['privacyWhere', 'privacyWhereBody'],
    ['privacyDelete', 'privacyDeleteBody'],
  ]
  return (
    <div>
      <div className="hero"><h1>{t('privacyTitle')}</h1><div className="q">{t('privacyIntro')}</div></div>
      <div className="card">
        {sections.map(([head, body]) => (
          <div key={head} style={{ marginBottom: 18 }}>
            <h3 style={{ marginBottom: 6 }}>{t(head)}</h3>
            <p className="muted">{t(body)}</p>
          </div>
        ))}
        <p className="small muted" style={{ marginTop: 20 }}>{t('privacyContact')}</p>
      </div>
    </div>
  )
}
