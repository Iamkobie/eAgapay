import { useEffect, useState } from 'react'
import {
  ArrowLeft, ExternalLink, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, AlertCircle, HelpCircle,
  FileText, ListChecks, Milestone, Loader2, ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { Program, EligibilityStatus } from '../types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

interface ProgramsScreenProps {
  category: string
  naturalQuery?: string
  onBack: () => void
}

interface ProfilingQuestion {
  id: string
  question: string
  type: 'select' | 'radio'
  options: string[]
  needed_for: string[]
}

const STATUS_CONFIG: Record<EligibilityStatus, { label: string; color: string; icon: React.ReactNode }> = {
  eligible:       { label: 'Eligible',       color: 'bg-green-50 text-green-700 border-green-200',  icon: <CheckCircle2 size={14} /> },
  possibly:       { label: 'Possibly Eligible', color: 'bg-amber-50 text-amber-700 border-amber-200',  icon: <HelpCircle size={14} /> },
  missing:        { label: 'Missing Info',   color: 'bg-blue-50 text-blue-700 border-blue-200',     icon: <AlertCircle size={14} /> },
  'not-eligible': { label: 'Not Eligible',   color: 'bg-red-50 text-red-700 border-red-200',        icon: <XCircle size={14} /> },
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: EligibilityStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  )
}

// ─── Program Card ─────────────────────────────────────────────────────────────
function ProgramCard({ program }: { program: Program }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
      program.status === 'eligible' ? 'border-green-200' :
      program.status === 'possibly' ? 'border-amber-200' :
      program.status === 'missing'  ? 'border-blue-200' : 'border-slate-200'
    }`}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <StatusBadge status={program.status} />
              <span className="text-xs text-slate-400 font-medium">{program.agency}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">{program.name}</h3>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{program.description}</p>
            {program.criteriasMissing.length > 0 && (
              <p className="text-xs text-amber-600 mt-2 font-medium">
                ⓘ {program.criteriasMissing.length} missing requirement{program.criteriasMissing.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#0342EE] hover:text-blue-800 transition-colors"
        >
          {expanded ? <><ChevronUp size={14} /> Hide details</> : <><ChevronDown size={14} /> View details</>}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-5 sm:px-6 py-5 bg-slate-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Program info */}
            <div className="lg:col-span-2 space-y-5">
              {program.benefits && (
                <div className="bg-white rounded-xl p-4 border border-slate-100">
                  <div className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">● Benefits</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{program.benefits}</p>
                </div>
              )}

              {program.requirements.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <ListChecks size={16} className="text-[#0342EE]" /> Eligibility Requirements
                  </div>
                  <ul className="space-y-1.5">
                    {program.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-slate-400 mt-0.5">›</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {program.documents.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <FileText size={16} className="text-violet-600" /> Required Documents
                  </div>
                  <ul className="space-y-1.5">
                    {program.documents.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" /> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {program.process.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <Milestone size={16} className="text-amber-600" /> Application Process
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
            </div>

            {/* Right: Why recommended sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 mb-3">Why this was recommended</h4>
                {program.criteriasMet.length > 0 && (
                  <div className="mb-3">
                    <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-2">Criteria Met</div>
                    <ul className="space-y-1.5">
                      {program.criteriasMet.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <CheckCircle2 size={12} className="text-green-500 mt-0.5 flex-shrink-0" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {program.criteriasMissing.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">Needs Attention</div>
                    <ul className="space-y-1.5">
                      {program.criteriasMissing.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <AlertCircle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {program.url && (
                <a href={program.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#0342EE] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm w-full">
                  <ExternalLink size={15} /> Open Official Government Website
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main ProgramsScreen ──────────────────────────────────────────────────────
export function ProgramsScreen({ category, naturalQuery, onBack }: ProgramsScreenProps) {
  const { profile, user } = useAuth()

  // State machine: 'profiling' → 'loading' → 'results'
  const [phase, setPhase] = useState<'profiling' | 'loading' | 'results'>(naturalQuery ? 'loading' : 'profiling')
  const [questions, setQuestions] = useState<ProfilingQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [programs, setPrograms] = useState<Program[]>([])
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<EligibilityStatus | 'all'>('all')
  const [verifiedFields, setVerifiedFields] = useState<Record<string, unknown>>({})

  // Build user context from auth profile
  function buildUserContext() {
    const ai = profile.additional_information ?? {}
    return {
      user_id:      user?.id,
      uniqid:       profile.uniqid,
      email:        user?.email,
      birth_date:   profile.birth_date,
      gender:       profile.gender,
      nationality:  profile.nationality,
      civil_status: ai.other_personal_information?.marital_status,
      region:       profile.region,
      province:     profile.province,
      municipality: profile.municipality,
      occupation:   ai.occupation?.occupation,
      industry:     ai.industry?.industry,
      salary_range: ai.expected_salary?.expected_salary,
      education:    ai.educational_attainment?.map(e => `${e.level} in ${e.educational_background}`).join('; '),
    }
  }

  // Fetch profiling questions on mount (for category browse)
  useEffect(() => {
    if (naturalQuery) {
      // Skip profiling for natural language queries — go straight to results
      fetchPrograms({})
      return
    }

    async function fetchProfiling() {
      try {
        const res = await fetch(`${API_URL}/api/programs/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, user_context: buildUserContext() }),
        })
        const json = await res.json()
        if (json.data) {
          setQuestions(json.data.questions || [])
          setVerifiedFields(json.data.verified_fields || {})
          if (json.data.questions.length === 0) {
            // No questions needed — go straight to results
            fetchPrograms({})
          }
        }
      } catch {
        // If profiling fails, skip to results
        fetchPrograms({})
      }
    }
    fetchProfiling()
  }, [category, naturalQuery])

  async function fetchPrograms(finalAnswers: Record<string, string>) {
    setPhase('loading')
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/programs/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          natural_query: naturalQuery ?? null,
          user_context: buildUserContext(),
          answers: finalAnswers,
        }),
      })
      if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      const json = await res.json()
      setPrograms(json.data ?? [])
      setPhase('results')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load programs')
      setPhase('results')
    }
  }

  function handleAnswer(value: string) {
    const q = questions[currentQuestion]
    if (!q) return
    setAnswers(prev => ({ ...prev, [q.id]: value }))
  }

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  function handlePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  function handleFindPrograms() {
    fetchPrograms(answers)
  }

  function handleSkip() {
    fetchPrograms(answers)
  }

  // ─── Profiling Phase ──────────────────────────────────────────────────────
  if (phase === 'profiling' && questions.length > 0) {
    const q = questions[currentQuestion]
    const isLast = currentQuestion === questions.length - 1
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-slate-50/50 pb-20">
        <div className="bg-white border-b border-slate-200 pt-8 pb-6 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors">
              <ArrowLeft size={16} /> Back to Categories
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0342EE]/10 text-[#0342EE] text-xs font-bold uppercase tracking-wide mb-3">
              {category}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">A few more details</h1>
            <p className="text-slate-500 text-sm mt-1.5">
              Your eGovPH profile has been loaded. We only need the information we do not already have.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* Verified Info Card */}
          {Object.keys(verifiedFields).length > 0 && (
            <div className="bg-green-50/50 border border-green-200 rounded-2xl p-5 mb-8">
              <div className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-4">
                Already verified from your eGovPH profile
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {verifiedFields.age !== undefined && (
                  <div>
                    <div className="text-xs text-slate-500">Age</div>
                    <div className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                      {verifiedFields.age as number} years old <ShieldCheck size={12} className="text-green-500" />
                    </div>
                  </div>
                )}
                {verifiedFields.gender && (
                  <div>
                    <div className="text-xs text-slate-500">Sex</div>
                    <div className="text-sm font-semibold text-slate-800 capitalize flex items-center gap-1">
                      {verifiedFields.gender as string} <ShieldCheck size={12} className="text-green-500" />
                    </div>
                  </div>
                )}
                {verifiedFields.nationality && (
                  <div>
                    <div className="text-xs text-slate-500">Citizenship</div>
                    <div className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                      {verifiedFields.nationality as string} <ShieldCheck size={12} className="text-green-500" />
                    </div>
                  </div>
                )}
                {verifiedFields.province && (
                  <div>
                    <div className="text-xs text-slate-500">Province</div>
                    <div className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                      {verifiedFields.province as string} <ShieldCheck size={12} className="text-green-500" />
                    </div>
                  </div>
                )}
                {verifiedFields.civil_status && (
                  <div>
                    <div className="text-xs text-slate-500">Civil Status</div>
                    <div className="text-sm font-semibold text-slate-800 capitalize flex items-center gap-1">
                      {verifiedFields.civil_status as string} <ShieldCheck size={12} className="text-green-500" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{questions.length - currentQuestion - 1} remaining</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
            <div className="h-full bg-[#0342EE] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          {/* Question Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">{q.question}</h2>

            {q.type === 'select' && (
              <select
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-[#0342EE] transition-colors bg-white"
              >
                <option value="">Select an option...</option>
                {q.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {q.type === 'radio' && (
              <div className="space-y-3">
                {q.options.map(opt => (
                  <label key={opt} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    answers[q.id] === opt
                      ? 'border-[#0342EE] bg-blue-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleAnswer(opt)}
                      className="w-4 h-4 text-[#0342EE]"
                    />
                    <span className="text-sm font-medium text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-6">
              {currentQuestion > 0 && (
                <button onClick={handlePrevious} className="px-5 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Previous
                </button>
              )}
              {!isLast ? (
                <button
                  onClick={handleNext}
                  disabled={!answers[q.id]}
                  className="flex-1 px-5 py-3 rounded-xl bg-[#0342EE] text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleFindPrograms}
                  disabled={!answers[q.id]}
                  className="flex-1 px-5 py-3 rounded-xl bg-[#0342EE] text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Find Programs →
                </button>
              )}
            </div>
          </div>

          {/* Skip link */}
          <div className="text-center mt-6">
            <button onClick={handleSkip} className="text-sm text-slate-400 hover:text-slate-600 underline transition-colors">
              Skip and show results anyway
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Loading Phase ────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center pb-20">
        <Loader2 size={32} className="text-[#0342EE] animate-spin mb-4" />
        <p className="text-slate-500 text-sm">Matching programs to your profile…</p>
      </div>
    )
  }

  // ─── Results Phase ────────────────────────────────────────────────────────
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
      <div className="bg-white border-b border-slate-200 pt-8 pb-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Categories
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Programs matching: <span className="text-[#0342EE] capitalize">{naturalQuery ? `"${naturalQuery}"` : category}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            {programs.length} program{programs.length !== 1 ? 's' : ''} checked against your profile.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
            <p className="text-red-700 font-medium">{error}</p>
            <button onClick={() => fetchPrograms(answers)} className="mt-4 text-sm text-red-600 underline">Try again</button>
          </div>
        )}

        {!error && (
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
