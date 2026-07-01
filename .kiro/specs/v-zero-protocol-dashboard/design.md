# Design Document

## V-Zero Protocol Dashboard

---

## Overview

V-Zero Protocol is a Next.js 16 + TypeScript B2B SaaS dashboard for auditing and compliance on the Stellar blockchain. The application gives three distinct personas — contributors, payroll managers, and compliance auditors — a professional, role-switched workspace in a single-page shell.

The central design goal is **enterprise credibility**: the UI should feel as polished as Gusto, Deel, or Stripe. That means a strict monochrome Slate/Zinc palette, no decoration for decoration's sake, tight typographic rhythm, and micro-animations only where they signal interactivity or progress.

The feature work defined in the requirements amounts to a full design-system migration and feature completion pass:

1. **Design system overhaul** — strip `@material/web` Web Components, replace with custom shadcn/Radix-style React primitives, adopt Lucide React icons, and harden the CSS token layer.
2. **AppShell refinement** — fix the sidebar, sticky header, and responsive breakpoints to spec.
3. **ContributorDashboard** — onboarding flow and active ledger with client-side decrypt toggle.
4. **PayrollWorkspace** — tabbed single/batch payout forms and the four-step execution pipeline modal.
5. **ComplianceAudit** — vault authentication screen and reconstructed financial master log with SVG charts.
6. **Theme & accessibility** — persistent dark/light toggle, semantic HTML, ARIA labels, keyboard navigation.
7. **Data layer** — typed mock records and utility functions in `lib/data.ts`.

### Research Findings

The existing codebase already ships a working Slate/Zinc token set (`globals.css`), all three page components, the SVG chart pair, and the `lib/data.ts` mock layer. The `@material/web` dependency (`md-filled-button`, `md-icon`, `md-tabs`, `md-dialog`, `md-switch`, `md-outlined-text-field`, `md-outlined-select`, etc.) is deeply embedded across every component file. The migration path is therefore a component-by-component replacement, not a structural rewrite.

**Key findings that shape the design:**

- The CSS token namespace (`--md-sys-color-*`, `--vz-*`) is already correct for the target design; the migration does not need to rename tokens, only remove the Web Component dependencies from TypeScript.
- `globals.css` imports `@material/web/typography/md-typescale-styles.css` — this import must be removed and replaced with Inter + local type-scale utilities.
- The `MaterialWebLoader` client component dynamically imports `@material/web` bundles; it is deleted entirely as part of the migration.
- `layout.tsx` currently loads Material Symbols via Google Fonts for `<md-icon>`. After migration the font link is removed; icons are served by Lucide React.
- All three page components use `aria-label` attributes on key elements but rely on `md-*` elements for focus management. Custom primitives must replicate keyboard focus.
- The `ThemeToggle`, `Sidebar`, and navigation buttons are already plain React/HTML — they are the reference pattern for what all primitives should look like after migration.

---

## Architecture

The application is a client-heavy Next.js App Router SPA. There is no server-side data fetching — all data comes from `lib/data.ts` in-memory mock arrays. The routing is virtual: `ViewKey` state inside `AppShell` determines which page component renders; the URL never changes.

```
┌─────────────────────────────────────────────────────────┐
│  Next.js App Router                                      │
│  app/page.tsx  →  <AppShell />                          │
│                                                          │
│  ┌───────────────┐  ┌───────────────────────────────┐  │
│  │   Sidebar     │  │  main content column           │  │
│  │   (fixed)     │  │  ┌─────────────────────────┐  │  │
│  │   264px       │  │  │  TopHeader (sticky)     │  │  │
│  │               │  │  └─────────────────────────┘  │  │
│  │  nav links    │  │  ┌─────────────────────────┐  │  │
│  │  status footer│  │  │  <main>                 │  │  │
│  └───────────────┘  │  │  ContributorDashboard   │  │  │
│                      │  │  PayrollWorkspace       │  │  │
│                      │  │  ComplianceAudit        │  │  │
│                      │  └─────────────────────────┘  │  │
│                      └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### State management

All state is local React `useState`. There is no global store, context provider, or server state. The three pieces of cross-component state that exist are:

| State | Owner | Consumed by |
|---|---|---|
| `view: ViewKey` | `AppShell` | `Sidebar`, `TopHeader`, page views |
| `isDark: boolean` | `ThemeToggle` | `<html>` classList, `localStorage` |
| `authed: boolean` | `ComplianceAudit` | `VaultAccess`, `MasterLog` |

### Data flow

```
lib/data.ts  (typed mock arrays + utilities)
     │
     ├── ContributorDashboard  reads contributorLogs[], formatCurrency()
     ├── PayrollWorkspace       reads executionSteps[]
     ├── ComplianceAudit        reads auditRecords[], spendSeries[], complianceSeries[]
     └── TopHeader / Sidebar    reads WALLET_PUBLIC_KEY, truncateKey()
```

---

## Components and Interfaces

### Primitive component library (`components/ui/`)

All `@material/web` Web Components are replaced by a small set of custom primitives. These are plain React components styled with plain CSS / CSS Modules and using Lucide React for icons.

#### `Button`

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'filled' | 'outlined' | 'text' | 'icon'
  loading?: boolean
  icon?: React.ReactNode   // Lucide icon element
  iconSlot?: 'leading' | 'trailing'
}
```

Replaces: `md-filled-button`, `md-outlined-button`, `md-text-button`, `md-icon-button`

CSS behaviour:
- `variant="filled"` → solid `--md-sys-color-primary` background
- `variant="outlined"` → transparent bg, `--md-sys-color-outline` border
- `variant="text"` → no bg, no border
- `variant="icon"` → 40×40 circular tap-target
- All variants: `transition: transform 150ms ease`; `:hover` → `scale(1.01)`; `:active` → `scale(0.98)`
- `loading=true` renders an inline spinner (CSS border-radius animation) and sets `disabled`

#### `Input`

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  supportingText?: string
  leadingIcon?: React.ReactNode
  error?: string
  prefix?: string
}
```

Replaces: `md-outlined-text-field`

Rendered as `<label>` wrapper + `<input>` + optional supporting text `<span>`. Border-radius: 8px.

#### `Textarea`

Same shape as `Input` but renders `<textarea>`. Replaces `md-outlined-text-field` with `type="textarea"`.

#### `Select`

```typescript
interface SelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
}
```

Replaces: `md-outlined-select` + `md-select-option`. Uses native `<select>` styled to match the input border/radius scheme.

#### `Switch`

```typescript
interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  'aria-label': string
}
```

Replaces: `md-switch`. Pill-shaped toggle (border-radius 9999px) with animated thumb. Uses `<button role="switch" aria-checked={checked}>`.

#### `Dialog`

```typescript
interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions: React.ReactNode
  'aria-label'?: string
}
```

Replaces: `md-dialog`. Rendered with HTML `<dialog>` element. Calls `showModal()` / `close()` via `useEffect` when `open` changes. Backdrop handled by `::backdrop` CSS pseudo-element.

#### `Tabs`

```typescript
interface TabsProps {
  tabs: { label: string; icon?: React.ReactNode }[]
  activeIndex: number
  onChange: (index: number) => void
}
```

Replaces: `md-tabs` + `md-primary-tab`. Renders `<div role="tablist">` with `<button role="tab" aria-selected>` children.

#### `CircularProgress`

```typescript
interface CircularProgressProps {
  'aria-label': string
  size?: number   // px, default 20
}
```

Replaces: `md-circular-progress`. Pure CSS spinning SVG circle.

---

### Page-level components

#### `AppShell`

```typescript
// State
view: ViewKey  // 'contributor' | 'payroll' | 'auditor'

// Renders
<div className="app-shell">          // CSS Grid: 264px | 1fr (≥840px)
  <Sidebar view onNavigate />
  <div className="main-col">
    <TopHeader view onRoleChange />
    <main className="content">
      {view === 'contributor' && <ContributorDashboard />}
      {view === 'payroll'     && <PayrollWorkspace />}
      {view === 'auditor'     && <ComplianceAudit />}
    </main>
  </div>
</div>
```

No changes to logic; all changes are internal to child components.

#### `Sidebar`

Navigation array:
```typescript
const NAV = [
  { key: 'contributor', label: 'Contributor Dashboard', icon: <Users /> },
  { key: 'payroll',     label: 'Payroll Workspace',     icon: <CreditCard /> },
  { key: 'auditor',     label: 'Compliance Audit',      icon: <ShieldCheck /> },
]
```

Lucide icons: `Shield` (brand glyph), `Users`, `CreditCard`, `ShieldCheck` (nav), `ShieldCheck` (footer).

Active state: `aria-current="true"` on the matching `<button>`, CSS class `.nav-item[aria-current="true"]` applies `primary-container` background and `font-weight: 600`.

Footer renders the status string and a green dot indicator using `--vz-positive`.

#### `TopHeader`

Lucide icons: `Shield` (brand glyph), `Sun` / `Moon` (theme toggle).

Role switcher uses the `Select` primitive with options `contributor | payroll | auditor`.

Wallet badge remains a `<span>` — no change needed structurally, but the `md-icon-button` for theme toggle is replaced by `Button variant="icon"`.

#### `ContributorDashboard`

Two internal states controlled by a single `registered` boolean:

- **OnboardingState** — centered card, `Button variant="filled"` with `loading` prop, `Key` icon (Lucide).
- **ActiveDashboard** — metric grid + ledger table.

The `DecryptToggle` uses the `Switch` primitive. The masked/revealed transition is a CSS opacity fade (200ms ease) on `.reveal` / `.mask` spans.

#### `PayrollWorkspace`

Tab switching: `Tabs` primitive drives display of `SinglePayoutForm` or `BatchUpload`.

`SinglePayoutForm`: form fields use `Input`, `Textarea`, `Select` primitives. Submit triggers `setDialogOpen(true)`.

`BatchUpload`: `Dropzone` sub-component handles drag-and-drop. File chip uses a `Button variant="icon"` for remove. Execute button is disabled until a file is selected.

`PipelineModal`: uses `Dialog` primitive with `<dialog>` element. Timer logic via `useEffect` (unchanged). `CircularProgress` replaces `md-circular-progress`.

#### `ComplianceAudit`

Two internal states controlled by `authed` boolean:

- **VaultAccess** — vault card with `Input type="password"`, a `Dropzone` for credential upload, and `Button variant="filled"` for submit.
- **MasterLog** — charts, `RangeTabs`, and audit data table.

`RangeTabs` is already a plain HTML `<div role="group">` + `<button>` pattern — no change needed.

`AuditRow` status badge: CSS classes `.status-pill.positive` / `.status-pill.warning` / `.status-pill.neutral` mapped from `record.status`.

#### `ThemeToggle`

Replace `md-icon-button` + `md-icon` with `Button variant="icon"` containing Lucide `Sun` / `Moon`.

---

## Data Models

All types live in `lib/data.ts`. No changes to the existing types are needed; the design confirms them as correct.

```typescript
// Role discriminant
type ViewKey = 'contributor' | 'payroll' | 'auditor'

// Contributor payroll entry
type ContributorLog = {
  id: string
  date: string          // ISO date string 'YYYY-MM-DD'
  txHash: string        // hex string, ≥ 10 chars
  amount: number        // USD numeric value
  asset: 'USDC' | 'XLM'
  milestone: string     // e.g. 'M-2026-Q2-07'
  memo: string          // plaintext description
}

// Organizational audit record
type AuditRecord = {
  id: string
  date: string
  recipient: string     // truncated Stellar address, e.g. 'GDU3...8ZK9'
  commitment: string    // truncated on-chain hash, e.g. '0x9f3a...c7e2'
  amount: number
  asset: 'USDC' | 'XLM'
  department: string
  status: 'Reconciled' | 'Pending' | 'Flagged'
}

// Execution pipeline step definition
type PipelineStep = {
  title: string   // step description shown in the modal
  meta: string    // subtitle shown in pending state
}

// Pipeline step runtime state
type PipelineStatus = 'done' | 'active' | 'pending'

// Chart series entry — monthly spend
type SpendPoint = {
  label: string   // month abbreviation
  usdc: number    // thousands USD
  xlm: number     // thousands USD-equivalent
}

// Chart series entry — compliance health
type CompliancePoint = {
  label: string   // week label
  value: number   // 0–100 index score
}
```

### Exported constants and utilities

```typescript
WALLET_PUBLIC_KEY: string
// Truncate a Stellar key to "XXXX...XXXX" format
truncateKey(key: string): string
// Format a number as "$1,234.56"
formatCurrency(n: number): string

// Mock data arrays
contributorLogs: ContributorLog[]   // ≥ 5 entries
auditRecords: AuditRecord[]         // ≥ 6 entries
executionSteps: PipelineStep[]      // exactly 4 entries
spendSeries: SpendPoint[]
complianceSeries: CompliancePoint[]
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

#### Reflection: Redundancy elimination

Before writing final properties, the following redundancies were identified and resolved:

- Requirements 4.5 and 4.6 (DecryptToggle ON/OFF) describe a single round-trip toggle behavior — combined into one property.
- Requirements 10.2 and 10.3 (ContributorLog and AuditRecord field presence) describe the same structural invariant for two types — treated as one data-integrity property.
- Requirements 2.3 and 2.6 (sidebar active state and role-switcher routing) are both "for any ViewKey" properties — kept separate because they test different components.

---

### Property 1: Sidebar active state is exclusive and correct

*For any* `ViewKey` value passed to `Sidebar` as the active `view`, exactly one navigation item should have `aria-current="true"` and it should be the item whose `key` matches the provided `view`.

**Validates: Requirements 2.3**

---

### Property 2: Role switcher always renders the matching view

*For any* `ViewKey` value, when the role switcher fires a change event with that value, the `AppShell` should render the corresponding page component (`ContributorDashboard`, `PayrollWorkspace`, or `ComplianceAudit`) and must not render the other two.

**Validates: Requirements 2.6**

---

### Property 3: Metric card aggregations are correct for any log array

*For any* non-empty array of `ContributorLog` entries rendered by `ContributorDashboard` in the active state, the "Total Shielded Earnings" metric value must equal the exact sum of all `amount` fields, and the "Total Received Claims" metric value must equal the exact length of the array.

**Validates: Requirements 4.1**

---

### Property 4: Decrypt toggle is a round-trip over all log entries

*For any* array of `ContributorLog` entries, when the `DecryptToggle` is in the ON state, every row in the ledger table must display its `amount` and `memo` fields as visible plaintext values. When the toggle transitions to OFF, every row must display those fields as the masked string `"••••••••"`. Toggling ON again must restore plaintext — the toggle is fully reversible.

**Validates: Requirements 4.5, 4.6**

---

### Property 5: Transaction hash display truncates correctly for any hash

*For any* `txHash` string of length ≥ 10, the ledger table cell must display a string that begins with the first 6 characters of the hash and ends with the last 4 characters, separated by an ellipsis (`…`).

**Validates: Requirements 4.7**

---

### Property 6: File chip displays exact filename for any uploaded file

*For any* file object with an arbitrary name and byte size, after it is accepted by the `Dropzone` in `BatchUpload`, the rendered file chip must display the exact `file.name` string and a size string derived from `(file.size / 1024).toFixed(1) + " KB"`.

**Validates: Requirements 5.6**

---

### Property 7: Vault credential filename is reflected exactly

*For any* string filename, after a file with that name is selected in the `VaultAccess` credential dropzone, the dropzone area must display that exact filename.

**Validates: Requirements 7.4**

---

### Property 8: Status badge CSS class is a total, correct mapping

*For any* `AuditRecord`, the status badge rendered in the Financial Master Log table must use CSS class `"positive"` if and only if `record.status === "Reconciled"`, `"warning"` if and only if `record.status === "Flagged"`, and `"neutral"` if and only if `record.status === "Pending"`. No status value should produce an ambiguous or missing class.

**Validates: Requirements 8.4**

---

### Property 9: Theme toggle is a round-trip over localStorage

*For any* starting theme state (light or dark), toggling the theme should write the new theme to `localStorage`, toggle the `.dark` class on `<html>`, and a subsequent simulated reload that reads `localStorage` should restore the same `.dark` class presence — the theme persists across sessions.

**Validates: Requirements 9.3**

---

### Property 10: Data table column headers always include scope="col"

*For any* rendered data table component (`ContributorDashboard` ledger or `ComplianceAudit` master log), every `<th>` element within `<thead>` must carry the attribute `scope="col"`.

**Validates: Requirements 9.6**

---

### Property 11: Data record structural integrity

*For any* record in `contributorLogs`, all required fields (`id`, `date`, `txHash`, `amount`, `asset`, `milestone`, `memo`) must be present, `amount` must be a positive number, and `asset` must be exactly `"USDC"` or `"XLM"`. *For any* record in `auditRecords`, all required fields (`id`, `date`, `recipient`, `commitment`, `amount`, `asset`, `department`, `status`) must be present, and `status` must be exactly one of `"Reconciled"`, `"Pending"`, or `"Flagged"`.

**Validates: Requirements 10.2, 10.3**

---

### Property 12: truncateKey is a correct substring projection

*For any* string `key` of length greater than 8, `truncateKey(key)` must return a string that starts with `key.slice(0, 4)`, ends with `key.slice(-4)`, and contains `"..."` as the separator between them.

**Validates: Requirements 10.4**

---

### Property 13: formatCurrency is an invertible numeric formatter

*For any* number `n` that is a non-negative value with at most 2 decimal places, parsing the output of `formatCurrency(n)` back to a number (by stripping `$` and `,` characters) must yield a value equal to `n` (within floating-point rounding to 2 decimal places).

**Validates: Requirements 10.6**

---

## Error Handling

### Component-level

| Scenario | Handling |
|---|---|
| File drop with wrong MIME type (vault credential) | `accept=".pem,.key,.json"` on `<input type="file">` prevents invalid types at the OS level; no additional error UI needed for the mock |
| Empty `ContributorLogs` array | `ActiveDashboard` renders empty `<tbody>` gracefully; metric values show `$0.00` / `0` |
| `truncateKey` called with string ≤ 8 chars | Returns the original string unchanged (guard already in existing implementation) |
| `PipelineModal` closed before pipeline completes | "Run in background" button calls `onClose`; timers are cleaned up by `useEffect` cleanup function |
| Theme `localStorage` access blocked (e.g. private browsing strict mode) | `ThemeToggle.toggle()` wraps `localStorage.setItem` in `try/catch`; failure is silent, theme works for session only |
| `Dialog` `showModal()` called when already open | Guard: only call `showModal()` if `open === true && dialog.open === false` |

### CSS / visual degradation

- If `color-mix()` is unsupported (Firefox < 113), the `backdrop-filter` glass effect degrades to a solid surface — acceptable fallback.
- If `Inter` fails to load, the font stack falls through to `system-ui` → `-apple-system` → `sans-serif`.

---

## Testing Strategy

### Test framework

The project uses Next.js 16. The standard test setup for this stack is:

- **Unit / component tests**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Property-based tests**: [fast-check](https://fast-check.io/) integrated with Vitest
- **Accessibility audits**: [jest-axe](https://github.com/nickcolley/jest-axe) (works with Vitest via `vitest-axe` or direct import)

Add to `package.json` devDependencies (exact versions):

```json
"vitest": "2.2.5",
"@vitejs/plugin-react": "4.3.4",
"@testing-library/react": "16.3.0",
"@testing-library/user-event": "14.6.1",
"@testing-library/jest-dom": "6.6.3",
"fast-check": "3.22.0",
"vitest-axe": "0.1.0",
"jsdom": "25.0.1"
```

### Dual testing approach

**Unit / example-based tests** cover:
- Rendering: assert correct headings, labels, and structural elements are present in each component state
- Interaction: simulate user events (clicks, form submits, file drops) and assert state transitions
- Timer-based behaviour: use Vitest fake timers to advance through the onboarding 1400ms delay and the pipeline 1800/3600ms steps
- Accessibility: run `axe` on each page view after render

**Property-based tests** cover the 13 correctness properties defined above. Each property test runs a minimum of **100 iterations** via `fast-check`. Each test file includes a comment tag:

```
// Feature: v-zero-protocol-dashboard, Property N: <property text>
```

### Property test implementation notes

| Property | fast-check arbitraries |
|---|---|
| P1 — Sidebar active state | `fc.constantFrom('contributor', 'payroll', 'auditor')` |
| P2 — Role switcher routing | `fc.constantFrom('contributor', 'payroll', 'auditor')` |
| P3 — Metric card aggregations | `fc.array(fc.record({ id: fc.uuid(), date: fc.constant('2026-01-01'), txHash: fc.hexaString({ minLength: 10, maxLength: 32 }), amount: fc.float({ min: 0.01, max: 100000, noNaN: true }), asset: fc.constantFrom('USDC', 'XLM'), milestone: fc.string(), memo: fc.string() }), { minLength: 1, maxLength: 20 })` |
| P4 — Decrypt toggle round-trip | Same array arbitrary as P3, run two render passes with toggle ON and OFF |
| P5 — Transaction hash truncation | `fc.hexaString({ minLength: 10, maxLength: 64 })` |
| P6 — File chip filename | `fc.record({ name: fc.string({ minLength: 1 }), size: fc.integer({ min: 1, max: 50_000_000 }) })` |
| P7 — Vault filename reflection | `fc.string({ minLength: 1 })` as filename |
| P8 — Status badge mapping | `fc.constantFrom('Reconciled', 'Pending', 'Flagged')` |
| P9 — Theme localStorage round-trip | `fc.constantFrom('light', 'dark')` |
| P10 — Table header scope | Render with full mock data arrays |
| P11 — Data record integrity | Iterate over actual exported arrays (deterministic, not random) |
| P12 — truncateKey correctness | `fc.string({ minLength: 9, maxLength: 64 })` |
| P13 — formatCurrency invertibility | `fc.float({ min: 0, max: 1_000_000, noNaN: true })` rounded to 2 decimals |

### Unit test coverage targets

| Module | Unit tests | Property tests |
|---|---|---|
| `lib/data.ts` utilities | 4 (one per exported function) | P12, P13 |
| `Sidebar` | 3 (render, active state, footer) | P1 |
| `TopHeader` | 2 (render, role change) | P2 |
| `ContributorDashboard` | 6 (onboard render, loading state, transition, metrics, table columns, decrypt toggle) | P3, P4, P5 |
| `PayrollWorkspace` | 5 (tabs, form fields, dropzone drag, file chip, modal open) | P6 |
| `ComplianceAudit` | 5 (vault render, form submit, filename display, master log render, status badges) | P7, P8 |
| `ThemeToggle` | 2 (toggle applies class, persists to localStorage) | P9 |
| Accessibility audits | 3 (one axe run per page view) | P10 |

### What is not unit-tested

- CSS micro-animations (`scale(1.01)` hover, fade transitions) — verified by visual regression or manual review
- Responsive layout breakpoints (`<840px` sidebar hidden) — verified by Playwright or manual review
- SVG chart rendering accuracy — charts are pure functions of data series; correctness is verified by the data integrity property (P11) and visual review
