import { Link, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { icon: '⊞', label: 'Dashboard', href: '/admin/dashboard' },
  { icon: '📦', label: 'Products', href: '/admin/add-product' },
  { icon: '💬', label: 'Inquiries', href: '/admin/inquiries' },
  { icon: '⚙️', label: 'Settings', href: '/admin/settings', active: true },
]

export default function AdminSettingsPage() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 fixed top-0 left-0 h-full">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🎆</span>
          </div>
          <span className="text-gray-900 font-bold text-sm">Bansal Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                item.active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <span className="text-base">🚪</span>
            Logout
          </button>
        </div>
        <div className="px-4 py-4 border-t border-gray-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">A</div>
          <div className="min-w-0">
            <p className="text-gray-900 text-sm font-semibold truncate">Admin User</p>
            <p className="text-gray-400 text-xs">Super Admin</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-56 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <h1 className="text-gray-900 font-bold text-xl">Settings</h1>
          <p className="text-gray-400 text-xs mt-0.5">Manage your admin preferences</p>
        </header>

        <main className="flex-1 px-8 py-8">
          <div className="max-w-xl space-y-6">
            {/* Account */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-gray-900 font-semibold text-base mb-4">Account</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">A</div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">Admin User</p>
                  <p className="text-gray-400 text-xs">Super Admin</p>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-2xl border border-red-100 p-6">
              <h2 className="text-red-600 font-semibold text-base mb-4">Danger Zone</h2>
              <p className="text-gray-500 text-sm mb-4">Logging out will remove your session from this browser.</p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors border border-red-200"
              >
                <span>🚪</span> Logout
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-gray-900 font-semibold text-base mb-2">More Settings</h2>
              <p className="text-gray-400 text-sm">Additional configuration options will be available here.</p>
              <span className="mt-3 inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-medium px-3 py-1.5 rounded-full">
                Coming Soon
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
