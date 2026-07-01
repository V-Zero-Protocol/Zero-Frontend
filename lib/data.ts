export type ViewKey = 'contributor' | 'payroll' | 'auditor'

export const WALLET_PUBLIC_KEY = 'GDU3MZ4K7QXP2VHW9N6RTLF8YB5C1A0SD4EJ9ZK9'

export function truncateKey(key: string): string {
  if (key.length <= 9) return key
  return `${key.slice(0, 4)}...${key.slice(-4)}`
}

export type ContributorLog = {
  id: string
  date: string
  txHash: string
  amount: number
  asset: 'USDC' | 'XLM'
  milestone: string
  memo: string
}

export const contributorLogs: ContributorLog[] = [
  {
    id: '1',
    date: '2026-06-24',
    txHash: 'a3f9c7e21b8d4e6f',
    amount: 8400.0,
    asset: 'USDC',
    milestone: 'M-2026-Q2-07',
    memo: 'Protocol v3 settlement layer — milestone bonus',
  },
  {
    id: '2',
    date: '2026-06-10',
    txHash: 'd1e4b8a90c2f7351',
    amount: 6200.0,
    asset: 'USDC',
    milestone: 'M-2026-Q2-06',
    memo: 'Bi-weekly base compensation',
  },
  {
    id: '3',
    date: '2026-05-27',
    txHash: '7b2c9f01a4e8d6b3',
    amount: 14500.0,
    asset: 'XLM',
    milestone: 'M-2026-Q2-05',
    memo: 'Zero-knowledge circuit audit deliverable',
  },
  {
    id: '4',
    date: '2026-05-13',
    txHash: 'f0a6d3c81b975e24',
    amount: 6200.0,
    asset: 'USDC',
    milestone: 'M-2026-Q2-04',
    memo: 'Bi-weekly base compensation',
  },
  {
    id: '5',
    date: '2026-04-29',
    txHash: 'c8e1b47a20f6d935',
    amount: 3100.0,
    asset: 'USDC',
    milestone: 'M-2026-Q2-03',
    memo: 'On-call infrastructure stipend',
  },
]

export type AuditRecord = {
  id: string
  date: string
  recipient: string
  commitment: string
  amount: number
  asset: 'USDC' | 'XLM'
  department: string
  status: 'Reconciled' | 'Pending' | 'Flagged'
}

export const auditRecords: AuditRecord[] = [
  {
    id: 'r1',
    date: '2026-06-24',
    recipient: 'GDU3...8ZK9',
    commitment: '0x9f3a...c7e2',
    amount: 8400,
    asset: 'USDC',
    department: 'Cryptography',
    status: 'Reconciled',
  },
  {
    id: 'r2',
    date: '2026-06-24',
    recipient: 'GBLM...4QX1',
    commitment: '0x21b8...4e6f',
    amount: 9200,
    asset: 'USDC',
    department: 'Engineering',
    status: 'Reconciled',
  },
  {
    id: 'r3',
    date: '2026-06-23',
    recipient: 'GCWP...7NJ2',
    commitment: '0xd1e4...7351',
    amount: 5400,
    asset: 'XLM',
    department: 'Operations',
    status: 'Pending',
  },
  {
    id: 'r4',
    date: '2026-06-22',
    recipient: 'GAEX...9ZK0',
    commitment: '0x7b2c...d6b3',
    amount: 12750,
    asset: 'USDC',
    department: 'Security',
    status: 'Reconciled',
  },
  {
    id: 'r5',
    date: '2026-06-21',
    recipient: 'GHFT...2VQ8',
    commitment: '0xf0a6...5e24',
    amount: 4100,
    asset: 'XLM',
    department: 'Design',
    status: 'Flagged',
  },
  {
    id: 'r6',
    date: '2026-06-20',
    recipient: 'GMNB...6RT3',
    commitment: '0xc8e1...d935',
    amount: 7300,
    asset: 'USDC',
    department: 'Engineering',
    status: 'Reconciled',
  },
]

export type PipelineStatus = 'done' | 'active' | 'pending'

export type PipelineStep = {
  title: string
  meta: string
}

export const executionSteps: PipelineStep[] = [
  {
    title: 'Fetching recipient public viewing keys (Ivpk)',
    meta: 'Resolved from on-chain registry',
  },
  {
    title: 'Encrypting business metadata via AES-256-GCM',
    meta: 'Memo and milestone reference sealed',
  },
  {
    title: 'Generating Nethermind SPP zero-knowledge proofs',
    meta: 'Proving transfer validity without disclosure',
  },
  {
    title: 'Awaiting V-Zero Orchestrator ledger atomicity',
    meta: 'Stellar settlement confirmation',
  },
]

// Monthly organization spend (USD, thousands) used by the audit charts.
export const spendSeries = [
  { label: 'Jan', usdc: 142, xlm: 38 },
  { label: 'Feb', usdc: 168, xlm: 41 },
  { label: 'Mar', usdc: 151, xlm: 52 },
  { label: 'Apr', usdc: 189, xlm: 47 },
  { label: 'May', usdc: 204, xlm: 61 },
  { label: 'Jun', usdc: 221, xlm: 58 },
]

// Compliance health index (0-100) over recent weeks.
export const complianceSeries = [
  { label: 'W1', value: 88 },
  { label: 'W2', value: 91 },
  { label: 'W3', value: 86 },
  { label: 'W4', value: 94 },
  { label: 'W5', value: 96 },
  { label: 'W6', value: 93 },
  { label: 'W7', value: 98 },
  { label: 'W8', value: 97 },
]

export function formatCurrency(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
