'use client'

import { Shield } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { WALLET_PUBLIC_KEY, truncateKey, type ViewKey } from '@/lib/data'

export function TopHeader({
  view,
  onRoleChange,
}: {
  view: ViewKey
  onRoleChange: (v: ViewKey) => void
}) {
  return (
    <header className="topbar">
      {/* Brand — only shown on compact (sidebar hidden) */}
      <div className="topbar-brand">
        <span
          className="sidebar-glyph"
          aria-hidden="true"
          style={{ display: 'grid', placeItems: 'center' }}
        >
          <Shield size={18} />
        </span>
        <span className="topbar-title">V-Zero Protocol</span>
      </div>

      <div className="topbar-spacer" />

      <div className="topbar-actions">
        <span className="wallet-badge" title={WALLET_PUBLIC_KEY}>
          <span className="dot" aria-hidden="true" />
          <span className="wallet-badge-label">Wallet</span>
          <code>{truncateKey(WALLET_PUBLIC_KEY)}</code>
        </span>

        <select
          className="role-switcher"
          aria-label="Active role"
          value={view}
          onChange={(e) => onRoleChange(e.target.value as ViewKey)}
          style={{
            padding: '8px 12px',
            borderRadius: 10,
            border: '1px solid var(--md-sys-color-outline)',
            background: 'var(--md-sys-color-surface)',
            color: 'var(--md-sys-color-on-surface)',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          <option value="contributor">Contributor</option>
          <option value="payroll">Payroll Manager</option>
          <option value="auditor">Auditor</option>
        </select>

        <ThemeToggle />
      </div>
    </header>
  )
}
