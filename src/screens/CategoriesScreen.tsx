import { useState, useRef, useEffect } from 'react'
import { Search, Send, Info, Plus, Loader2, ArrowLeft, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { CATEGORIES } from '../data'
import { ProgramSubmitModal } from '../components/ProgramSubmitModal'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

interface ProgramCard {
  name: string
  agency: string
  url: string
  description?: string
}

interface Message {
  from: 'user' | 'ai'
  text: string
  programs?: ProgramCard[]
}

interface CategoriesScreenProps {
  onSelect: (cat: string, query?: string) => void
}

// ─── Program Card (inline in chat) ────────────────────────────────────────────
function MiniProgramCard({ program }: { program: ProgramCard }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-[#0342EE]/40 transition-all shadow-sm">
      <div className="p-4">
        <div className="text-xs text-slate-400 font-medium mb-1">{program.agency}</div>
        <h4 className="text-sm font-bold text-slate-900 leading-snug">{program.name}</h4>
        {program.description && (
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{program.description}</p>
        )}
        <div className="flex items-center gap-2 mt-3">
          {program.url && (
            <a href={program.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#0342EE] px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
              <ExternalLink size={12} /> Apply
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function CategoriesScreen({ onSelect }: CategoriesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [chatMode, setChatMode] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { profile, user } = useAuth()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function buildUserContext() {
    const ai = profile.additional_information ?? {}
    return {
      name: [profile.first_name, profile.last_name].filter(Boolean).join(' '),
      birth_date: profile.birth_date,
      gender: profile.gender,
      nationality: profile.nationality,
      region: profile.region,
      province: profile.province,
      municipality: profile.municipality,
      occupation: ai.occupation?.occupation,
      education: ai.educational_attainment?.map(e => `${e.level} in ${e.educational_background}`).join('; '),
      salary_range: ai.expected_salary?.expected_salary,
      civil_status: ai.other_personal_information?.marital_status,
    }
  }

  async function handleSearch() {
    const query = searchQuery.trim()
    if (!query || loading) return

    if (!chatMode) setChatMode(true)

    setMessages(prev => [...prev, { from: 'user', text: query }])
    setSearchQuery('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/programs/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          user_context: buildUserContext(),
          history: messages.slice(-6).map(m => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })),
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const json = await res.json()
      const reply = json.data?.reply || 'Sorry, I could not process that.'
      const programs = json.data?.programs || []

      // Only include programs if they have URLs (meaning AI found real matches)
      const validPrograms = programs.filter((p: ProgramCard) => p.url)

      setMessages(prev => [...prev, {
        from: 'ai',
        text: reply,
        programs: validPrograms.length > 0 ? validPrograms : undefined,
      }])
    } catch {
      setMessages(prev => [...prev, { from: 'ai', text: "I'm having trouble connecting. Please try again or browse programs by category below." }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  function handleExitChat() {
    setChatMode(false)
    setMessages([])
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Search / AI Conversation Area */}
      <div className={`bg-white border-b border-slate-200 px-4 sm:px-6 transition-all duration-500 ${chatMode ? 'pt-6 pb-6' : 'pt-10 pb-12'}`}>
        <div className="max-w-4xl mx-auto">
          {!chatMode && (
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">What are you looking for?</h1>
              <p className="text-slate-500 text-base max-w-xl mx-auto">
                Describe your situation and our AI will guide you to the right government programs.
              </p>
            </div>
          )}

          {chatMode && (
            <button onClick={handleExitChat} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors">
              <ArrowLeft size={16} /> Back to browse
            </button>
          )}

          {/* Conversation messages */}
          {chatMode && messages.length > 0 && (
            <div className="mb-4 max-h-[60vh] overflow-y-auto space-y-4 pr-2">
              {messages.map((msg, i) => (
                <div key={i}>
                  <div className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] text-sm px-4 py-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.from === 'user'
                        ? 'bg-[#0342EE] text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-800 rounded-bl-md border border-slate-200'
                    }`}>
                      {msg.text}
                    </div>
                  </div>

                  {/* Program cards — rendered as UI below AI message */}
                  {msg.programs && msg.programs.length > 0 && (
                    <div className="mt-3 ml-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.programs.map((prog, j) => (
                        <MiniProgramCard key={j} program={prog} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 size={16} className="text-[#0342EE] animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Search input */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#0342EE] transition-colors" />
            </div>
            <input
              ref={inputRef}
              type="text"
              className="block w-full pl-12 pr-16 py-4 border-2 border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-[#0342EE] transition-all shadow-sm text-base"
              placeholder={chatMode ? "Type your reply..." : "Describe your situation... (e.g. 'I'm a student and I need financial help')"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={loading}
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || loading}
                className="p-2 bg-[#0342EE] text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories grid — only shown when NOT in chat mode */}
      {!chatMode && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 bg-slate-50/50 px-2">Or browse by category</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon
              const isDisaster = cat.id === 'disaster'
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelect(cat.id)}
                  className={`bg-white border rounded-2xl p-5 text-left transition-all duration-200 group flex flex-col gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 ${
                    isDisaster
                      ? 'border-red-100 hover:border-red-300'
                      : 'border-slate-200 hover:border-[#0342EE]/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isDisaster
                      ? 'bg-red-50 text-[#B80101] group-hover:bg-red-100'
                      : 'bg-slate-50 text-[#0342EE] group-hover:bg-blue-50'
                  }`}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className={`font-semibold text-sm mb-1.5 transition-colors ${
                      isDisaster ? 'text-red-900' : 'text-slate-900 group-hover:text-[#0342EE]'
                    }`}>
                      {cat.label}
                    </div>
                    <div className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                      {cat.desc}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Info bar */}
          <div className="mt-12 bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-sm max-w-3xl mx-auto">
            <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800">Smart Matching:</span> Your verified PhilSys profile is applied automatically. The AI will ask only what's needed to find your best matches.
            </p>
          </div>

          {/* Submit Program Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#0342EE] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Submit a Government Program
            </button>
          </div>
        </div>
      )}

      <ProgramSubmitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
