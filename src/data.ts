import {
  GraduationCap,
  Stethoscope,
  Briefcase,
  Banknote,
  Home,
  TrendingUp,
  Sprout,
  Users,
  Accessibility,
  Siren,
} from 'lucide-react'

export const USER = {
  name: 'Josie Dela Cruz',
  initials: 'JD',
  province: 'Pangasinan, Region I',
  dateOfBirth: 'January 1, 1990',
  sex: 'Female',
  civilStatus: 'Single',
  citizenship: 'Filipino',
  philsysId: 'XXX001',
}

export const CATEGORIES = [
  { id: 'education', label: 'Education', icon: GraduationCap, desc: 'Scholarships, subsidies, and educational assistance' },
  { id: 'healthcare', label: 'Healthcare', icon: Stethoscope, desc: 'Health insurance, medical assistance, and wellness' },
  { id: 'employment', label: 'Employment', icon: Briefcase, desc: 'Job placement, skills training, and emergency employment' },
  { id: 'financial', label: 'Financial Assistance', icon: Banknote, desc: 'Cash transfers, subsidies, and livelihood support' },
  { id: 'housing', label: 'Housing', icon: Home, desc: 'Socialized housing, home loans, and shelter assistance' },
  { id: 'business', label: 'Business', icon: TrendingUp, desc: 'Microfinancing, MSME support, and business registration' },
  { id: 'agriculture', label: 'Agriculture', icon: Sprout, desc: 'Farmer support, seeds, equipment, and agricultural financing' },
  { id: 'senior', label: 'Senior Citizens', icon: Users, desc: 'Social pension, healthcare, and senior privilege programs' },
  { id: 'pwd', label: 'PWD', icon: Accessibility, desc: 'Disability benefits, assistive devices, and employment help' },
  { id: 'disaster', label: 'Disaster Assistance', icon: Siren, desc: 'Relief, financial aid, and livelihood recovery programs' },
]
