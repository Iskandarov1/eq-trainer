import React, { useState } from 'react'
import { L, UI } from '../content.js'
import { updatePassword } from '../api.js'

/* Shown when the app is opened from a recovery link. Runs outside the app
   context (no user data loaded yet), so language is read the same way the
   auth screen reads it. */
export default function ResetPassword({ onDone }) {
  const lang = (() => {
    const l = localStorage.getItem('eqAuthLang')
    return l === 'ru' || l === 'uz' || l === 'en' ? l : 'en'
  })()
  const t = (k, ...args) => {
    const v = L(lang, UI[k])
    return typeof v === 'function' ? v(...args) : v
  }
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setError(null)
    if (password.length < 8) { setError(t('authErrWeak')); return }
    setBusy(true)
    try {
      await updatePassword(password)
      onDone()
    } catch (err) {
      setError(String(err?.message || err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="logo-mark" style={{ margin: '0 auto 10px' }}>EQ</div>
        <h1 className="serif" style={{ textAlign: 'center' }}>{t('authNewTitle')}</h1>
        <form onSubmit={submit} className="grid" style={{ gap: 12, marginTop: 16 }}>
          <div>
            <label className="field-label" htmlFor="new-pass">{t('authPassword')}</label>
            <input id="new-pass" type="password" required minLength={8} autoComplete="new-password"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="btn" type="submit" disabled={busy}>{busy ? '…' : t('authNewSave')}</button>
        </form>
      </div>
    </div>
  )
}
