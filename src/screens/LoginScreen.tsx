import { useState, useEffect } from 'react'
import { Shield, FileText, Search, ShieldCheck, ArrowRight, Lock, Menu, X, Star, Users, Zap, Heart, ChevronDown, MapPin } from 'lucide-react'

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      // Update active section based on scroll position
      const sections = ['hero', 'features', 'how-it-works', 'testimonials', 'faq']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faq', label: 'FAQ' },
  ]

  const features = [
    { icon: ShieldCheck, title: 'Secure & Verified', desc: 'Your data is protected under the Data Privacy Act of 2012 with bank-level encryption.' },
    { icon: Zap, title: 'Instant Matching', desc: 'AI-powered algorithm matches you with eligible programs in seconds, not hours.' },
    { icon: Users, title: 'All-in-One Access', desc: 'Access programs from multiple government agencies through a single platform.' },
    { icon: Heart, title: 'Citizen-Centric', desc: 'Designed with Filipinos in mind - simple, accessible, and always free to use.' },
  ]

  const testimonials = [
    { name: 'Maria Santos', role: 'Small Business Owner', location: 'Quezon City', quote: 'Akala ko talaga walang tulong ang gobyerno sa bansa, salamat sa app na to alam ko na, i love u bbm!!!', rating: 5 },
    { name: 'Juan Dela Cruz', role: 'Senior Citizen', location: 'Manila', quote: 'Kadalasan tinatago ng ibang mapagsamantalang empleyado ang tulong para sa mamamayan, dahil dito aware na ako sa mga program ng gobyerno', rating: 5 },
    { name: 'Ana Reyes', role: 'Freelancer', location: 'Cebu', quote: 'As a freelancer, I struggled to find government support. eAgapay changed everything.', rating: 5 },
  ]

  const faqs = [
    { q: 'Is eAgapay free to use?', a: 'Yes, eAgapay is completely free for all Filipino citizens. No hidden fees or charges.' },
    { q: 'How secure is my personal data?', a: 'Your data is protected under the Data Privacy Act of 2012 with end-to-end encryption and strict access controls.' },
    { q: 'What government programs can I find?', a: 'You can discover programs from various agencies including SSS, PhilHealth, Pag-IBIG, DSWD, and more.' },
    { q: 'Do I need an eGovPH account?', a: 'Yes, you need a verified eGovPH account to access personalized program recommendations.' },
  ]

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Sticky Navigation */}
      <nav className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 transition-all duration-300 ${scrollY > 50 ? 'shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <img src="/eAgapay.png" alt="eAgapay Logo" className="h-20 w-auto" />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-sm font-medium transition-all duration-200 hover:text-[#0342EE] ${activeSection === link.id ? 'text-[#0342EE] font-semibold' : 'text-slate-600'}`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={onLogin}
                className="bg-[#0342EE] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-6 space-y-4 animate-in slide-in-from-top-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left text-slate-700 font-medium py-2 hover:text-[#0342EE] transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={onLogin}
              className="w-full bg-[#0342EE] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Sign In
            </button>
          </div>
        )}
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="bg-gradient-to-br from-[#022f99] via-[#0342EE] to-[#022f99] py-24 sm:py-32 px-4 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#FAC302]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-5 py-2 rounded-full mb-8 border border-white/20 shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="w-2 h-2 rounded-full bg-[#FAC302] animate-pulse"></span>
              Official Government Platform
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Discover government programs <br className="hidden sm:block" />
              <span className="text-[#FAC302]">you are eligible for.</span>
            </h1>
            <p className="text-blue-100 text-xl sm:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Alamin ang tulong ng gobyerno para sa'yo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <button
                onClick={onLogin}
                className="inline-flex items-center justify-center gap-3 bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto"
              >
                <ShieldCheck size={22} className="text-white/80" />
                Sign in with eGovPH
                <ArrowRight size={20} className="ml-2" />
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 w-full sm:w-auto"
              >
                Learn More
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 text-blue-200 text-sm mt-8 opacity-80 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <Lock size={14} />
              Protected under the Data Privacy Act of 2012
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-12 px-4 border-b border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '50K+', label: 'Citizens Served' },
                { value: '200+', label: 'Government Programs' },
                { value: '98%', label: 'Match Accuracy' },
                { value: '24/7', label: 'Availability' },
              ].map((stat, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="text-3xl sm:text-4xl font-bold text-[#0342EE] mb-2">{stat.value}</div>
                  <div className="text-slate-600 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-slate-50 py-20 sm:py-28 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[#0342EE] font-semibold text-sm uppercase tracking-wider mb-4">Why Choose eAgapay</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Features that empower Filipinos</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Experience a seamless way to discover and access government programs designed for you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 group animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0342EE] to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={28} className="text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-3 text-xl">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 sm:py-28 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[#0342EE] font-semibold text-sm uppercase tracking-wider mb-4">Simple Process</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">How it works</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Get started in just three simple steps
              </p>
            </div>
            <div className="relative">
              {/* Connecting Line */}
              <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-[#0342EE] to-blue-200 transform -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 relative z-10">
                {[
                  { step: '1', icon: Shield, title: 'Verify Identity', desc: 'Sign in securely. We retrieve your verified identity—no manual data entry needed.' },
                  { step: '2', icon: FileText, title: 'Quick Profiling', desc: 'Answer a few short, targeted questions to fill in any missing information.' },
                  { step: '3', icon: Search, title: 'Discover Matches', desc: 'Get a personalized, accurate list of programs you are eligible for across all agencies.' },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={item.step} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-2 group animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 150}ms` }}>
                      <div className="relative mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0342EE] to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Icon size={32} className="text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#FAC302] text-white flex items-center justify-center font-bold text-sm shadow-md">
                          {item.step}
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-3 text-xl">{item.title}</h3>
                      <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 sm:py-28 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[#0342EE] font-semibold text-sm uppercase tracking-wider mb-4">Testimonials</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">What Filipinos are saying</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Join thousands of Filipinos who have already benefited from eAgapay
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} size={16} className="fill-[#FAC302] text-[#FAC302]" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0342EE] to-blue-600 flex items-center justify-center text-white font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin size={10} /> {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-white py-20 sm:py-28 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[#0342EE] font-semibold text-sm uppercase tracking-wider mb-4">FAQ</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Frequently asked questions</h2>
              <p className="text-slate-600 text-lg">
                Got questions? We've got answers.
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-slate-200 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                    <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                    <p className="px-6 pb-6 text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 pt-16 pb-8 px-4 border-t-4 border-[#0342EE]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src="/eAgapay.png" alt="eAgapay Logo" className="h-24 w-auto" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Connecting Filipino citizens to essential government services and programs through verified data.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#0342EE] hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#0342EE] hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#0342EE] hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-6 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Government Links */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-6 uppercase tracking-wider">Government Links</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">GOV.PH</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Open Data Portal</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Official Gazette</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">DSWD</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-6 uppercase tracking-wider">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="text-slate-400">support@eagapay.gov.ph</li>
                <li className="text-slate-400">+63 2 8888 8888</li>
                <li className="text-slate-400">Manila, Philippines</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Government of the Philippines. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
