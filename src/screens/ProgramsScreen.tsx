import { useEffect, useState } from 'react'
import {
  ArrowLeft, ExternalLink, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, AlertCircle, HelpCircle,
  FileText, ListChecks, Milestone, Loader2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { Program, EligibilityStatus } from '../types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

interface ProgramsScreenProps {
  category: string
  naturalQuery?: string   // from the search bar on CategoriesScreen
  onBack: () => void
}

const STATUS_CONFIG: Record<EligibilityStatus, { label: string; color: string; icon: React.ReactNode }> = {
  eligible:      { label: 'Eligible',       color: 'bg-green-50 text-green-700 border-green-200',  icon: <CheckCircle2 size={14} /> },
  possibly:      { label: 'Possibly',       color: 'bg-amber-50 text-amber-700 border-amber-200',  icon: <HelpCircle size={14} /> },
  missing:       { label: 'Missing Info',   color: 'bg-blue-50 text-blue-700 border-blue-200',     icon: <AlertCircle size={14} /> },
  'not-eligible':{ label: 'Not Eligible',   color: 'bg-red-50 text-red-700 border-red-200',        icon: <XCircle size={14} /> },
}

function StatusBadge({ status }: { status: EligibilityStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  )
}

function ProgramCard({ program }: { program: Program }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
      program.status === 'eligible' ? 'border-green-200' :
      program.status === 'possibly' ? 'border-amber-200' :
      program.status === 'missing'  ? 'border-blue-200' : 'border-slate-200'
    }`}>
      {/* Card Header */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <StatusBadge status={program.status} />
              <span className="text-xs text-slate-400 font-medium">{program.agency}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">{program.name}</h3>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{program.description}</p>
          </div>
        </div>

        {/* Benefits preview */}
        {program.benefits && (
          <div className="mt-4 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Benefits</div>
            <p className="text-sm text-slate-700 leading-relaxed">{program.benefits}</p>
          </div>
        )}

        {/* Criteria Met/Missing */}
        {(program.criteriasMet?.length > 0 || program.criteriasMissing?.length > 0) && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {program.criteriasMet?.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1.5">Criteria Met</div>
                <ul className="space-y-1">
                  {program.criteriasMet.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {program.criteriasMissing?.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1.5">Missing Info</div>
                <ul className="space-y-1">
                  {program.criteriasMissing.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <AlertCircle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#0342EE] hover:text-blue-800 transition-colors"
        >
          {expanded ? <><ChevronUp size={14} /> Hide details</> : <><ChevronDown size={14} /> View requirements & steps</>}
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-slate-100 px-5 sm:px-6 py-5 space-y-5 bg-slate-50/50">
          {program.requirements?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                <ListChecks size={16} className="text-[#0342EE]" /> Requirements
              </div>
              <ul className="space-y-1.5">
                {program.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0342EE] text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">{i + 1}</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {program.documents?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                <FileText size={16} className="text-violet-600" /> Required Documents
              </div>
              <ul className="space-y-1.5">
                {program.documents.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {program.process?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                <Milestone size={16} className="text-amber-600" /> Application Steps
              </div>
              <ol className="space-y-2">
                {program.process.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {program.url && (
            <a href={program.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0342EE] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
              <ExternalLink size={15} /> Apply on Official Website
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export function ProgramsScreen({ category, naturalQuery, onBack }: ProgramsScreenProps) {
  const { profile, user } = useAuth()
  const [programs, setPrograms]   = useState<Program[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [filter, setFilter]       = useState<EligibilityStatus | 'all'>('all')

  useEffect(() => {
    async function fetchPrograms() {
      setLoading(true)
      setError(null)
      try {
        const ai = profile.additional_information ?? {}
        const res = await fetch(`${API_URL}/api/programs/match`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category,
            natural_query: naturalQuery ?? null,
            user_context: {
              user_id:      user?.id,
              uniqid:       profile.uniqid,
              email:        user?.email,
              birth_date:   profile.birth_date,
              gender:       profile.gender,
              civil_status: ai.other_personal_information?.marital_status,
              region:       profile.region,
              province:     profile.province,
              municipality: profile.municipality,
              occupation:   ai.occupation?.occupation,
              industry:     ai.industry?.industry,
              salary_range: ai.expected_salary?.expected_salary,
              education:    ai.educational_attainment?.map(e => `${e.level} in ${e.educational_background}`).join('; '),
              nationality:  profile.nationality,
            },
          }),
        })

        if (!res.ok) throw new Error(`Server responded with ${res.status}`)
        const json = await res.json()
        setPrograms(json.data ?? [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load programs')
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [category, naturalQuery])

  const filtered = filter === 'all' ? programs : programs.filter(p => p.status === filter)
  const counts = {
    all:           programs.length,
    eligible:      programs.filter(p => p.status === 'eligible').length,
    possibly:      programs.filter(p => p.status === 'possibly').length,
    missing:       programs.filter(p => p.status === 'missing').length,
    'not-eligible':programs.filter(p => p.status === 'not-eligible').length,
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Categories
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 capitalize tracking-tight">
            {naturalQuery ? `"${naturalQuery}"` : `${category} Programs`}
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            Matched to your verified eGovPH profile
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={32} className="text-[#0342EE] animate-spin" />
            <p className="text-slate-500 text-sm">Matching programs to your profile…</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-sm text-red-600 underline">Try again</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
              {(['all', 'eligible', 'possibly', 'missing', 'not-eligible'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    filter === f
                      ? 'bg-[#0342EE] text-white border-[#0342EE]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-[#0342EE] hover:text-[#0342EE]'
                  }`}>
                  {f === 'all' ? 'All' : STATUS_CONFIG[f].label} ({counts[f]})
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <p className="font-medium">No programs found for this filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(p => <ProgramCard key={p.id} program={p} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
