import React, { useState } from 'react'
import { L, UI } from '../content.js'
import { signIn, signUp } from '../api.js'

/* First-run gate when Supabase is configured and nobody has signed in on this
   device yet. Runs OUTSIDE the app context (there is no user yet), so language
   is local state remembered per device. */
export default function AuthScreen({ onAuthed }) {
  const [lang, setLang] = useState(() => {
    const l = localStorage.getItem('eqAuthLang')
    return l === 'ru' || l === 'uz' || l === 'en' ? l : 'en'
  })
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const t = (k, ...args) => {
    const v = L(lang, UI[k])
    return typeof v === 'function' ? v(...args) : v
  }
  const pickLang = (l) => {
    setLang(l)
    try { localStorage.setItem('eqAuthLang', l) } catch { /* fine */ }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setError(null)
    if (mode === 'signup' && password.length < 8) { setError(t('authErrWeak')); return }
    setBusy(true)
    try {
      const u = mode === 'signin' ? await signIn(email.trim(), password) : await signUp(email.trim(), password)
      onAuthed({ ...u, offline: false })
    } catch (err) {
      const msg = String(err?.message || err)
      if (/invalid login credentials/i.test(msg)) setError(t('authErrInvalid'))
      else if (/already registered/i.test(msg)) setError(t('authErrExists'))
      else if (/password/i.test(msg)) setError(t('authErrWeak'))
      else if (/fetch|network|failed/i.test(msg)) setError(t('authErrNetwork'))
      else setError(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="lang" style={{ justifyContent: 'center', marginBottom: 18 }}>
          {['en', 'ru', 'uz'].map((l) => (
            <button key={l} className={lang === l ? 'active' : ''} onClick={() => pickLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
        <div className="logo-mark" style={{ margin: '0 auto 10px' }}>EQ</div>
        <h1 className="serif" style={{ textAlign: 'center' }}>{t('appName')}</h1>
        <p className="muted small" style={{ textAlign: 'center', margin: '6px 0 4px' }}>
          {mode === 'signin' ? t('authSignInHint') : t('authSignUpHint')}
        </p>
        {mode === 'signup' && (
          <div className="auth-intro">
            <h2 style={{ marginBottom: 6 }}>{t('authIntroTitle')}</h2>
            <p className="muted small">{t('authIntroWhat')}</p>
            <p className="muted small">{t('authIntroTime')}</p>
            <p className="muted small">{t('authIntroPrivate')}</p>
          </div>
        )}
        <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
          <div>
            <label className="field-label" htmlFor="auth-email">{t('authEmail')}</label>
            <input id="auth-email" type="email" required autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="auth-pass">{t('authPassword')}</label>
            <input id="auth-pass" type="password" required minLength={8}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? '…' : mode === 'signin' ? t('authSignIn') : t('authSignUp')}
          </button>
        </form>
        <button className="linklike" style={{ margin: '14px auto 0', display: 'block' }}
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null) }}>
          {mode === 'signin' ? t('authToSignUp') : t('authToSignIn')}
        </button>
        <p className="small muted" style={{ textAlign: 'center', marginTop: 16 }}>{t('authForgot')}</p>
      </div>
    </div>
  )
}
