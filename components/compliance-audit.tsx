'use client'

import { useRef, useState } from 'react'
import {
  Lock,
  LockOpen,
  Key,
  Upload,
  Eye,
  CheckCircle,
  Flag,
  Clock,
  Table2,
  FileText,
} from 'lucide-react'
import { auditRecords, formatCurrency, type AuditRecord } from '@/lib/data'
import { ComplianceLineChart, SpendBarChart } from './charts'

type Range = '30d' | '90d' | '1y'

export function ComplianceAudit() {
  const [authed, setAuthed] = useState(false)

  if (!authed) return <VaultAccess onUnlock={() => setAuthed(true)} />
  return <MasterLog />
}

/* ---------------------------------------------------------------------- */
/* Secure vault access                                                     */
/* ---------------------------------------------------------------------- */
function VaultAccess({ onUnlock }: { onUnlock: () => void }) {
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="center-stage">
      <div className="surface-card vault-card">
        <div className="vault-head">
          <span className="activate-emblem" aria-hidden="true">
            <Lock size={24} />
          </span>
          <div>
            <h1>Secure Vault Access</h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Authenticate with an organizational viewing key to reconstruct the
              financial master log.
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onUnlock()
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {/* Key input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label
              style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--md-sys-color-on-surface-variant)',
              }}
            >
              Organizational Viewing Key
              <input
                type="password"
                placeholder="orgvk_..."
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: 6,
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--md-sys-color-outline)',
                  background: 'var(--md-sys-color-surface)',
                  color: 'var(--md-sys-color-on-surface)',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </label>
            <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Held by authorized compliance officers only
            </span>
          </div>

          <div className="vault-divider" style={{ fontSize: '0.8125rem' }}>OR</div>

          {/* Credential dropzone */}
          <div
            className="dropzone"
            role="button"
            tabIndex={0}
            aria-label="Upload cryptographic credential file"
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
            }}
          >
            <Upload size={32} strokeWidth={1.5} />
            <span>
              {fileName ? (
                <strong>{fileName}</strong>
              ) : (
                <>
                  <strong>Upload cryptographic credential</strong> (.pem / .key)
                </>
              )}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept=".pem,.key,.json"
              hidden
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="press-scale"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 24px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--md-sys-color-primary)',
                color: 'var(--md-sys-color-on-primary)',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <LockOpen size={16} />
              Unlock Master Log
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* Reconstructed financial master log                                      */
/* ---------------------------------------------------------------------- */
function MasterLog() {
  const [range, setRange] = useState<Range>('90d')

  const totalSpend = auditRecords.reduce((s, r) => s + r.amount, 0)

  return (
    <>
      <div className="page-head">
        <div className="page-head-text">
          <h1>Compliance Audit</h1>
          <p>
            Reconstructed clear-text corporate parameters aligned against
            obscured on-chain transaction commitments.
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
            <Table2 size={16} />
            Export Audit Package (CSV)
          </button>
          <button
            type="button"
            className="press-scale"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 150ms ease',
            }}
          >
            <FileText size={16} />
            Download Signed Report (PDF)
          </button>
        </div>
      </div>

      <section className="chart-grid" aria-label="Audit analytics">
        <div className="surface-card chart-box">
          <div className="toolbar" style={{ marginBottom: 8 }}>
            <div>
              <h2 style={{ margin: 0 }}>Total Organization Spend</h2>
              <p className="muted" style={{ margin: '2px 0 0', fontSize: '0.875rem' }}>
                {formatCurrency(totalSpend)} reconciled across {auditRecords.length}{' '}
                commitments
              </p>
            </div>
            <RangeTabs range={range} onChange={setRange} />
          </div>
          <SpendBarChart />
          <div className="chart-legend" style={{ fontSize: '0.8125rem' }}>
            <span className="item">
              <span
                className="swatch"
                style={{ background: 'var(--md-sys-color-primary)' }}
              />
              USDC spend (000s)
            </span>
            <span className="item">
              <span
                className="swatch"
                style={{ background: 'var(--md-sys-color-secondary)' }}
              />
              XLM spend (000s)
            </span>
          </div>
        </div>

        <div className="surface-card chart-box">
          <h2 style={{ margin: 0 }}>Compliance Health</h2>
          <p className="muted" style={{ margin: '2px 0 14px', fontSize: '0.875rem' }}>
            Audit integrity index
          </p>
          <ComplianceLineChart />
          <div className="chart-legend" style={{ fontSize: '0.8125rem' }}>
            <span className="item">
              <span
                className="swatch"
                style={{ background: 'var(--md-sys-color-primary)' }}
              />
              Index score (target ≥ 90)
            </span>
          </div>
        </div>
      </section>

      <section className="surface-card" aria-label="Master transaction log">
        <div className="card-header">
          <div>
            <h2>Financial Master Log</h2>
            <p className="card-header-sub" style={{ fontSize: '0.875rem' }}>
              Clear-text parameters reconciled against on-chain commitments.
            </p>
          </div>
          <span className="status-pill info">
            <Eye size={15} />
            Auditor view
          </span>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Recipient</th>
                <th scope="col">On-chain Commitment</th>
                <th scope="col">Amount</th>
                <th scope="col">Asset</th>
                <th scope="col">Department</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {auditRecords.map((r) => (
                <AuditRow key={r.id} record={r} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function RangeTabs({
  range,
  onChange,
}: {
  range: Range
  onChange: (r: Range) => void
}) {
  const opts: { key: Range; label: string }[] = [
    { key: '30d', label: '30 days' },
    { key: '90d', label: '90 days' },
    { key: '1y', label: '1 year' },
  ]
  return (
    <div className="range-tabs" role="group" aria-label="Time range">
      {opts.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={range === o.key}
          onClick={() => onChange(o.key)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function AuditRow({ record }: { record: AuditRecord }) {
  const statusClass =
    record.status === 'Reconciled'
      ? 'positive'
      : record.status === 'Flagged'
        ? 'warning'
        : 'neutral'

  const StatusIcon =
    record.status === 'Reconciled'
      ? CheckCircle
      : record.status === 'Flagged'
        ? Flag
        : Clock

  return (
    <tr>
      <td className="num">{record.date}</td>
      <td className="num">{record.recipient}</td>
      <td>
        <span className="tx-hash">{record.commitment}</span>
      </td>
      <td className="num">{formatCurrency(record.amount)}</td>
      <td>
        <span className="asset-tag">{record.asset}</span>
      </td>
      <td>{record.department}</td>
      <td>
        <span className={`status-pill ${statusClass}`}>
          <StatusIcon size={15} />
          {record.status}
        </span>
      </td>
    </tr>
  )
}
