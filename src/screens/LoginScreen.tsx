import { ShieldCheck, ArrowRight, Lock } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export function LoginScreen() {
  const navigate = useNavigate()
  const [exchangeCode, setExchangeCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCodeInput, setShowCodeInput] = useState(false)

  async function handleSubmitCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/auth/sso/egov`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exchange_code: exchangeCode.trim() }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.message || `Error ${res.status}`)
      }

      const { access_token, refresh_token } = json.data.session
      
      // Store the profile from the backend response so it's immediately available
      // even before the AuthContext re-fetches from Supabase
      if (json.data.user) {
        sessionStorage.setItem('egov_profile_cache', JSON.stringify(json.data.user))
      }
      
      navigate(`/sso/callback?access_token=${access_token}&refresh_token=${refresh_token}`, {
        replace: true,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <img src="/eAgapay.png" alt="eAgapay Logo" className="h-20 w-auto" />
        </div>
      </nav>

      <main className="flex-1 flex flex-col justify-center">
        {/* Hero */}
        <div className="bg-[#022f99] py-20 sm:py-28 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-8 border border-white/20 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#FAC302]"></span>
              Official Government Platform
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Discover government programs <br className="hidden sm:block" />
              <span className="text-[#FAC302]">you are eligible for.</span>
            </h1>
            <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Connect your verified eGovPH account and we will seamlessly match you to the benefits, services, and support you qualify for.
            </p>

            {!showCodeInput ? (
              <div>
                <button
                  onClick={() => setShowCodeInput(true)}
                  className="inline-flex items-center justify-center gap-3 bg-[#0342EE] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 w-full sm:w-auto"
                >
                  <ShieldCheck size={22} className="text-white/80" />
                  Sign in with eGovPH
                  <ArrowRight size={20} className="ml-2" />
                </button>
                <div className="flex items-center justify-center gap-2 text-blue-200 text-xs mt-6 opacity-80">
                  <Lock size={12} />
                  Protected under the Data Privacy Act of 2012
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitCode} className="max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-4">
                  <div className="text-left">
                    <label htmlFor="exchangeCode" className="block text-white text-sm font-semibold mb-3">
                      Enter your eGov Exchange Code
                    </label>
                    <input
                      id="exchangeCode"
                      type="text"
                      value={exchangeCode}
                      onChange={(e) => setExchangeCode(e.target.value)}
                      placeholder="Paste exchange code here"
                      className="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white/95 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FAC302] transition-colors font-mono text-sm"
                      disabled={isLoading}
                      autoFocus
                      required
                    />
                  </div>

                  {error && (
                    <div className="mt-3 text-red-100 text-sm bg-red-500/20 border border-red-300/30 rounded-lg px-4 py-2 text-left">
                      {error}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !exchangeCode.trim()}
                  className="inline-flex items-center justify-center gap-3 bg-[#FAC302] text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-yellow-400 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                      Authenticating…
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={22} />
                      Complete Sign In
                      <ArrowRight size={20} className="ml-2" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setShowCodeInput(false); setExchangeCode(''); setError(null) }}
                  className="mt-4 text-blue-200 text-sm hover:text-white transition-colors underline"
                >
                  Back
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 py-8 px-4 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Government of the Philippines.
        </p>
      </footer>
    </div>
  )
}
