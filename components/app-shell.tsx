'use client'

import { useState } from 'react'
import type { ViewKey } from '@/lib/data'
import { Sidebar } from './sidebar'
import { TopHeader } from './top-header'
import { ContributorDashboard } from './contributor-dashboard'
import { PayrollWorkspace } from './payroll-workspace'
import { ComplianceAudit } from './compliance-audit'

export function AppShell() {
  const [view, setView] = useState<ViewKey>('contributor')

  return (
    <div className="app-shell">
      <Sidebar view={view} onNavigate={setView} />
      <div className="main-col">
        <TopHeader view={view} onRoleChange={setView} />
        <main className="content">
          {view === 'contributor' && <ContributorDashboard />}
          {view === 'payroll' && <PayrollWorkspace />}
          {view === 'auditor' && <ComplianceAudit />}
        </main>
      </div>
    </div>
  )
}
