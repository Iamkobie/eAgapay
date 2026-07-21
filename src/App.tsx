import { useState } from 'react'
import type { Page } from './types'
import { TopNav } from './components/TopNav'
import { ChatWidget } from './components/ChatWidget'
import { LoginScreen } from './screens/LoginScreen'
import { CategoriesScreen } from './screens/CategoriesScreen'
import { DashboardScreen } from './screens/DashboardScreen'
import { PlaceholderScreen } from './screens/PlaceholderScreen'

export default function App() {
  const [page, setPage] = useState<Page>('login')
  const [loggedIn, setLoggedIn] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('employment')

  function navigate(p: Page) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleLogin() { setLoggedIn(true); navigate('categories') }
  function handleLogout() { setLoggedIn(false); navigate('login') }
  function handleCategorySelect(cat: string) { setSelectedCategory(cat); navigate('form') }

  return (
    <div className="min-h-screen text-slate-900 font-sans antialiased selection:bg-blue-200">
      {loggedIn && <TopNav page={page} onNavigate={navigate} onLogout={handleLogout} />}

      {page === 'login' && <LoginScreen onLogin={handleLogin} />}
      {page === 'categories' && <CategoriesScreen onSelect={handleCategorySelect} />}
      {page === 'form' && <PlaceholderScreen title="Adaptive Form Redesign Skipped" onBack={() => navigate('categories')} />}
      {page === 'results' && <PlaceholderScreen title="Results Page Redesign Skipped" onBack={() => navigate('categories')} />}
      {page === 'detail' && <PlaceholderScreen title="Detail Page Redesign Skipped" onBack={() => navigate('categories')} />}
      {page === 'dashboard' && <DashboardScreen />}

      {loggedIn && <ChatWidget />}
    </div>
  )
}
