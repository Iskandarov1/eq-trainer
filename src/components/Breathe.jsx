import React, { useContext } from 'react'
import { AppCtx } from '../App.jsx'
import BreathingGuide from './BreathingGuide.jsx'

// Standalone breathwork section; --accent anchors the idle circle/button to the session hue
export default function Breathe() {
  const { t } = useContext(AppCtx)
  return (
    <div style={{ '--accent': '#1f242e' }}>
      <div className="hero">
        <h1>{t('breatheNav')}</h1>
        <div className="q">{t('breatheIntro')}</div>
      </div>
      <div className="card">
        <BreathingGuide />
      </div>
    </div>
  )
}
