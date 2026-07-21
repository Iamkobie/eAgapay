import { useState } from 'react'
import {
  ShieldCheck,
  RefreshCcw,
  Download,
  Lock,
  User as UserIcon,
} from 'lucide-react'
import { USER } from '../data'

export function DashboardScreen() {
  const [userFields, setUserFields] = useState({
    employment: 'Employed (part-time)',
    monthly_income: '₱5,000 – ₱10,000',
    education: 'College undergraduate',
    enrolled: 'No',
  })
  const [editing, setEditing] = useState<string | null>(null)
  const [editVal, setEditVal] = useState('')

  const completeness = 78

  function startEdit(id: string, val: string) { setEditing(id); setEditVal(val) }
  function saveEdit(id: string) {
    setUserFields(prev => ({ ...prev, [id]: editVal }))
    setEditing(null)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-slate-200 pt-10 pb-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account & Profile</h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">Manage your verified identity and eligibility information.</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: Profile Summary & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile Snapshot */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-24 h-24 rounded-full bg-[#0342EE] text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-inner border-4 border-blue-50">
                {USER.initials}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{USER.name}</h2>
              <div className="flex items-center gap-1.5 mt-3 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 text-xs font-semibold">
                <ShieldCheck size={16} /> PhilSys Verified
              </div>
              
              <div className="w-full mt-8 text-left">
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                  <span>Profile Completeness</span>
                  <span className="text-[#0342EE] font-bold">{completeness}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out bg-[#0342EE]" style={{ width: `${completeness}%` }} />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-2">
              <div className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Quick Actions
              </div>
              <div className="space-y-1">
                {[
                  { icon: RefreshCcw, label: 'Sync eGovPH Data', desc: 'Refresh from national ID' },
                  { icon: Download, label: 'Download Summary', desc: 'Get a PDF copy' },
                  { icon: Lock, label: 'Privacy Settings', desc: 'Manage data access' },
                ].map((a, i) => {
                  const Icon = a.icon
                  return (
                    <button key={i} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all text-left group">
                      <div className="bg-slate-100 p-2.5 rounded-lg group-hover:bg-white group-hover:text-[#0342EE] group-hover:shadow-sm transition-all text-slate-500">
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-700 group-hover:text-[#0342EE] transition-colors">{a.label}</div>
                        <div className="text-xs text-slate-500">{a.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content: Forms & Data */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Missing Info Banner */}
            <div className="bg-white rounded-2xl border border-[#FAC302]/40 shadow-sm overflow-hidden relative p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FAC302]"></div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-bold text-slate-900 text-lg">Unlock More Programs</h3>
                </div>
                <p className="text-sm text-slate-600">Provide missing details (like household expenses) to discover targeted opportunities.</p>
              </div>
              <button className="whitespace-nowrap px-6 py-3 bg-[#FAC302] hover:bg-[#e5b200] text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md">
                Complete Profile
              </button>
            </div>

            {/* Verified Data */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                  <ShieldCheck className="text-green-600" size={22} />
                  Verified Identity
                </h2>
                <p className="text-sm text-slate-500 mt-1">Sourced securely from the National ID System. Read-only.</p>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 bg-slate-50/30">
                {[
                  { label: 'Full Name', value: USER.name },
                  { label: 'Date of Birth', value: USER.dateOfBirth },
                  { label: 'Sex', value: USER.sex },
                  { label: 'Civil Status', value: USER.civilStatus },
                  { label: 'Citizenship', value: USER.citizenship },
                  { label: 'PhilSys ID No.', value: USER.philsysId },
                  { label: 'Province/City', value: USER.province },
                ].map((f) => (
                  <div key={f.label}>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{f.label}</div>
                    <div className="text-sm font-medium text-slate-800 bg-white border border-slate-200 shadow-sm rounded-lg px-3 py-2.5">{f.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Self-Reported Data */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                    <UserIcon className="text-[#0342EE]" size={22} />
                    Self-Reported Information
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Keep this up to date for the most accurate eligibility matches.</p>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { id: 'employment', label: 'Employment Status' },
                  { id: 'monthly_income', label: 'Monthly Household Income' },
                  { id: 'education', label: 'Educational Attainment' },
                  { id: 'enrolled', label: 'Currently Enrolled in SUC/LUC' },
                ].map((f) => (
                  <div key={f.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-50/50 transition-colors">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900 mb-1">{f.label}</div>
                      {editing === f.id ? (
                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                          <input className="flex-1 max-w-sm text-sm border-2 border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#0342EE] transition-colors bg-white shadow-sm"
                            value={editVal} onChange={e => setEditVal(e.target.value)} autoFocus />
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(f.id)} className="text-sm font-medium px-4 py-2.5 rounded-lg text-white bg-[#0342EE] hover:bg-blue-700 transition-colors shadow-sm">Save</button>
                            <button onClick={() => setEditing(null)} className="text-sm font-medium px-4 py-2.5 rounded-lg border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors bg-white shadow-sm">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-slate-500">{userFields[f.id as keyof typeof userFields]}</div>
                      )}
                    </div>
                    {!editing && (
                      <button onClick={() => startEdit(f.id, userFields[f.id as keyof typeof userFields])}
                        className="text-sm font-medium px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#0342EE] hover:text-[#0342EE] text-slate-600 transition-all shadow-sm flex-shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 focus:opacity-100">
                        Update
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
