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
  const [count, setCount] = useState(PHASES[0].secs)
  const [cycles, setCycles] = useState(0)
  const timer = useRef(null)

  // Breathwrk-style per-second countdown; phase advances when it reaches 0
  useEffect(() => {
    if (!running) { clearInterval(timer.current); return }
    timer.current = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1
        setPhase((p) => {
          const next = (p + 1) % PHASES.length
          if (next === 0) setCycles((n) => n + 1)
          return next
        })
        return 0 // replaced by the phase-change effect below
      })
    }, 1000)
    return () => clearInterval(timer.current)
  }, [running])

  useEffect(() => { if (running) setCount(PHASES[phase].secs) }, [phase, running])

  useEffect(() => {
    if (!running) return
    const onKey = (e) => { if (e.key === 'Escape') stop() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [running])

  const start = () => { setPhase(0); setCount(PHASES[0].secs); setCycles(0); setRunning(true) }
  const stop = () => { setRunning(false); setPhase(0) }

  const phaseKey = PHASES[phase].key

  if (!running) {
    return (
      <div className="breath-wrap">
        <div className="field-label" style={{ alignSelf: 'flex-start' }}>{t('breathe')}</div>
        <div className="breath-circle">4 · 7 · 8</div>
        <button type="button" className="btn sm" style={{ background: 'var(--accent)', color: '#fff' }} onClick={start}>
          {t('breatheStart')}
        </button>
        {cycles > 0 && <span className="small muted">{cycles} {t('cycles')}</span>}
      </div>
    )
  }

  return (
    <div className={`breath-wrap playing phase-${phaseKey}`}>
      <div className="breath-phase caps">{t(phaseKey)}</div>
      <div className={`breath-circle ${phaseKey}`}>
        <span className="breath-count">{count}</span>
      </div>
      <div className="breath-cycles small">{cycles} {t('cycles')}</div>
      <button type="button" className="btn sm" onClick={stop}>{t('breatheStop')}</button>
    </div>
  )
}
