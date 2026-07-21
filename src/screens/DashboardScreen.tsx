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

// ─── User Data (simulated API response) ──────────────────────────────────────
const USER_DATA = {
  uniqid: 'MVPCBEUVCGPZR',
  email: 'josie@yopmail.com',
  birth_date: '1990-01-01',
  first_name: 'JOSIE',
  middle_name: 'SANTOS',
  last_name: 'DELA CRUZ',
  suffix: null,
  gender: 'female',
  nationality: 'Filipino',
  photo: 'https://staging-files.oueg.info/staging/9e2be7f8-9853-43a2-8b8b-a216a3585951.png',
  mobile: '+639090000000',
  address: '1123 RIZAL ST., POBLACION, CITY OF ALAMINOS, PANGASINAN, PHILIPPINES',
  street: '1123 RIZAL ST.',
  barangay: 'POBLACION',
  municipality: 'CITY OF ALAMINOS',
  region: 'REGION I (ILOCOS REGION)',
  province: 'PANGASINAN',
  country: 'Philippines',
  additional_information: {
    health_data: { weight: '55', height: '168', eyes_color: 'Black', complexion: 'WHITE' },
    birth_place: { birth_country: 'Philippines', birth_province: 'PANGASINAN', birth_municipality: 'CITY OF ALAMINOS' },
    other_personal_information: { marital_status: 'Single', religion: 'N/A' },
    mother_details: { mother_maiden_lastname: 'SANTOS', mother_maiden_firstname: 'MARIE', mother_maiden_middlename: 'GARCIA' },
    father_details: { father_lastname: 'N/A', father_firstname: 'N/A' },
    emergency_information: { emergency_name: 'MARK DELA CRUZ', emergency_contact: '+63 9090000010', emergency_relationship: 'Parent' },
    industry: { industry: 'Professional, Scientific and Technical Activities' },
    occupation: { occupation: 'Software And Applications Developers And Analyst Not Elsewhere Classified' },
    expected_salary: { expected_salary: '130,001-180,000' },
    educational_attainment: [{ level: 'Master', school: 'AMA Computer College-Pangasinan', from: '2008', educational_background: 'INFORMATION TECHNOLOGY', to: '2012' }],
  },
  passport: { passport_number: 'PN1234567', place_issued: 'Philippines', issued_date: '2023-08-29', expiry_date: '2030-08-29' },
  national_id: { code: 'XXX001', pcn: '9639954762664080' },
}

function formatName() {
  const parts = [USER_DATA.first_name, USER_DATA.middle_name, USER_DATA.last_name]
  if (USER_DATA.suffix) parts.push(USER_DATA.suffix)
  return parts.map(p => p.charAt(0) + p.slice(1).toLowerCase()).join(' ')
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

function getInitials() {
  return `${USER_DATA.first_name.charAt(0)}${USER_DATA.last_name.charAt(0)}`
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
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [userFields, setUserFields] = useState({
    employment: USER_DATA.additional_information.occupation.occupation,
    monthly_income: `₱${USER_DATA.additional_information.expected_salary.expected_salary}`,
    education: `${USER_DATA.additional_information.educational_attainment[0].level}'s - ${USER_DATA.additional_information.educational_attainment[0].educational_background}`,
    industry: USER_DATA.additional_information.industry.industry,
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
      
      {/* Header */}
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
              {/* Photo */}
              <div className="flex-shrink-0">
                {USER_DATA.photo ? (
                  <img src={USER_DATA.photo} alt={formatName()}
                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 shadow-sm" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#0342EE] text-white flex items-center justify-center text-2xl font-bold border-2 border-slate-100 shadow-sm">
                    {getInitials()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h2 className="text-xl font-bold text-slate-900">{formatName()}</h2>
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-md border border-green-200 text-xs font-semibold w-fit">
                    <ShieldCheck size={13} /> PhilSys Verified
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1.5 capitalize">{USER_DATA.gender} · {USER_DATA.additional_information.other_personal_information.marital_status} · {USER_DATA.nationality}</p>
              </div>
            </div>

            {/* Contact Row */}
            <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-slate-400" />
                </div>
                <span className="truncate">{USER_DATA.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <Phone size={14} className="text-slate-400" />
                </div>
                <span>{USER_DATA.mobile}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-slate-400" />
                </div>
                <span className="truncate">{USER_DATA.municipality}, {USER_DATA.province}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-8">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: RefreshCcw, label: 'Sync Data', desc: 'Refresh from national ID' },
              { icon: Download, label: 'Download', desc: 'Get a PDF copy' },
              { icon: Lock, label: 'Privacy', desc: 'Manage data access' },
            ].map((a, i) => {
              const Icon = a.icon
              return (
                <button key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-[#0342EE] group-hover:text-white transition-all text-slate-500">
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-medium text-slate-600 group-hover:text-[#0342EE] transition-colors">{a.label}</span>
                  <span className="text-[10px] text-slate-400 hidden sm:block">{a.desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Section Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <SectionCard
            icon={<ShieldCheck size={22} />}
            iconColor="bg-green-50 text-green-600"
            title="Verified Identity"
            subtitle="National ID, date of birth, nationality"
            onClick={() => setActiveModal('identity')}
          />
          <SectionCard
            icon={<MapPin size={22} />}
            iconColor="bg-blue-50 text-[#0342EE]"
            title="Address & Location"
            subtitle={`${USER_DATA.municipality}, ${USER_DATA.province}`}
            onClick={() => setActiveModal('address')}
          />
          <SectionCard
            icon={<Heart size={22} />}
            iconColor="bg-rose-50 text-rose-500"
            title="Birth & Health"
            subtitle={`${USER_DATA.additional_information.health_data.height}cm, ${USER_DATA.additional_information.health_data.weight}kg`}
            onClick={() => setActiveModal('health')}
          />
          <SectionCard
            icon={<GraduationCap size={22} />}
            iconColor="bg-violet-50 text-violet-600"
            title="Education"
            subtitle={USER_DATA.additional_information.educational_attainment[0].school}
            onClick={() => setActiveModal('education')}
          />
          <SectionCard
            icon={<Briefcase size={22} />}
            iconColor="bg-amber-50 text-amber-600"
            title="Employment & Industry"
            subtitle={USER_DATA.additional_information.industry.industry}
            onClick={() => setActiveModal('employment')}
          />
          <SectionCard
            icon={<AlertCircle size={22} />}
            iconColor="bg-red-50 text-red-500"
            title="Emergency Contact"
            subtitle={USER_DATA.additional_information.emergency_information.emergency_name}
            onClick={() => setActiveModal('emergency')}
          />
          <SectionCard
            icon={<Globe size={22} />}
            iconColor="bg-sky-50 text-sky-600"
            title="Passport"
            subtitle={`${USER_DATA.passport.passport_number} · Expires ${formatDate(USER_DATA.passport.expiry_date)}`}
            onClick={() => setActiveModal('passport')}
          />
          <SectionCard
            icon={<UserIcon size={22} />}
            iconColor="bg-indigo-50 text-indigo-600"
            title="Self-Reported Info"
            subtitle="Editable profile details for eligibility"
            onClick={() => setActiveModal('self-reported')}
          />
        </div>

        {/* Quick Actions are now inside the profile card above */}
      </div>

      {/* ─── Modals ──────────────────────────────────────────────────────────── */}

      {/* Verified Identity */}
      <Modal open={activeModal === 'identity'} onClose={() => setActiveModal(null)}
        title="Verified Identity" icon={<ShieldCheck size={20} />} iconColor="bg-green-50 text-green-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DataField label="Full Name" value={formatName()} />
          <DataField label="Date of Birth" value={formatDate(USER_DATA.birth_date)} />
          <DataField label="Gender" value={USER_DATA.gender} capitalize />
          <DataField label="Nationality" value={USER_DATA.nationality} />
          <DataField label="Civil Status" value={USER_DATA.additional_information.other_personal_information.marital_status} />
          <DataField label="Religion" value={USER_DATA.additional_information.other_personal_information.religion} />
          <DataField label="PhilSys ID" value={USER_DATA.national_id.code} />
          <DataField label="PCN" value={USER_DATA.national_id.pcn} />
        </div>
      </Modal>

      {/* Address */}
      <Modal open={activeModal === 'address'} onClose={() => setActiveModal(null)}
        title="Address & Location" icon={<MapPin size={20} />} iconColor="bg-blue-50 text-[#0342EE]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DataField label="Street" value={USER_DATA.street} />
          <DataField label="Barangay" value={USER_DATA.barangay} />
          <DataField label="Municipality / City" value={USER_DATA.municipality} />
          <DataField label="Province" value={USER_DATA.province} />
          <DataField label="Region" value={USER_DATA.region} />
          <DataField label="Country" value={USER_DATA.country} />
        </div>
      </Modal>

      {/* Health */}
      <Modal open={activeModal === 'health'} onClose={() => setActiveModal(null)}
        title="Birth & Health" icon={<Heart size={20} />} iconColor="bg-rose-50 text-rose-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DataField label="Birth Country" value={USER_DATA.additional_information.birth_place.birth_country} />
          <DataField label="Birth Province" value={USER_DATA.additional_information.birth_place.birth_province} />
          <DataField label="Birth Municipality" value={USER_DATA.additional_information.birth_place.birth_municipality} />
          <DataField label="Height" value={`${USER_DATA.additional_information.health_data.height} cm`} />
          <DataField label="Weight" value={`${USER_DATA.additional_information.health_data.weight} kg`} />
          <DataField label="Eye Color" value={USER_DATA.additional_information.health_data.eyes_color} />
          <DataField label="Complexion" value={USER_DATA.additional_information.health_data.complexion} capitalize />
        </div>
      </Modal>

      {/* Education */}
      <Modal open={activeModal === 'education'} onClose={() => setActiveModal(null)}
        title="Education" icon={<GraduationCap size={20} />} iconColor="bg-violet-50 text-violet-600">
        {USER_DATA.additional_information.educational_attainment.map((edu, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <div className="text-base font-bold text-slate-900">{edu.level}'s Degree</div>
            <div className="text-sm text-[#0342EE] font-medium mt-1">{edu.educational_background}</div>
            <div className="text-sm text-slate-600 mt-2">{edu.school}</div>
            <div className="text-xs text-slate-400 mt-2 font-medium">{edu.from} – {edu.to}</div>
          </div>
        ))}
      </Modal>

      {/* Employment */}
      <Modal open={activeModal === 'employment'} onClose={() => setActiveModal(null)}
        title="Employment & Industry" icon={<Briefcase size={20} />} iconColor="bg-amber-50 text-amber-600">
        <div className="space-y-5">
          <DataField label="Occupation" value={USER_DATA.additional_information.occupation.occupation} />
          <DataField label="Industry" value={USER_DATA.additional_information.industry.industry} />
          <DataField label="Expected Salary Range" value={`₱${USER_DATA.additional_information.expected_salary.expected_salary}`} />
        </div>
      </Modal>

      {/* Emergency */}
      <Modal open={activeModal === 'emergency'} onClose={() => setActiveModal(null)}
        title="Emergency Contact" icon={<AlertCircle size={20} />} iconColor="bg-red-50 text-red-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DataField label="Contact Name" value={USER_DATA.additional_information.emergency_information.emergency_name} />
          <DataField label="Relationship" value={USER_DATA.additional_information.emergency_information.emergency_relationship} />
          <DataField label="Contact Number" value={USER_DATA.additional_information.emergency_information.emergency_contact} />
        </div>
      </Modal>

      {/* Passport */}
      <Modal open={activeModal === 'passport'} onClose={() => setActiveModal(null)}
        title="Passport" icon={<Globe size={20} />} iconColor="bg-sky-50 text-sky-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DataField label="Passport Number" value={USER_DATA.passport.passport_number} />
          <DataField label="Place Issued" value={USER_DATA.passport.place_issued} />
          <DataField label="Issued Date" value={formatDate(USER_DATA.passport.issued_date)} />
          <DataField label="Expiry Date" value={formatDate(USER_DATA.passport.expiry_date)} />
        </div>
      </Modal>

      {/* Self-Reported */}
      <Modal open={activeModal === 'self-reported'} onClose={() => setActiveModal(null)}
        title="Self-Reported Information" icon={<UserIcon size={20} />} iconColor="bg-indigo-50 text-indigo-600">
        <p className="text-sm text-slate-500 mb-5">Keep this up to date for the most accurate eligibility matches.</p>
        <div className="space-y-1 -mx-2">
          {[
            { id: 'employment', label: 'Occupation' },
            { id: 'monthly_income', label: 'Expected Salary Range' },
            { id: 'education', label: 'Educational Attainment' },
            { id: 'industry', label: 'Industry' },
          ].map((f) => (
            <div key={f.id} className="p-4 rounded-xl group hover:bg-slate-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{f.label}</div>
                  {editing === f.id ? (
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <input className="flex-1 text-sm border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0342EE] transition-colors bg-white"
                        value={editVal} onChange={e => setEditVal(e.target.value)} autoFocus />
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(f.id)} className="text-sm font-medium px-3 py-2 rounded-lg text-white bg-[#0342EE] hover:bg-blue-700 transition-colors">Save</button>
                        <button onClick={() => setEditing(null)} className="text-sm font-medium px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-700 mt-1 font-medium truncate">{userFields[f.id as keyof typeof userFields]}</div>
                  )}
                </div>
                {editing !== f.id && (
                  <button onClick={() => startEdit(f.id, userFields[f.id as keyof typeof userFields])}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-[#0342EE] hover:text-[#0342EE] text-slate-500 transition-all flex-shrink-0">
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
