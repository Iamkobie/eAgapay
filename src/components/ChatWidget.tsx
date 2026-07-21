import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, X } from 'lucide-react'

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm the eGovPH platform assistant. I can help with navigating the app, understanding eligibility results, or updating your profile. How can I help?" },
  ])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  function handleSend() {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input.trim() }
    let botText = "I can help with platform navigation and your profile. For specific program questions, please visit the official agency website."

    const q = input.toLowerCase()
    if (q.includes('eligib')) botText = "Eligibility is matched against your profile. Results show color-coded badges. Click any program for full details."
    
    setMessages(prev => [...prev, userMsg, { from: 'bot', text: botText }])
    setInput('')
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
              <div className="text-white font-semibold text-sm">Platform Help</div>
              <div className="text-blue-200 text-[10px] uppercase tracking-wider">eGovPH Assistant</div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/70 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[85%] text-sm px-4 py-2.5 rounded-2xl leading-relaxed shadow-sm"
                  style={msg.from === 'user'
                    ? { backgroundColor: '#0342EE', color: 'white', borderBottomRightRadius: '4px' }
                    : { backgroundColor: 'white', color: '#0f172a', borderBottomLeftRadius: '4px', border: '1px solid #e2e8f0' }
                  }>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about the platform..."
                className="flex-1 text-sm border-2 border-slate-100 rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0342EE] focus:ring-0 transition-all" />
              <button onClick={handleSend} disabled={!input.trim()}
                className="w-11 h-11 flex items-center justify-center rounded-xl text-white disabled:opacity-50 transition-all bg-[#0342EE] hover:bg-blue-700 shadow-sm">
                <Send size={18} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-transform hover:scale-105 hover:shadow-2xl bg-[#0342EE]"
        title="Platform Help">
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  )
}
