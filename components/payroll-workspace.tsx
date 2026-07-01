'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Upload,
  User,
  Zap,
  FileText,
  X,
  Check,
  Clock,
  ReceiptText,
} from 'lucide-react'
import { executionSteps, type PipelineStatus } from '@/lib/data'

export function PayrollWorkspace() {
  const [tab, setTab] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="page-head">
        <div className="page-head-text">
          <h1>Payroll Workspace</h1>
          <p>
            Execute confidential payouts. Recipient metadata is encrypted and
            settled atomically on the Stellar network with zero-knowledge proofs.
          </p>
        </div>
      </div>

      <section className="surface-card">
        {/* Tab bar */}
        <div
          role="tablist"
          aria-label="Payout mode"
          style={{
            display: 'flex',
            gap: 0,
            padding: '4px 8px 0',
            borderBottom: '1px solid var(--md-sys-color-outline-variant)',
          }}
        >
          {[
            { label: 'Single Payout', icon: <User size={16} /> },
            { label: 'Batch Upload', icon: <Upload size={16} /> },
          ].map((t, i) => (
            <button
              key={t.label}
              role="tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 20px',
                border: 'none',
                borderBottom: tab === i
                  ? '2px solid var(--md-sys-color-primary)'
                  : '2px solid transparent',
                background: 'transparent',
                color: tab === i
                  ? 'var(--md-sys-color-primary)'
                  : 'var(--md-sys-color-on-surface-variant)',
                fontWeight: tab === i ? 600 : 400,
                fontSize: 'inherit',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'color 150ms ease, border-color 150ms ease',
                marginBottom: -1,
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="card-pad tab-content">
          {tab === 0 ? (
            <SinglePayoutForm onExecute={() => setDialogOpen(true)} />
          ) : (
            <BatchUpload onExecute={() => setDialogOpen(true)} />
          )}
        </div>
      </section>

      <ExecutionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}

/* ---------------------------------------------------------------------- */
/* Field primitives                                                        */
/* ---------------------------------------------------------------------- */
function Field({
  label,
  supportingText,
  children,
  className,
}: {
  label: string
  supportingText?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label
        style={{
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--md-sys-color-on-surface-variant)',
        }}
      >
        {label}
        {children}
      </label>
      {supportingText && (
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--md-sys-color-on-surface-variant)',
          }}
        >
          {supportingText}
        </span>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
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
  outline: 'none',
  transition: 'border-color 150ms ease',
}

/* ---------------------------------------------------------------------- */
/* Single payout                                                           */
/* ---------------------------------------------------------------------- */
function SinglePayoutForm({ onExecute }: { onExecute: () => void }) {
  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault()
        onExecute()
      }}
    >
      <Field
        className="span-2"
        label="Recipient Stellar Address"
        supportingText="Public key registered in the V-Zero viewing-key registry"
      >
        <input
          style={inputStyle}
          placeholder="G..."
          required
          aria-label="Recipient Stellar Address"
        />
      </Field>

      <Field label="Asset Type">
        <select
          style={inputStyle}
          defaultValue="USDC"
          aria-label="Asset Type"
        >
          <option value="USDC">USDC</option>
          <option value="XLM">XLM</option>
        </select>
      </Field>

      <Field label="Amount">
        <div style={{ position: 'relative', marginTop: 6 }}>
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--md-sys-color-on-surface-variant)',
              pointerEvents: 'none',
            }}
          >
            $
          </span>
          <input
            style={{ ...inputStyle, marginTop: 0, paddingLeft: 26 }}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            required
            aria-label="Amount"
          />
        </div>
      </Field>

      <Field label="Associated Milestone ID">
        <input
          style={inputStyle}
          placeholder="M-2026-Q2-08"
          aria-label="Associated Milestone ID"
        />
      </Field>

      <Field label="Reference Tag">
        <input
          style={inputStyle}
          placeholder="Internal cost center"
          aria-label="Reference Tag"
        />
      </Field>

      <Field
        className="span-2"
        label="Private Corporate Memo"
        supportingText="Encrypted with AES-256-GCM before submission — never written in clear text on-chain"
      >
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
          rows={3}
          aria-label="Private Corporate Memo"
        />
      </Field>

      <div className="span-2 form-actions">
        <button
          type="reset"
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            color: 'var(--md-sys-color-primary)',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
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
          <Zap size={16} />
          Execute Confidential Payout
        </button>
      </div>
    </form>
  )
}

/* ---------------------------------------------------------------------- */
/* Batch upload                                                            */
/* ---------------------------------------------------------------------- */
function BatchUpload({ onExecute }: { onExecute: () => void }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<{ name: string; size: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function accept(f: File | undefined) {
    if (!f) return
    setFile({ name: f.name, size: `${(f.size / 1024).toFixed(1)} KB` })
  }

  return (
    <div>
      <div
        className={`dropzone${dragging ? ' dragging' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Drop payroll CSV file here or click to browse"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          accept(e.dataTransfer.files?.[0])
        }}
      >
        <Upload size={40} strokeWidth={1.5} />
        <span>
          <strong>Drop payroll CSV here</strong> or click to browse
        </span>
        <span style={{ fontSize: '0.8125rem' }}>
          Columns: recipient_address, asset, amount, milestone_id, memo
        </span>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={(e) => accept(e.target.files?.[0] ?? undefined)}
        />
      </div>

      {file && (
        <div className="file-chip">
          <FileText size={20} color="var(--md-sys-color-primary)" />
          <span className="file-meta">
            {file.name}
            <small>{file.size} · ready to process</small>
          </span>
          <span className="spacer" />
          <button
            type="button"
            aria-label="Remove file"
            onClick={() => setFile(null)}
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              color: 'var(--md-sys-color-on-surface-variant)',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="form-actions" style={{ marginTop: 20 }}>
        <button
          type="button"
          className="press-scale"
          disabled={!file}
          onClick={file ? onExecute : undefined}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 24px',
            borderRadius: 8,
            border: 'none',
            background: file
              ? 'var(--md-sys-color-primary)'
              : 'var(--md-sys-color-surface-container-high)',
            color: file
              ? 'var(--md-sys-color-on-primary)'
              : 'var(--md-sys-color-on-surface-variant)',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 600,
            cursor: file ? 'pointer' : 'not-allowed',
            opacity: file ? 1 : 0.6,
          }}
        >
          <Zap size={16} />
          Execute Batch
        </button>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* Multi-step execution dialog                                             */
/* ---------------------------------------------------------------------- */
function ExecutionDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = useState(2)

  // Open / close the native <dialog>
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  // Pipeline timer logic
  useEffect(() => {
    if (!open) {
      setCurrent(2)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setCurrent(3), 1800))
    timers.push(setTimeout(() => setCurrent(4), 3600))
    return () => timers.forEach(clearTimeout)
  }, [open])

  // Handle native dialog close (Esc key)
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const handler = () => onClose()
    el.addEventListener('close', handler)
    return () => el.removeEventListener('close', handler)
  }, [onClose])

  const complete = current >= executionSteps.length

  function statusFor(i: number): PipelineStatus {
    if (i < current) return 'done'
    if (i === current) return 'active'
    return 'pending'
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Payout execution pipeline"
      style={{
        border: '1px solid var(--md-sys-color-outline-variant)',
        borderRadius: 16,
        padding: 0,
        background: 'var(--md-sys-color-surface)',
        color: 'var(--md-sys-color-on-surface)',
        minWidth: 'min(480px, 92vw)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--md-sys-color-outline-variant)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
          {complete ? 'Payout settled' : 'Executing confidential payout'}
        </h2>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 24px' }}>
        <div className="pipeline">
          {executionSteps.map((step, i) => {
            const status = statusFor(i)
            return (
              <div className="pipeline-step" key={step.title}>
                <span className={`step-indicator ${status}`} aria-hidden="true">
                  {status === 'done' && <Check size={14} />}
                  {status === 'active' && <Spinner />}
                  {status === 'pending' && <Clock size={14} />}
                </span>
                <div className={`step-body ${status}`}>
                  <span className="title">
                    Step {i + 1}: {step.title}
                  </span>
                  <span className="meta">
                    {status === 'done'
                      ? 'Completed'
                      : status === 'active'
                        ? 'Processing…'
                        : step.meta}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="dialog-summary">
          <div className="row">
            <span>Recipient</span>
            <span>GBLM…4QX1</span>
          </div>
          <div className="row">
            <span>Proof system</span>
            <span>Nethermind SPP</span>
          </div>
          <div className="row">
            <span>Settlement</span>
            <span>{complete ? 'Confirmed' : 'In progress'}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 10,
          padding: '12px 24px 20px',
          borderTop: '1px solid var(--md-sys-color-outline-variant)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '9px 18px',
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            color: 'var(--md-sys-color-primary)',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          {complete ? 'Close' : 'Run in background'}
        </button>
        {complete && (
          <button
            type="button"
            className="press-scale"
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 20px',
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
            <ReceiptText size={16} />
            View receipt
          </button>
        )}
      </div>
    </dialog>
  )
}

/* ---------------------------------------------------------------------- */
/* Inline spinner (replaces md-circular-progress)                         */
/* ---------------------------------------------------------------------- */
function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-label="Processing"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="25 13"
        strokeLinecap="round"
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  )
}
