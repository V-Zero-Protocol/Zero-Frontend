'use client'

import { useState } from 'react'
import {
  Key,
  Landmark,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  Clock,
  ExternalLink,
  Download,
} from 'lucide-react'
import {
  contributorLogs,
  formatCurrency,
  type ContributorLog,
} from '@/lib/data'

export function ContributorDashboard() {
  const [registered, setRegistered] = useState(false)
  const [generating, setGenerating] = useState(false)

  function handleRegister() {
    setGenerating(true)
    window.setTimeout(() => {
      setGenerating(false)
      setRegistered(true)
    }, 1400)
  }

  if (!registered) {
    return <OnboardingState generating={generating} onRegister={handleRegister} />
  }

  return <ActiveDashboard />
}

/* ---------------------------------------------------------------------- */
/* State A — onboarding                                                    */
/* ---------------------------------------------------------------------- */
function OnboardingState({
  generating,
  onRegister,
}: {
  generating: boolean
  onRegister: () => void
}) {
  return (
    <div className="center-stage">
      <div className="surface-card activate-card">
        <span className="activate-emblem" aria-hidden="true">
          <Key size={32} />
        </span>
        <h1>Activate Your Compliance Layer</h1>
        <p>
          A deterministic wallet signature is required to compute your private
          viewing key (<code>Ivsk</code>). This key lets you decrypt and
          construct local financial logs securely — it never leaves your device.
        </p>
        <button
          type="button"
          className="press-scale"
          disabled={generating}
          onClick={generating ? undefined : onRegister}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 28px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--md-sys-color-primary)',
            color: 'var(--md-sys-color-on-primary)',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 600,
            cursor: generating ? 'not-allowed' : 'pointer',
            opacity: generating ? 0.75 : 1,
            minWidth: 280,
            justifyContent: 'center',
          }}
        >
          {generating ? (
            <>
              <InlineSpinner />
              Awaiting signature…
            </>
          ) : (
            <>
              <Key size={18} />
              Generate and Register Viewing Key
            </>
          )}
        </button>
        <p className="muted" style={{ margin: 0, fontSize: '0.8125rem' }}>
          Signature requested via connected Stellar wallet · No funds are moved
        </p>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* State B — active dashboard + decrypted ledger                           */
/* ---------------------------------------------------------------------- */
function ActiveDashboard() {
  const [decrypt, setDecrypt] = useState(true)

  const totalShielded = contributorLogs.reduce((sum, l) => sum + l.amount, 0)

  return (
    <>
      <div className="page-head">
        <div className="page-head-text">
          <h1>Contributor Dashboard</h1>
          <p>
            Your shielded earnings and decrypted transaction history on the
            V-Zero confidential payroll ledger.
          </p>
        </div>
        <div className="head-actions">
          <button
            type="button"
            className="press-scale"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              borderRadius: 8,
              border: '1px solid var(--md-sys-color-outline)',
              background: 'transparent',
              color: 'var(--md-sys-color-on-surface)',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'background-color 150ms ease',
            }}
          >
            <Download size={16} />
            Export statement
          </button>
        </div>
      </div>

      <section className="metric-grid" aria-label="Account summary">
        <div className="surface-card metric-card">
          <div className="metric-top">
            <span className="section-label" style={{ fontSize: '0.8125rem' }}>
              Total Shielded Earnings
            </span>
            <span className="metric-icon" aria-hidden="true">
              <Landmark size={20} />
            </span>
          </div>
          <span className="metric-value num" style={{ fontSize: '1.5rem' }}>
            {formatCurrency(totalShielded)}
          </span>
          <span className="metric-foot positive">
            <TrendingUp size={16} />
            +18.2% vs. previous quarter
          </span>
        </div>

        <div className="surface-card metric-card">
          <div className="metric-top">
            <span className="section-label" style={{ fontSize: '0.8125rem' }}>
              Total Received Claims
            </span>
            <span className="metric-icon" aria-hidden="true">
              <ReceiptText size={20} />
            </span>
          </div>
          <span className="metric-value num" style={{ fontSize: '1.5rem' }}>
            {contributorLogs.length}
          </span>
          <span className="metric-foot">
            <Clock size={16} />
            Last claim 5 days ago
          </span>
        </div>

        <div className="surface-card metric-card">
          <div className="metric-top">
            <span className="section-label" style={{ fontSize: '0.8125rem' }}>
              Identity Verification
            </span>
            <span className="metric-icon" aria-hidden="true">
              <ShieldCheck size={20} />
            </span>
          </div>
          <span className="metric-value" style={{ fontSize: '1.1rem' }}>
            <span className="status-pill positive">
              <ShieldCheck size={15} />
              Verified
            </span>
          </span>
          <span className="metric-foot">
            <Key size={16} />
            Viewing key registered
          </span>
        </div>
      </section>

      <section className="surface-card" aria-label="Transaction log">
        <div className="card-header">
          <div>
            <h2>Decrypted Ledger</h2>
            <p className="card-header-sub">
              Confidential payroll entries resolved with your local viewing key.
            </p>
          </div>
          <label
            className="decrypt-toggle"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <span className="label-stack">
              Local Decryption Mode
              <small style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {decrypt ? 'Plaintext visible on this device' : 'Fields masked'}
              </small>
            </span>
            {/* Toggle switch */}
            <button
              type="button"
              role="switch"
              aria-checked={decrypt}
              aria-label="Toggle local decryption mode"
              onClick={() => setDecrypt((v) => !v)}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                width: 44,
                height: 24,
                borderRadius: 9999,
                border: 'none',
                background: decrypt
                  ? 'var(--md-sys-color-primary)'
                  : 'var(--md-sys-color-surface-container-high)',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
                transition: 'background-color 200ms ease',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: decrypt ? 'calc(100% - 22px)' : 2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: decrypt
                    ? 'var(--md-sys-color-on-primary)'
                    : 'var(--md-sys-color-on-surface-variant)',
                  transition: 'left 200ms ease',
                }}
              />
            </button>
          </label>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Transaction Hash</th>
                <th scope="col">Amount</th>
                <th scope="col">Asset</th>
                <th scope="col">Milestone</th>
                <th scope="col">Corporate Memo</th>
              </tr>
            </thead>
            <tbody>
              {contributorLogs.map((log) => (
                <LogRow key={log.id} log={log} decrypt={decrypt} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function LogRow({ log, decrypt }: { log: ContributorLog; decrypt: boolean }) {
  return (
    <tr>
      <td className="num">{log.date}</td>
      <td>
        <a
          className="tx-hash"
          href="#"
          onClick={(e) => e.preventDefault()}
          aria-label={`Transaction ${log.txHash}`}
        >
          {log.txHash.slice(0, 6)}…{log.txHash.slice(-4)}
          <ExternalLink size={14} />
        </a>
      </td>
      <td className="num masked-cell">
        <Masked decrypt={decrypt} reveal={formatCurrency(log.amount)} />
      </td>
      <td>
        <span className="asset-tag">{log.asset}</span>
      </td>
      <td className="num">{log.milestone}</td>
      <td className="masked-cell">
        <Masked decrypt={decrypt} reveal={log.memo} />
      </td>
    </tr>
  )
}

function Masked({ decrypt, reveal }: { decrypt: boolean; reveal: string }) {
  return decrypt ? (
    <span className="reveal">{reveal}</span>
  ) : (
    <span className="mask mask-dots" aria-label="Encrypted value">
      ••••••••
    </span>
  )
}

function InlineSpinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="28 14"
        strokeLinecap="round"
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  )
}
