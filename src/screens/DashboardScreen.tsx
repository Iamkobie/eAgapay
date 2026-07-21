import { useState } from 'react'
import {
  ShieldCheck,
  RefreshCcw,
  Download,
  Lock,
  User as UserIcon,
  MapPin,
  Phone,
  Mail,
  Heart,
  Briefcase,
  GraduationCap,
  AlertCircle,
  Globe,
  X,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

function capitalize(str?: string) {
  if (!str) return '—'
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// ─── Modal Component ──────────────────────────────────────────────────────────
function Modal({ open, onClose, title, icon, iconColor, children }: {
  open: boolean
  onClose: () => void
  title: string
  icon: React.ReactNode
  iconColor?: string
  children: React.ReactNode
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor || 'bg-blue-50 text-[#0342EE]'}`}>
              {icon}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Data Field Component ─────────────────────────────────────────────────────
function DataField({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</div>
      <div className={`text-sm font-medium text-slate-800 ${capitalize ? 'capitalize' : ''}`}>{value}</div>
    </div>
  )
}

// ─── Section Card (clickable) ─────────────────────────────────────────────────
function SectionCard({ icon, iconColor, title, subtitle, onClick }: {
  icon: React.ReactNode
  iconColor: string
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 text-left hover:border-[#0342EE]/30 hover:shadow-md transition-all duration-200 group"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0342EE] transition-colors">{title}</div>
        <div className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</div>
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-[#0342EE] transition-colors flex-shrink-0" />
    </button>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function DashboardScreen() {
  const { profile, displayName, initials, user } = useAuth()
  const ai = profile.additional_information ?? {}
  const edu = ai.educational_attainment?.[0]

  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [userFields, setUserFields] = useState({
    employment: ai.occupation?.occupation ?? '',
    monthly_income: ai.expected_salary?.expected_salary ? `₱${ai.expected_salary.expected_salary}` : '',
    education: edu ? `${edu.level}'s - ${edu.educational_background}` : '',
    industry: ai.industry?.industry ?? '',
  })
  const [editing, setEditing] = useState<string | null>(null)
  const [editVal, setEditVal] = useState('')

  function startEdit(id: string, val: string) { setEditing(id); setEditVal(val) }
  function saveEdit(id: string) {
    setUserFields(prev => ({ ...prev, [id]: editVal }))
    setEditing(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 pb-20">
      <div className="bg-white border-b border-slate-200 pt-10 pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 mt-1.5 text-sm">Your verified identity and personal information.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex-shrink-0">
                {profile.photo ? (
                  <img src={profile.photo} alt={displayName} className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 shadow-sm" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#0342EE] text-white flex items-center justify-center text-2xl font-bold border-2 border-slate-100 shadow-sm">{initials}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-md border border-green-200 text-xs font-semibold w-fit">
                    <ShieldCheck size={13} /> PhilSys Verified
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1.5">
                  {capitalize(profile.gender)}{ai.other_personal_information?.marital_status ? ` · ${ai.other_personal_information.marital_status}` : ''}{profile.nationality ? ` · ${profile.nationality}` : ''}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0"><Mail size={14} className="text-slate-400" /></div>
                <span className="truncate">{user?.email ?? '—'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0"><Phone size={14} className="text-slate-400" /></div>
                <span>{profile.mobile ?? '—'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0"><MapPin size={14} className="text-slate-400" /></div>
                <span className="truncate">{[profile.municipality, profile.province].filter(Boolean).join(', ') || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-8">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</div>
          <div className="grid grid-cols-3 gap-2">
            {([{ icon: RefreshCcw, label: 'Sync Data', desc: 'Refresh from national ID' }, { icon: Download, label: 'Download', desc: 'Get a PDF copy' }, { icon: Lock, label: 'Privacy', desc: 'Manage data access' }] as const).map((a, i) => {
              const Icon = a.icon
              return (
                <button key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-[#0342EE] group-hover:text-white transition-all text-slate-500"><Icon size={18} /></div>
                  <span className="text-xs font-medium text-slate-600 group-hover:text-[#0342EE] transition-colors">{a.label}</span>
                  <span className="text-[10px] text-slate-400 hidden sm:block">{a.desc}</span>
                </button>
              )
            })}
          </div>
        </div>
        {/* Section Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <SectionCard icon={<ShieldCheck size={22} />} iconColor="bg-green-50 text-green-600" title="Verified Identity" subtitle="National ID, date of birth, nationality" onClick={() => setActiveModal('identity')} />
          <SectionCard icon={<MapPin size={22} />} iconColor="bg-blue-50 text-[#0342EE]" title="Address & Location" subtitle={[profile.municipality, profile.province].filter(Boolean).join(', ') || '—'} onClick={() => setActiveModal('address')} />
          <SectionCard icon={<Heart size={22} />} iconColor="bg-rose-50 text-rose-500" title="Birth & Health" subtitle={ai.health_data ? `${ai.health_data.height ?? '?'}cm, ${ai.health_data.weight ?? '?'}kg` : 'Not available'} onClick={() => setActiveModal('health')} />
          <SectionCard icon={<GraduationCap size={22} />} iconColor="bg-violet-50 text-violet-600" title="Education" subtitle={edu?.school ?? 'Not available'} onClick={() => setActiveModal('education')} />
          <SectionCard icon={<Briefcase size={22} />} iconColor="bg-amber-50 text-amber-600" title="Employment & Industry" subtitle={ai.industry?.industry ?? 'Not available'} onClick={() => setActiveModal('employment')} />
          <SectionCard icon={<AlertCircle size={22} />} iconColor="bg-red-50 text-red-500" title="Emergency Contact" subtitle={ai.emergency_information?.emergency_name ?? 'Not available'} onClick={() => setActiveModal('emergency')} />
          {profile.passport && <SectionCard icon={<Globe size={22} />} iconColor="bg-sky-50 text-sky-600" title="Passport" subtitle={`${profile.passport.passport_number ?? '—'} · Expires ${formatDate(profile.passport.expiry_date)}`} onClick={() => setActiveModal('passport')} />}
          <SectionCard icon={<UserIcon size={22} />} iconColor="bg-indigo-50 text-indigo-600" title="Self-Reported Info" subtitle="Editable profile details for eligibility" onClick={() => setActiveModal('self-reported')} />
        </div>
      </div>

      {/* Verified Identity */}
      <Modal open={activeModal === 'identity'} onClose={() => setActiveModal(null)} title="Verified Identity" icon={<ShieldCheck size={20} />} iconColor="bg-green-50 text-green-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DataField label="Full Name" value={displayName} />
          <DataField label="Date of Birth" value={formatDate(profile.birth_date)} />
          <DataField label="Gender" value={capitalize(profile.gender)} />
          <DataField label="Nationality" value={profile.nationality ?? '—'} />
          <DataField label="Civil Status" value={ai.other_personal_information?.marital_status ?? '—'} />
          <DataField label="Religion" value={ai.other_personal_information?.religion ?? '—'} />
          <DataField label="PhilSys ID" value={profile.national_id?.code ?? '—'} />
          <DataField label="PCN" value={profile.national_id?.pcn ?? '—'} />
        </div>
      </Modal>
      <Modal open={activeModal === 'address'} onClose={() => setActiveModal(null)} title="Address & Location" icon={<MapPin size={20} />} iconColor="bg-blue-50 text-[#0342EE]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DataField label="Street" value={profile.street ?? '—'} />
          <DataField label="Barangay" value={profile.barangay ?? '—'} />
          <DataField label="Municipality / City" value={profile.municipality ?? '—'} />
          <DataField label="Province" value={profile.province ?? '—'} />
          <DataField label="Region" value={profile.region ?? '—'} />
          <DataField label="Country" value={profile.country ?? '—'} />
        </div>
      </Modal>
      <Modal open={activeModal === 'health'} onClose={() => setActiveModal(null)} title="Birth & Health" icon={<Heart size={20} />} iconColor="bg-rose-50 text-rose-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DataField label="Birth Country" value={ai.birth_place?.birth_country ?? '—'} />
          <DataField label="Birth Province" value={ai.birth_place?.birth_province ?? '—'} />
          <DataField label="Birth Municipality" value={ai.birth_place?.birth_municipality ?? '—'} />
          <DataField label="Height" value={ai.health_data?.height ? `${ai.health_data.height} cm` : '—'} />
          <DataField label="Weight" value={ai.health_data?.weight ? `${ai.health_data.weight} kg` : '—'} />
          <DataField label="Eye Color" value={ai.health_data?.eyes_color ?? '—'} />
          <DataField label="Complexion" value={capitalize(ai.health_data?.complexion)} />
        </div>
      </Modal>
      <Modal open={activeModal === 'education'} onClose={() => setActiveModal(null)} title="Education" icon={<GraduationCap size={20} />} iconColor="bg-violet-50 text-violet-600">
        {ai.educational_attainment?.length ? ai.educational_attainment.map((e, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-100 mb-3">
            <div className="text-base font-bold text-slate-900">{e.level}'s Degree</div>
            <div className="text-sm text-[#0342EE] font-medium mt-1">{e.educational_background}</div>
            <div className="text-sm text-slate-600 mt-2">{e.school}</div>
            <div className="text-xs text-slate-400 mt-2 font-medium">{e.from} – {e.to}</div>
          </div>
        )) : <p className="text-sm text-slate-400">No education records available.</p>}
      </Modal>
      <Modal open={activeModal === 'employment'} onClose={() => setActiveModal(null)} title="Employment & Industry" icon={<Briefcase size={20} />} iconColor="bg-amber-50 text-amber-600">
        <div className="space-y-5">
          <DataField label="Occupation" value={ai.occupation?.occupation ?? '—'} />
          <DataField label="Industry" value={ai.industry?.industry ?? '—'} />
          <DataField label="Expected Salary Range" value={ai.expected_salary?.expected_salary ? `₱${ai.expected_salary.expected_salary}` : '—'} />
        </div>
      </Modal>
      <Modal open={activeModal === 'emergency'} onClose={() => setActiveModal(null)} title="Emergency Contact" icon={<AlertCircle size={20} />} iconColor="bg-red-50 text-red-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DataField label="Contact Name" value={ai.emergency_information?.emergency_name ?? '—'} />
          <DataField label="Relationship" value={ai.emergency_information?.emergency_relationship ?? '—'} />
          <DataField label="Contact Number" value={ai.emergency_information?.emergency_contact ?? '—'} />
        </div>
      </Modal>
      <Modal open={activeModal === 'passport'} onClose={() => setActiveModal(null)} title="Passport" icon={<Globe size={20} />} iconColor="bg-sky-50 text-sky-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DataField label="Passport Number" value={profile.passport?.passport_number ?? '—'} />
          <DataField label="Place Issued" value={profile.passport?.place_issued ?? '—'} />
          <DataField label="Issued Date" value={formatDate(profile.passport?.issued_date)} />
          <DataField label="Expiry Date" value={formatDate(profile.passport?.expiry_date)} />
        </div>
      </Modal>

      {/* Self-Reported */}
      <Modal open={activeModal === 'self-reported'} onClose={() => setActiveModal(null)} title="Self-Reported Information" icon={<UserIcon size={20} />} iconColor="bg-indigo-50 text-indigo-600">
        <p className="text-sm text-slate-500 mb-5">Keep this up to date for the most accurate eligibility matches.</p>
        <div className="space-y-1 -mx-2">
          {([{ id: 'employment', label: 'Occupation' }, { id: 'monthly_income', label: 'Expected Salary Range' }, { id: 'education', label: 'Educational Attainment' }, { id: 'industry', label: 'Industry' }] as const).map((f) => (
            <div key={f.id} className="p-4 rounded-xl group hover:bg-slate-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{f.label}</div>
                  {editing === f.id ? (
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <input className="flex-1 text-sm border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0342EE] transition-colors bg-white" value={editVal} onChange={e => setEditVal(e.target.value)} autoFocus />
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(f.id)} className="text-sm font-medium px-3 py-2 rounded-lg text-white bg-[#0342EE] hover:bg-blue-700 transition-colors">Save</button>
                        <button onClick={() => setEditing(null)} className="text-sm font-medium px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-700 mt-1 font-medium truncate">{userFields[f.id] || '—'}</div>
                  )}
                </div>
                {editing !== f.id && (
                  <button onClick={() => startEdit(f.id, userFields[f.id])} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-[#0342EE] hover:text-[#0342EE] text-slate-500 transition-all flex-shrink-0">Edit</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
