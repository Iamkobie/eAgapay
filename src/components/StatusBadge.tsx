import { CheckCircle2, HelpCircle, FileText, X } from 'lucide-react'
import type { EligibilityStatus } from '../types'

export function StatusBadge({ status }: { status: EligibilityStatus }) {
  const cfg = {
    eligible:      { bg: '#dcfce7', text: '#15803d', border: '#86efac', label: 'Eligible', icon: CheckCircle2 },
    possibly:      { bg: '#fef9c3', text: '#92400e', border: '#fde68a', label: 'Possibly Eligible', icon: HelpCircle },
    missing:       { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', label: 'Missing Info', icon: FileText },
    'not-eligible':{ bg: '#fef2f2', text: '#991b1b', border: '#fca5a5', label: 'Not Eligible', icon: X },
  }[status]

  const Icon = cfg.icon

  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border shadow-sm"
      style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
    >
      <Icon size={12} />
      {cfg.label}
    </span>
  )
}
