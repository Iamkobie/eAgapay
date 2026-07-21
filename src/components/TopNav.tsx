import { useState, useRef, useEffect } from 'react'
import {
  ChevronDown,
  ShieldCheck,
  X,
  Menu,
  CheckCircle2,
  LogOut,
  User as UserIcon,
} from 'lucide-react'
import type { Page } from '../types'
import { USER } from '../data'

export function TopNav({ page, onNavigate, onLogout }: { page: Page; onNavigate: (p: Page) => void; onLogout: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLink = (target: Page, label: string) => {
    const active = page === target || (target === 'categories' && ['form', 'results', 'detail'].includes(page))
    return (
      <button
        onClick={() => { onNavigate(target); setMobileOpen(false) }}
        className={`text-sm font-medium transition-colors ${active ? 'text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
      >
        {label}
      </button>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button className="flex items-center gap-3 group" onClick={() => onNavigate('categories')}>
            <img src="/eAgapay.png" alt="eAgapay Logo" className="h-20 w-auto" />
          </button>

          <div className="hidden sm:flex items-center gap-8">
            {navLink('categories', 'Discover Programs')}
            
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-[#0342EE] text-white shadow-inner">
                  {USER.initials}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-sm font-semibold text-slate-800 leading-tight">{USER.name}</div>
                  <div className="text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                    <CheckCircle2 size={10} /> Verified
                  </div>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-sm font-semibold text-slate-800">{USER.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <ShieldCheck size={12} className="text-green-600" />
                      PhilSys Verified Account
                    </p>
                  </div>
                  <button onClick={() => { onNavigate('dashboard'); setProfileOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                    <UserIcon size={16} className="text-slate-400" /> My Profile & Data
                  </button>
                  <button onClick={() => { onLogout(); setProfileOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-slate-100">
                    <LogOut size={16} className="text-red-500" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          <button className="sm:hidden text-slate-600 p-2 hover:bg-slate-100 rounded-lg" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="sm:hidden px-4 py-4 bg-white border-t border-slate-200 shadow-inner space-y-2">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-[#0342EE] text-white">
              {USER.initials}
            </div>
            <div>
              <div className="text-slate-800 text-sm font-semibold">{USER.name}</div>
              <div className="text-green-600 text-xs font-medium flex items-center gap-1">
                <CheckCircle2 size={12} /> PhilSys Verified
              </div>
            </div>
          </div>
          <button className="block w-full text-left text-slate-700 font-medium py-3 px-2 rounded-lg hover:bg-slate-50" onClick={() => { onNavigate('categories'); setMobileOpen(false) }}>Discover Programs</button>
          <button className="block w-full text-left text-slate-700 font-medium py-3 px-2 rounded-lg hover:bg-slate-50" onClick={() => { onNavigate('dashboard'); setMobileOpen(false) }}>My Profile</button>
          <button className="block w-full text-left text-red-600 font-medium py-3 px-2 rounded-lg hover:bg-red-50 border-t border-slate-100 mt-2" onClick={() => { onLogout(); setMobileOpen(false) }}>Sign Out</button>
        </div>
      )}
    </nav>
  )
}
