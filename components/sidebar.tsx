'use client'

import { Wallet, CreditCard, ShieldCheck } from 'lucide-react'
import { VZeroShield } from './vzero-shield'
import type { ViewKey } from '@/lib/data'

const NAV: { key: ViewKey; label: string; icon: React.ReactNode }[] = [
  { key: 'contributor', label: 'Contributor Dashboard', icon: <Wallet size={20} /> },
  { key: 'payroll', label: 'Payroll Workspace', icon: <CreditCard size={20} /> },
  { key: 'auditor', label: 'Compliance Audit', icon: <ShieldCheck size={20} /> },
]

export function Sidebar({
  view,
  onNavigate,
}: {
  view: ViewKey
  onNavigate: (v: ViewKey) => void
}) {
  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="sidebar-brand">
        <span
          className="sidebar-glyph"
          aria-hidden="true"
          style={{ display: 'grid', placeItems: 'center' }}
        >
          <VZeroShield size={22} />
        </span>
        <span className="sidebar-brand-text">
          <strong>V-Zero Protocol</strong>
          <span>Confidential Payroll</span>
        </span>
      </div>

      <p className="sidebar-section-label">Workspace</p>

      <nav aria-label="Sections">
        {NAV.map((item) => (
          <button
            key={item.key}
            type="button"
            className="nav-item"
            aria-current={view === item.key}
            onClick={() => onNavigate(item.key)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-row">
          <ShieldCheck
            size={18}
            style={{ color: 'var(--vz-positive)', flexShrink: 0 }}
          />
          Network secure
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '0.8rem' }}>
          Stellar mainnet · Orchestrator v3.2 · End-to-end shielded
        </p>
      </div>
    </aside>
  )
}
