import { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EgovProfile {
  uniqid?: string
  first_name?: string
  middle_name?: string
  last_name?: string
  suffix?: string | null
  birth_date?: string
  gender?: string
  nationality?: string
  mobile?: string
  photo?: string
  address?: string
  street?: string
  barangay?: string
  municipality?: string
  region?: string
  province?: string
  country?: string
  country_alpha_2_code?: string
  country_alpha_3_code?: string
  postal?: string | null
  address_line_2?: string | null
  barangay_code?: string
  province_code?: string
  municipality_code?: string
  region_code?: string
  country_id?: number
  foreign_address?: string | null
  signature_url?: string | null
  passport?: {
    first_name?: string
    middle_name?: string
    last_name?: string
    suffix?: string | null
    gender?: string
    birth_date?: string
    passport_number?: string
    place_issued?: string
    issued_date?: string
    expiry_date?: string
  } | null
  national_id?: {
    code?: string
    pcn?: string
    face_url?: string
  } | null
  tin_id?: unknown | null
  additional_information?: {
    health_data?: { weight?: string; height?: string; eyes_color?: string; complexion?: string }
    birth_place?: { birth_country?: string; birth_province?: string; birth_municipality?: string }
    other_personal_information?: { marital_status?: string; religion?: string }
    mother_details?: { mother_maiden_lastname?: string; mother_maiden_firstname?: string; mother_maiden_middlename?: string; mother_birthdate?: string }
    father_details?: { father_lastname?: string; father_firstname?: string; father_birthdate?: string }
    emergency_information?: { emergency_name?: string; emergency_contact?: string; emergency_relationship?: string }
    industry?: { industry?: string }
    occupation?: { occupation?: string }
    expected_salary?: { expected_salary?: string }
    educational_attainment?: Array<{ level?: string; school?: string; from?: string; to?: string; educational_background?: string }>
  }
  last_login_at?: string
}

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: EgovProfile
  loading: boolean
  logout: () => Promise<void>
  displayName: string
  initials: string
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<EgovProfile>({})
  const [loading, setLoading] = useState(true)

  /**
   * Loads the eGov profile from public.user_metadata for the given user_id.
   * Tries Supabase direct first, then backend API, then sessionStorage cache.
   */
  async function loadProfile(userId: string) {
    // Try 1: Direct Supabase query (works if RLS allows)
    const { data, error } = await supabase
      .from('user_metadata')
      .select('value')
      .eq('user_id', userId)
      .maybeSingle()

    if (!error && data?.value) {
      setProfile(data.value as EgovProfile)
      sessionStorage.removeItem('egov_profile_cache')
      return
    }

    // Try 2: Backend API (bypasses RLS with service role)
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
    try {
      const res = await fetch(`${apiUrl}/api/auth/profile?user_id=${userId}`)
      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          setProfile(json.data as EgovProfile)
          sessionStorage.removeItem('egov_profile_cache')
          return
        }
      }
    } catch {
      // Backend unavailable, continue to cache
    }

    // Try 3: SessionStorage cache from login response
    const cached = sessionStorage.getItem('egov_profile_cache')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        const mapped: EgovProfile = {
          uniqid: parsed.uniqid,
          first_name: parsed.firstName,
          middle_name: parsed.middleName,
          last_name: parsed.lastName,
          suffix: parsed.suffix,
          birth_date: parsed.birthDate,
          gender: parsed.gender,
          nationality: parsed.nationality,
          mobile: parsed.mobile,
          photo: parsed.photo,
          address: parsed.address,
          street: parsed.street,
          barangay: parsed.barangay,
          municipality: parsed.municipality,
          region: parsed.region,
          province: parsed.province,
          country: parsed.country,
          country_alpha_2_code: parsed.countryAlpha2Code,
          country_alpha_3_code: parsed.countryAlpha3Code,
          postal: parsed.postal,
          address_line_2: parsed.addressLine2,
          barangay_code: parsed.barangayCode,
          province_code: parsed.provinceCode,
          municipality_code: parsed.municipalityCode,
          region_code: parsed.regionCode,
          country_id: parsed.countryId,
          foreign_address: parsed.foreignAddress,
          signature_url: parsed.signatureUrl,
          passport: parsed.passport,
          national_id: parsed.nationalId,
          tin_id: parsed.tinId,
          additional_information: parsed.additionalInformation,
          last_login_at: parsed.lastLoginAt,
        }
        setProfile(mapped)
      } catch {
        // Invalid cache
      }
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session?.user) {
        await loadProfile(data.session.user.id)
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile({})
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    setProfile({})
  }

  const displayName = [profile.first_name, profile.middle_name, profile.last_name]
    .filter(Boolean)
    .map(p => p!.charAt(0).toUpperCase() + p!.slice(1).toLowerCase())
    .join(' ') || user?.email || 'User'

  const initials = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .map(p => p!.charAt(0).toUpperCase())
    .join('') || 'U'

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, logout, displayName, initials }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
