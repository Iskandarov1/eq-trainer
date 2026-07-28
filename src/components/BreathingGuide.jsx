import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppCtx } from '../App.jsx'

const PHASES = [
  { key: 'inhale', secs: 4 },
  { key: 'hold', secs: 7 },
  { key: 'exhale', secs: 8 },
]

export default function BreathingGuide() {
  const { t } = useContext(AppCtx)
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState(0)
  const [cycles, setCycles] = useState(0)
  const timer = useRef(null)

  useEffect(() => {
    if (!running) { clearTimeout(timer.current); return }
    timer.current = setTimeout(() => {
      setPhase((p) => {
        const next = (p + 1) % PHASES.length
        if (next === 0) setCycles((c) => c + 1)
        return next
      })
    }, PHASES[phase].secs * 1000)
    return () => clearTimeout(timer.current)
  }, [running, phase])

  // full-screen player: Escape exits
  useEffect(() => {
    if (!running) return
    const onKey = (e) => { if (e.key === 'Escape') { setRunning(false); setPhase(0) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [running])

  const label = running ? t(PHASES[phase].key) : '4 · 7 · 8'

  return (
    <div className={`breath-wrap ${running ? 'playing' : ''}`}>
      <div className="field-label" style={{ alignSelf: 'flex-start' }}>{t('breathe')}</div>
      <div className={`breath-circle ${running ? PHASES[phase].key : ''}`}>{label}</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          type="button"
          className={`btn sm ${running ? 'ghost' : ''}`}
          style={running ? {} : { background: 'var(--accent)' }}
          onClick={() => { setRunning(!running); if (running) setPhase(0) }}
        >
          {running ? `■ ${t('breatheStop')}` : `▶ ${t('breatheStart')}`}
        </button>
        {cycles > 0 && <span className="small muted">{cycles} {t('cycles')}</span>}
      </div>
    </div>
  )
}
