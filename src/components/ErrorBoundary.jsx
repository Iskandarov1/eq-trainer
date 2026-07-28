import React from 'react'
import { L, UI } from '../content.js'
import { loadData } from '../store.js'

// Class component — the only way to catch render errors without extra dependencies
export default class ErrorBoundary extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (!this.state.error) return this.props.children
    const lang = loadData().lang // loadData never throws
    return (
      <div className="card" style={{ margin: 40, textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 44 }}>😵</div>
        <h2 style={{ margin: '10px 0 16px' }}>{L(lang, UI.errorTitle)}</h2>
        <button className="btn brand" onClick={() => location.reload()}>{L(lang, UI.errorReload)}</button>
      </div>
    )
  }
}
