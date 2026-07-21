import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { PhSunIcon } from '../components/PhSunIcon'

/**
 * Handles the redirect from our eGov SSO backend.
 *
 * The backend redirects here with:
 *   /sso/callback?access_token=xxx&refresh_token=yyy
 *
 * We call supabase.setSession() to log the user in, then navigate to /categories.
 */
export function SSOCallbackScreen() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function handleCallback() {
      const accessToken  = searchParams.get('access_token')
      const refreshToken = searchParams.get('refresh_token')
      const errorParam   = searchParams.get('error')

      if (errorParam) {
        setError(`Authentication failed: ${errorParam} (code: ${searchParams.get('code') ?? 'unknown'})`)
        return
      }

      if (!accessToken || !refreshToken) {
        setError('Invalid callback — missing tokens.')
        return
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token:  accessToken,
        refresh_token: refreshToken,
      })

      if (sessionError) {
        setError(`Session error: ${sessionError.message}`)
        return
      }

      // Session is set — navigate to the app
      navigate('/app', { replace: true })
    }

    handleCallback()
  }, [searchParams, navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✕</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Login Failed</h2>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full bg-[#0342EE] text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="bg-[#0342EE] p-3 rounded-2xl inline-flex mb-6 shadow-lg animate-pulse">
          <PhSunIcon size={40} color="#fff" />
        </div>
        <p className="text-slate-600 font-medium">Completing sign-in…</p>
        <p className="text-slate-400 text-sm mt-1">Please wait a moment.</p>
      </div>
    </div>
  )
}
