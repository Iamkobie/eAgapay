import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import type { Page } from './types'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TopNav } from './components/TopNav'
import { ChatWidget } from './components/ChatWidget'
import { LoginScreen } from './screens/LoginScreen'
import { CategoriesScreen } from './screens/CategoriesScreen'
import { DashboardScreen } from './screens/DashboardScreen'
import { ProgramsScreen } from './screens/ProgramsScreen'
import { PlaceholderScreen } from './screens/PlaceholderScreen'
import { SSOCallbackScreen } from './screens/SSOCallbackScreen'

// ─── Inner App (has access to AuthContext and Router) ─────────────────────────
function AppInner() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState<Page>('categories')
  const [selectedCategory, setSelectedCategory] = useState<string>('employment')
  const [naturalQuery, setNaturalQuery] = useState<string>('')

  function navigatePage(p: Page) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  function handleCategorySelect(cat: string, query?: string) {
    setSelectedCategory(cat)
    setNaturalQuery(query ?? '')
    navigatePage('form')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-sm">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-slate-900 font-sans antialiased selection:bg-blue-200">
      <Routes>
        {/* SSO callback — receives tokens from our Express backend */}
        <Route path="/sso/callback" element={<SSOCallbackScreen />} />

        {/* Login page — shown when not authenticated */}
        <Route path="/" element={
          user ? <Navigate to="/app" replace /> : <LoginScreen />
        } />

        {/* Protected app routes */}
        <Route path="/app/*" element={
          !user ? <Navigate to="/" replace /> : (
            <>
              <TopNav page={page} onNavigate={navigatePage} onLogout={handleLogout} />
              {page === 'categories' && <CategoriesScreen onSelect={handleCategorySelect} />}
              {page === 'form' && <ProgramsScreen category={selectedCategory} naturalQuery={naturalQuery} onBack={() => navigatePage('categories')} />}
              {page === 'results' && <PlaceholderScreen title="Results" onBack={() => navigatePage('categories')} />}
              {page === 'detail' && <PlaceholderScreen title="Program Details" onBack={() => navigatePage('results')} />}
              {page === 'dashboard' && <DashboardScreen />}
              <ChatWidget />
            </>
          )
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  )
}
