import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, X, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

interface Message {
  from: 'user' | 'bot'
  text: string
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: "Hi! I'm your eGovPH assistant. Describe your situation — like \"I'm a student struggling financially\" — and I'll find the government programs you qualify for and guide you through the process." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const { profile, user } = useAuth()

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  /**
   * Builds a rich system context from the user's eGov profile.
   * The AI uses this to determine eligibility and personalize guidance.
   */
  function buildUserContext() {
    const ai = profile.additional_information ?? {}
    return {
      uniqid:        profile.uniqid,
      email:         user?.email,
      name:          [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(' '),
      birth_date:    profile.birth_date,
      gender:        profile.gender,
      nationality:   profile.nationality,
      civil_status:  ai.other_personal_information?.marital_status,
      region:        profile.region,
      province:      profile.province,
      municipality:  profile.municipality,
      barangay:      profile.barangay,
      occupation:    ai.occupation?.occupation,
      industry:      ai.industry?.industry,
      salary_range:  ai.expected_salary?.expected_salary,
      education:     ai.educational_attainment?.map(e => `${e.level} in ${e.educational_background} from ${e.school}`).join('; '),
      health:        ai.health_data ? `Height: ${ai.health_data.height}cm, Weight: ${ai.health_data.weight}kg` : undefined,
      has_passport:  !!profile.passport?.passport_number,
      national_id:   profile.national_id?.code,
    }
  }

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMsg: Message = { from: 'user', text: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/programs/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg.text,
          user_context: buildUserContext(),
          history: messages.slice(-6).map(m => ({
            role: m.from === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`Service responded with ${response.status}`)
      }

      const data = await response.json()
      const botText = data.data?.reply ?? 'Sorry, I could not get a response.'

      setMessages(prev => [...prev, { from: 'bot', text: botText }])
    } catch (err) {
      // Graceful fallback — don't break the chat on network errors
      setMessages(prev => [...prev, {
        from: 'bot',
        text: "I'm having trouble connecting right now. Please try again in a moment, or visit the official agency websites for program information.",
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[340px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4" style={{ height: '480px' }}>
          <div className="flex items-center gap-3 px-4 py-3 bg-[#022f99]">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <MessageCircle size={16} className="text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">eGov AI Assistant</div>
              <div className="text-blue-200 text-[10px] uppercase tracking-wider">Powered by eGovPH AI</div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/70 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[85%] text-sm px-4 py-2.5 rounded-2xl leading-relaxed shadow-sm whitespace-pre-wrap"
                  style={msg.from === 'user'
                    ? { backgroundColor: '#0342EE', color: 'white', borderBottomRightRadius: '4px' }
                    : { backgroundColor: 'white', color: '#0f172a', borderBottomLeftRadius: '4px', border: '1px solid #e2e8f0' }
                  }>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm" style={{ borderBottomLeftRadius: '4px' }}>
                  <Loader2 size={16} className="text-[#0342EE] animate-spin" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Describe your situation..."
                disabled={loading}
                className="flex-1 text-sm border-2 border-slate-100 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0342EE] transition-all disabled:opacity-50" />
              <button onClick={handleSend} disabled={!input.trim() || loading}
                className="w-11 h-11 flex items-center justify-center rounded-xl text-white disabled:opacity-50 transition-all bg-[#0342EE] hover:bg-blue-700 shadow-sm">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-transform hover:scale-105 hover:shadow-2xl bg-[#0342EE]"
        title="eGov AI Assistant">
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  )
}
