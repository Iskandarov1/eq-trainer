import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppCtx } from '../App.jsx'

// calm478: the fear-protocol breath (PDF-prescribed). three: "3 deep breaths"
// for the Pause Power / 30-Second Rule — in 4, out 6, three cycles, ~30s.
const PATTERNS = {
  calm478: [{ key: 'inhale', secs: 4 }, { key: 'hold', secs: 7 }, { key: 'exhale', secs: 8 }],
  three: [{ key: 'inhale', secs: 4 }, { key: 'exhale', secs: 6 }],
}

export default function BreathingGuide({ pattern = 'calm478', target = null }) {
  const { t } = useContext(AppCtx)
  const phases = PATTERNS[pattern] || PATTERNS.calm478
  const targetCycles = target ?? (pattern === 'three' ? 3 : null)
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState(0)
  const [count, setCount] = useState(phases[0].secs)
  const [cycles, setCycles] = useState(0)
  const timer = useRef(null)

  // per-second countdown (no setState inside another updater — see advance effect)
  useEffect(() => {
    if (!running) { clearInterval(timer.current); return }
    timer.current = setInterval(() => setCount((c) => c - 1), 1000)
    return () => clearInterval(timer.current)
  }, [running])

  // when the countdown reaches 0, advance to the next phase for its full duration
  useEffect(() => {
    if (!running || count > 0) return
    const next = (phase + 1) % phases.length
    if (next === 0) setCycles((n) => n + 1)
    setPhase(next)
    setCount(phases[next].secs)
  }, [count, running, phase, phases])

  // fixed-length sessions (e.g. "3 deep breaths") finish on their own
  useEffect(() => {
    if (running && targetCycles && cycles >= targetCycles) { setRunning(false); setPhase(0) }
  }, [running, cycles, targetCycles])

  useEffect(() => {
    if (!running) return
    const onKey = (e) => { if (e.key === 'Escape') stop() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [running])

  const start = () => { setPhase(0); setCount(phases[0].secs); setCycles(0); setRunning(true) }
  const stop = () => { setRunning(false); setPhase(0) }

  const phaseKey = phases[phase].key
  const caption = pattern === 'three' ? t('threeBreaths') : t('breathe')
  const idleLabel = pattern === 'three' ? '3 × 4 · 6' : '4 · 7 · 8'

  if (!running) {
    return (
      <div className="breath-wrap">
        <div className="field-label" style={{ alignSelf: 'flex-start' }}>{caption}</div>
        <div className="breath-circle">{idleLabel}</div>
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
      <div className={`breath-circle ${phaseKey}`} style={{ transitionDuration: `${phases[phase].secs}s` }}>
        <span className="breath-count">{Math.max(count, 1)}</span>
      </div>
      <div className="breath-cycles small">
        {cycles}{targetCycles ? ` / ${targetCycles}` : ''} {t('cycles')}
      </div>
      <button type="button" className="btn sm" onClick={stop}>{t('breatheStop')}</button>
    </div>
  )
}
