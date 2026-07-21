import { Shield, FileText, Search, ShieldCheck, ArrowRight, Lock } from 'lucide-react'
import { PhSunIcon } from '../components/PhSunIcon'

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <div className="bg-[#0342EE] p-1.5 rounded-lg shadow-sm">
             <PhSunIcon size={24} color="#fff" />
          </div>
          <div className="text-left flex flex-col justify-center">
            <span className="text-slate-900 font-bold text-sm sm:text-base leading-tight">eGovPH</span>
            <span className="text-slate-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider leading-tight">Opportunity Discovery</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col justify-center">
        {/* Hero */}
        <div className="bg-[#022f99] py-20 sm:py-28 px-4 relative overflow-hidden">
          {/* Decorative background pattern */}
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
            <button
              onClick={onLogin}
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
        </div>

        {/* How it works */}
        <div className="bg-white py-20 px-4 flex-1">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] mb-12 text-slate-400">How it works</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-16">
              {[
                { step: '1', icon: Shield, title: 'Verify Identity', desc: 'Sign in securely. We retrieve your verified identity—no manual data entry needed.' },
                { step: '2', icon: FileText, title: 'Quick Profiling', desc: 'Answer a few short, targeted questions to fill in any missing information.' },
                { step: '3', icon: Search, title: 'Discover Matches', desc: 'Get a personalized, accurate list of programs you are eligible for across all agencies.' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.step} className="text-center group">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-slate-50 border border-slate-100 shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                      <Icon size={28} className="text-[#0342EE]" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-3 text-lg">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 pt-16 pb-8 px-4 border-t-4 border-[#0342EE]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* GovPH Info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#0342EE] p-2 rounded-lg">
                  <ShieldCheck size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white tracking-wide">REPUBLIC OF THE PHILIPPINES</h3>
                  <p className="text-xs text-slate-400 font-medium tracking-widest mt-1 uppercase">Opportunity Discovery</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                All content is in the public domain unless otherwise stated. This platform aims to seamlessly connect Filipino citizens to essential government services and programs through verified data.
              </p>
            </div>

            {/* About & Links */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-semibold text-sm mb-6 uppercase tracking-wider">About GOVPH</h4>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Learn more about the Philippine government, its portal, and more.
                </p>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">GOV.PH</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Open Data Portal</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Official Gazette</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold text-sm mb-6 uppercase tracking-wider">Government Links</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Office of the President</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Office of the Vice President</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Senate of the Philippines</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">House of Representatives</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Supreme Court</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Court of Appeals</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Sandiganbayan</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Government of the Philippines.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
