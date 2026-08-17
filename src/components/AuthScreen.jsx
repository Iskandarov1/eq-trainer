import React, { useState } from 'react'
import { L, UI } from '../content.js'
import { signIn, signUp, resendConfirmation, requestPasswordReset, verifySignupCode, verifyRecoveryCode } from '../api.js'

/* First-run gate when Supabase is configured and nobody has signed in on this
   device yet. Runs OUTSIDE the app context (there is no user yet), so language
   is local state remembered per device. */
/* The confirmation and recovery emails both end with "Alternatively, enter the
   code: 123456". Without this the app made that sentence a lie, and the code is
   the only route that works when the link opens in a different browser than the
   one the user started in. */
function CodeForm({ t, code, setCode, busy, error, onSubmit }) {
  return (
    <form
      className="grid" style={{ gap: 10, marginTop: 16, textAlign: 'left' }}
      onSubmit={(e) => { e.preventDefault(); if (!busy && code.trim()) onSubmit() }}
    >
      <div>
        <label className="field-label" htmlFor="auth-code">{t('authCodeLabel')}</label>
        <input id="auth-code" type="text" inputMode="numeric" autoComplete="one-time-code"
          pattern="[0-9]*" maxLength={8} value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
      </div>
      {error && <div className="auth-error">{error}</div>}
      <button className="btn" type="submit" disabled={busy || !code.trim()}>
        {busy ? '…' : t('authCodeConfirm')}
      </button>
    </form>
  )
}

export default function AuthScreen({ onAuthed, onRecovery, initial }) {
  const [lang, setLang] = useState(() => {
    const l = localStorage.getItem('eqAuthLang')
    return l === 'ru' || l === 'uz' || l === 'en' ? l : 'en'
  })
  // `initial` seeds the starting screen; used by the dev-only ?auth= preview so
  // every state can be reviewed before the backend exists.
  const [mode, setMode] = useState(
    initial === 'signup' ? 'signup' : initial === 'reset' ? 'reset' : 'signin') // 'signin' | 'signup' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(initial === 'pending' ? 'you@example.com' : null) // email awaiting confirmation
  const [resent, setResent] = useState(false)
  const [resetSent, setResetSent] = useState(null)
  const [code, setCode] = useState('')
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
      if (u.pending) setPending(u.email)
      else onAuthed({ ...u, offline: false })
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

  if (mode === 'reset') {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="logo-mark" style={{ margin: '0 auto 10px' }}>EQ</div>
          <h1 className="serif" style={{ textAlign: 'center' }}>{t('authResetTitle')}</h1>
          {resetSent ? (
            <>
              <p className="muted" style={{ textAlign: 'center', margin: '12px 0' }}>{t('authResetSent', resetSent)}</p>
              <CodeForm
                t={t} code={code} setCode={setCode} busy={busy} error={error}
                onSubmit={async () => {
                  setBusy(true); setError(null)
                  try { await verifyRecoveryCode(resetSent, code); onRecovery?.() }
                  catch { setError(t('authErrCode')) } finally { setBusy(false) }
                }}
              />
            </>
          ) : (
            <>
              <p className="muted small" style={{ textAlign: 'center', margin: '8px 0 14px' }}>{t('authResetBody')}</p>
              <form className="grid" style={{ gap: 12 }} onSubmit={async (e) => {
                e.preventDefault()
                if (busy) return
                setBusy(true)
                try { await requestPasswordReset(email.trim()); setResetSent(email.trim()) } catch { setError(t('authErrNetwork')) } finally { setBusy(false) }
              }}>
                <div>
                  <label className="field-label" htmlFor="reset-email">{t('authEmail')}</label>
                  <input id="reset-email" type="email" required autoComplete="email"
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                {error && <div className="auth-error">{error}</div>}
                <button className="btn" type="submit" disabled={busy}>{busy ? '…' : t('authResetSend')}</button>
              </form>
            </>
          )}
          <button className="linklike" style={{ margin: '14px auto 0', display: 'block' }}
            onClick={() => { setMode('signin'); setResetSent(null); setError(null) }}>
            {t('authBackToSignIn')}
          </button>
        </div>
      </div>
    )
  }

  if (pending) {
    return (
      <div className="auth-screen">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="logo-mark" style={{ margin: '0 auto 10px' }}>EQ</div>
          <h1 className="serif">{t('authCheckTitle')}</h1>
          <p className="muted" style={{ margin: '10px 0' }}>{t('authCheckBody', pending)}</p>
          <p className="small muted">{t('authCheckSpam')}</p>
          <CodeForm
            t={t} code={code} setCode={setCode} busy={busy} error={error}
            onSubmit={async () => {
              setBusy(true); setError(null)
              try {
                const u = await verifySignupCode(pending, code)
                onAuthed({ ...u, offline: false })
              } catch { setError(t('authErrCode')) } finally { setBusy(false) }
            }}
          />
          <button className="btn ghost sm" style={{ marginTop: 14 }} disabled={resent}
            onClick={async () => {
              try { await resendConfirmation(pending); setResent(true) } catch { /* rate-limited: the first mail is still on its way */ }
            }}>
            {resent ? t('authResent') : t('authResend')}
          </button>
          <button className="linklike" style={{ margin: '14px auto 0', display: 'block' }}
            onClick={() => { setPending(null); setMode('signin'); setResent(false) }}>
            {t('authBackToSignIn')}
          </button>
        </div>
      </div>
    )
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
        {mode === 'signin' && (
          <button className="linklike" style={{ margin: '10px auto 0', display: 'block' }}
            onClick={() => { setMode('reset'); setError(null) }}>
            {t('authForgot')}
          </button>
        )}
      </div>
    </div>
  )
}
