import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { icon: '⊞', label: 'Dashboard', href: '/admin/dashboard' },
  { icon: '📦', label: 'Products', href: '/admin/add-product' },
  { icon: '🏷️', label: 'Catalog', href: '/admin/catalog' },
  { icon: '💬', label: 'Inquiries', href: '/admin/inquiries' },
  { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
]

function Sidebar({ activeHref, onClose }) {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">🎆</span>
          </div>
          <span className="text-gray-900 font-bold text-sm">Bansal Admin</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600 p-1">✕</button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.label}
            to={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeHref === item.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <span className="text-base">🚪</span>
          Logout
        </button>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-200 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">A</div>
        <div className="min-w-0">
          <p className="text-gray-900 text-sm font-semibold truncate">Admin User</p>
          <p className="text-gray-400 text-xs">Super Admin</p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ activeHref, headerTitle, headerSubtitle, headerRight, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-56 bg-white border-r border-gray-200 flex-shrink-0 fixed top-0 left-0 h-full">
        <Sidebar activeHref={activeHref} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute top-0 left-0 bottom-0 w-64 bg-white shadow-xl flex flex-col">
            <Sidebar activeHref={activeHref} onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-56 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className="text-gray-900 font-bold text-lg sm:text-xl truncate">{headerTitle}</h1>
              {headerSubtitle && <p className="text-gray-400 text-xs mt-0.5 hidden sm:block">{headerSubtitle}</p>}
            </div>
          </div>
          {headerRight && <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">{headerRight}</div>}
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
