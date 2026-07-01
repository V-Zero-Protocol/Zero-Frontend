# Requirements Document

## Introduction

V-Zero Protocol is an enterprise-grade B2B SaaS dashboard for auditing and compliance on the Stellar blockchain network. It provides a confidential on-chain payroll shell where contributors can view their shielded earnings, payroll managers can execute private payouts with zero-knowledge proofs, and compliance auditors can reconstruct financial master logs. The application must meet the visual and interaction standard of mature corporate platforms (Gusto, Deel, Stripe) — clean monochrome Slate/Zinc palette, Lucide React icons, custom shadcn/Radix-style primitives, and professional micro-animations throughout.

---

## Glossary

- **Dashboard**: The V-Zero Protocol Next.js web application.
- **AppShell**: The top-level layout component wrapping the fixed sidebar, global header, and routed content area.
- **Sidebar**: The fixed left navigation panel containing page links and system status indicators.
- **TopHeader**: The sticky global header displaying branding, wallet status, and the role switcher.
- **ViewKey**: The active role discriminant — one of `contributor`, `payroll`, or `auditor`.
- **ContributorDashboard**: The page rendered when `ViewKey === 'contributor'`.
- **PayrollWorkspace**: The page rendered when `ViewKey === 'payroll'`.
- **ComplianceAudit**: The page rendered when `ViewKey === 'auditor'`.
- **Ivsk**: The contributor's private incoming viewing secret key, derived deterministically from a wallet signature.
- **Ivpk**: A contributor's public incoming viewing key, stored in the on-chain registry.
- **AES-256-GCM**: The symmetric encryption cipher used to seal corporate memo metadata.
- **ZK Proof**: A Nethermind SPP zero-knowledge proof attesting transfer validity without disclosure.
- **DecryptToggle**: The switch component in the contributor ledger that toggles plaintext visibility.
- **PipelineModal**: The multi-step progress modal shown during payroll execution.
- **VaultAccess**: The authentication screen guarding the auditor's reconstructed financial log.
- **Stellar**: The blockchain network on which all shielded payroll transactions are settled.
- **USDC**: USD Coin stablecoin asset traded on the Stellar network.
- **XLM**: Stellar Lumens, the native Stellar asset.
- **Lucide**: The icon library (`lucide-react`) used for all semantic UI icons.
- **SlateZinc_Palette**: The monochrome Slate/Zinc CSS design token system used throughout.
- **Dropzone**: The drag-and-drop file upload component used in batch payroll upload and vault credential upload.

---

## Requirements

### Requirement 1: Design System and Visual Language

**User Story:** As a product owner, I want the Dashboard to render with an enterprise-grade, monochrome Slate/Zinc visual language, so that it matches the professionalism of Gusto, Deel, and Stripe and builds trust with enterprise clients.

#### Acceptance Criteria

1. THE Dashboard SHALL apply a SlateZinc_Palette CSS token system providing distinct light and dark color schemes, with deep slate (`#0f172a`) on-surface text, bright white (`#ffffff`) surface backgrounds in light mode, and deep slate-navy (`#0f1623`) surfaces in dark mode.
2. THE Dashboard SHALL use a clean system sans-serif font stack (`Inter`, `system-ui`, `-apple-system`, `sans-serif`) as the primary typeface, replacing all Material Web Roboto tokens.
3. THE Dashboard SHALL use Lucide React for all semantic icon anchors (Shield, Key, Eye, EyeOff, FileText, ArrowRight, and equivalents), with no custom SVG illustrations.
4. WHEN a primary action button is hovered, THE Dashboard SHALL apply a smooth CSS `transform: scale(1.01)` transition over 150ms.
5. WHEN a primary action button is pressed (`:active`), THE Dashboard SHALL apply `transform: scale(0.98)` to provide tactile feedback.
6. THE Dashboard SHALL remove all `@material/web` component dependencies (`md-filled-button`, `md-icon`, `md-tabs`, `md-switch`, etc.) and replace them with custom React component primitives styled with plain CSS or CSS Modules.
7. THE Dashboard SHALL maintain a consistent 16px border-radius for cards, 8px for input fields, and `9999px` (pill shape) for badges and toggles.

---

### Requirement 2: Application Shell Layout

**User Story:** As an enterprise user, I want a stable, fixed-sidebar shell with a persistent global header, so that navigation and context information are always visible regardless of the current page.

#### Acceptance Criteria

1. THE AppShell SHALL render a fixed-width left Sidebar (264px on expanded viewports ≥ 840px) that persists across all three views.
2. THE Sidebar SHALL display the V-Zero Protocol wordmark with a Shield icon glyph in a colored tile, followed by three navigation links: "Contributor Dashboard", "Payroll Workspace", and "Compliance Audit".
3. WHEN a Sidebar navigation link is active, THE Sidebar SHALL apply a highlighted background (`primary-container` tone) and bold font weight to that link.
4. THE Sidebar SHALL display a footer status block showing "Stellar mainnet · Orchestrator v3.2 · End-to-end shielded" with a green dot indicator.
5. THE TopHeader SHALL be sticky at the top of the main content column and SHALL display: the "V-Zero Protocol" wordmark (hidden on expanded viewports where the Sidebar already shows it), a wallet connection status badge showing a truncated Stellar public key (`GDU3...8ZK9`) with a live green dot, a role switcher `<select>` dropdown, and a light/dark theme toggle.
6. WHEN the role switcher value changes to `contributor`, `payroll`, or `auditor`, THE AppShell SHALL render the corresponding page view without a full page navigation.
7. THE AppShell SHALL be responsive: on compact viewports (< 840px) the Sidebar SHALL be hidden and replaced by the TopHeader branding glyph.

---

### Requirement 3: Contributor Dashboard — Onboarding State

**User Story:** As a new contributor, I want a clear onboarding screen that explains what a viewing key is and lets me register one, so that I can access my shielded earnings securely.

#### Acceptance Criteria

1. WHEN the ContributorDashboard renders and no viewing key is registered, THE ContributorDashboard SHALL display a centered onboarding card with the heading "Activate Your Compliance Layer".
2. THE onboarding card SHALL contain a description stating that a deterministic wallet signature is required to compute the private viewing key (`Ivsk`) and that the key never leaves the user's device.
3. THE onboarding card SHALL contain a primary call-to-action button labeled "Generate and Register Viewing Key" with a Key icon.
4. WHEN the "Generate and Register Viewing Key" button is clicked, THE ContributorDashboard SHALL display a loading spinner inside the button and change its label to "Awaiting signature…" for a minimum of 1400ms.
5. WHEN the key generation simulation completes, THE ContributorDashboard SHALL transition to the Active Dashboard state.
6. THE onboarding card SHALL display a supporting caption: "Signature requested via connected Stellar wallet · No funds are moved".

---

### Requirement 4: Contributor Dashboard — Active Dashboard State

**User Story:** As a contributor with a registered viewing key, I want to see my shielded earnings metrics and a decrypted transaction ledger, so that I can track and verify my compensation history.

#### Acceptance Criteria

1. WHEN the ContributorDashboard is in the active state, THE ContributorDashboard SHALL display a row of three metric cards: "Total Shielded Earnings" (sum of all payout amounts formatted as USD currency), "Total Received Claims" (count of log entries), and "Identity Verification Status" (showing a "Verified" badge with a green checkmark).
2. THE metric cards SHALL be isolated by individual borders with consistent padding and SHALL NOT share a container background.
3. THE ContributorDashboard SHALL display a data table labeled "Decrypted Ledger" with columns: Date, Transaction Hash (truncated, clickable link), Amount, Asset, Milestone, and Corporate Memo.
4. THE Decrypted Ledger table SHALL include a DecryptToggle switch labeled "Local Decryption Mode" in the card header.
5. WHEN DecryptToggle is ON, THE ContributorDashboard SHALL render all Amount and Corporate Memo fields as their plaintext values using an opacity fade-in transition (200ms ease).
6. WHEN DecryptToggle is OFF, THE ContributorDashboard SHALL render all Amount and Corporate Memo fields as masked dot strings ("••••••••") using an opacity fade-out transition (200ms ease).
7. THE Transaction Hash column SHALL display the first 6 and last 4 characters of the hash, separated by an ellipsis, with an external-link icon.

---

### Requirement 5: Payroll Manager Workspace — Execution Forms

**User Story:** As a payroll manager, I want a structured workspace with a single-payout form and a batch-upload dropzone, so that I can efficiently initiate confidential payroll transactions.

#### Acceptance Criteria

1. THE PayrollWorkspace SHALL display a tabbed container with two tabs: "Single Payout" and "Batch Upload", with tab icons (UserIcon and UploadIcon respectively).
2. THE "Single Payout" tab SHALL contain a form with the following labeled fields: Recipient Stellar Address (text input), Asset Type (select: USDC / XLM), Amount (numeric input with "$" prefix), Associated Milestone ID (text input), and Private Corporate Memo (textarea).
3. THE Single Payout form SHALL include supporting hint text on the Recipient field ("Public key registered in the V-Zero viewing-key registry") and on the Corporate Memo field ("Encrypted with AES-256-GCM before submission — never written in clear text on-chain").
4. THE "Batch Upload" tab SHALL contain a Dropzone component with a dashed border, upload icon, and instructional text listing the expected CSV columns (recipient_address, asset, amount, milestone_id, memo).
5. WHEN a file is dragged over the Dropzone, THE Dropzone SHALL highlight its border and background using the `primary-container` token color.
6. WHEN a file is accepted by the Dropzone, THE PayrollWorkspace SHALL display a file chip showing the file name and size with a remove button.
7. WHEN the "Execute Confidential Payout" button (Single Payout) or "Execute Batch" button (Batch Upload) is clicked, THE PayrollWorkspace SHALL open the PipelineModal.

---

### Requirement 6: Payroll Manager Workspace — Execution Pipeline Modal

**User Story:** As a payroll manager, I want to see a real-time progress view of the cryptographic pipeline steps when I execute a payout, so that I understand exactly what is happening and can trust the process.

#### Acceptance Criteria

1. THE PipelineModal SHALL display exactly four sequential pipeline steps in order: (1) "Fetching recipient public viewing keys (Ivpk) from Registry…", (2) "Encrypting business metadata via AES-256-GCM…", (3) "Generating Nethermind SPP Zero-Knowledge proofs…", (4) "Awaiting V-Zero Orchestrator ledger atomicity…".
2. WHEN the PipelineModal opens, steps 1 and 2 SHALL render in a "Completed" state (green checkmark indicator) and step 3 SHALL render in an "Active/Processing" state (animated spinner indicator).
3. WHEN the PipelineModal has been open for 1800ms, step 3 SHALL transition to "Completed" and step 4 SHALL transition to "Active/Processing".
4. WHEN the PipelineModal has been open for 3600ms, step 4 SHALL transition to "Completed" and the modal SHALL display a "Payout settled" headline.
5. THE PipelineModal SHALL display a summary section showing Recipient (truncated address), Proof system ("Nethermind SPP"), and Settlement status ("In progress" or "Confirmed").
6. WHEN the pipeline is complete, THE PipelineModal SHALL display a "View receipt" primary action button alongside the "Close" text button.
7. THE PipelineModal SHALL be dismissible at any time via a "Run in background" text button while the pipeline is in progress.

---

### Requirement 7: Compliance Audit — Vault Access Screen

**User Story:** As a compliance auditor, I want a secure authentication screen before accessing the financial master log, so that only authorized personnel can reconstruct clear-text corporate data.

#### Acceptance Criteria

1. WHEN the ComplianceAudit view renders and the auditor is not authenticated, THE ComplianceAudit SHALL display a centered vault access card with the heading "Secure Vault Access" and a Lock icon.
2. THE vault access card SHALL contain a password input field labeled "Organizational Viewing Key" with placeholder `orgvk_...` and supporting text "Held by authorized compliance officers only".
3. THE vault access card SHALL contain a Dropzone for uploading a cryptographic credential file, accepting `.pem`, `.key`, and `.json` formats, labeled "Upload cryptographic credential (.pem / .key)".
4. WHEN a credential file is selected, THE vault access card SHALL display the selected filename in the Dropzone area.
5. WHEN the "Unlock Master Log" form is submitted (with either a key string or file), THE ComplianceAudit SHALL transition to the Reconstructed Financial Master Log view.
6. THE vault access card SHALL present the key input and file upload as two distinct options separated by an "OR" divider.

---

### Requirement 8: Compliance Audit — Reconstructed Financial Master Log

**User Story:** As an authenticated compliance auditor, I want to see charts and a data table of all organizational financial activity aligned against on-chain commitments, so that I can perform a comprehensive audit.

#### Acceptance Criteria

1. THE ComplianceAudit master log view SHALL display two analytics charts: a stacked bar chart titled "Total Organization Spend" and a line chart titled "Compliance Health" with an "Audit integrity index" subtitle.
2. THE charts SHALL include time range selector tabs with options "30 days", "90 days", and "1 year".
3. THE ComplianceAudit master log view SHALL display a data table titled "Financial Master Log" with columns: Date, Recipient (truncated Stellar address), On-chain Commitment (truncated hash), Amount (USD formatted), Asset, Department, and Status.
4. THE Status column SHALL render a color-coded badge: green pill for "Reconciled", amber pill for "Flagged", and neutral pill for "Pending".
5. THE ComplianceAudit master log view SHALL display an "Export Audit Package (CSV)" outlined button and a "Download Signed Report (PDF)" filled button in the page header actions area.
6. WHEN either export button is hovered, THE button SHALL apply a smooth background highlight transition (150ms ease) indicating interactivity.
7. THE ComplianceAudit view SHALL display a header sub-line: "Reconstructed clear-text corporate parameters aligned against obscured on-chain transaction commitments."

---

### Requirement 9: Theme and Accessibility

**User Story:** As an enterprise user, I want the dashboard to support both light and dark themes and to be accessible, so that it works in varied professional environments and meets corporate accessibility requirements.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a theme toggle button in the TopHeader that switches between light and dark modes by toggling a `.dark` class on the `<html>` element.
2. WHEN the `.dark` class is applied, THE Dashboard SHALL apply the dark SlateZinc_Palette token set (deep navy surfaces, light slate text).
3. THE Dashboard SHALL persist the selected theme to `localStorage` and restore it on next page load without a flash of unstyled content.
4. THE Dashboard SHALL use semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`, `<table>`, `<thead>`, `<tbody>`) throughout.
5. ALL interactive elements (buttons, links, toggles, dropzones) SHALL have `aria-label` or visible label text and SHALL be keyboard-focusable and operable via Enter or Space.
6. THE data tables SHALL include `<thead>` with `<th scope="col">` headers for all columns.
7. THE DecryptToggle switch SHALL have an `aria-label` of "Toggle local decryption mode".

---

### Requirement 10: Data Layer and Mock Data

**User Story:** As a developer, I want all UI states to be driven by a typed data layer with realistic mock records, so that the application demonstrates its full feature set without requiring a live Stellar connection.

#### Acceptance Criteria

1. THE data module (`lib/data.ts`) SHALL export typed `ContributorLog`, `AuditRecord`, and `PipelineStep` arrays with at minimum 5 contributor log entries and 6 audit records.
2. THE `ContributorLog` type SHALL include fields: `id`, `date`, `txHash`, `amount`, `asset` (`USDC` | `XLM`), `milestone`, and `memo`.
3. THE `AuditRecord` type SHALL include fields: `id`, `date`, `recipient`, `commitment`, `amount`, `asset`, `department`, and `status` (`Reconciled` | `Pending` | `Flagged`).
4. THE data module SHALL export a `WALLET_PUBLIC_KEY` constant and a `truncateKey(key: string)` utility that returns the first 4 and last 4 characters separated by "...".
5. THE data module SHALL export `spendSeries` and `complianceSeries` arrays for chart rendering.
6. THE data module SHALL export a `formatCurrency(n: number)` function returning a US locale currency string.
