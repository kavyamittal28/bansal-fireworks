import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { icon: '⊞', label: 'Dashboard', href: '/admin/dashboard', active: true },
  { icon: '📦', label: 'Products', href: '/admin/add-product' },
  { icon: '💬', label: 'Inquiries', href: '/admin/inquiries' },
  { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
]

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ products: null, loading: true })

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setStats({ products: Array.isArray(data) ? data.length : 0, loading: false }))
      .catch(() => setStats({ products: 0, loading: false }))
  }, [])

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
          <h1 className="text-gray-900 font-bold text-xl">Dashboard</h1>
          <p className="text-gray-400 text-xs mt-0.5">Overview of your store</p>
        </header>

        <main className="flex-1 px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-gray-400 text-sm mb-1">Total Products</p>
              <p className="text-gray-900 text-3xl font-bold">
                {stats.loading ? '…' : stats.products}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-gray-400 text-sm mb-1">Inquiries</p>
              <p className="text-gray-900 text-3xl font-bold">—</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className="text-green-600 text-3xl font-bold">Live</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-gray-900 font-semibold text-base mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/add-product"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <span>📦</span> Add Product
              </Link>
              <Link
                to="/admin/inquiries"
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <span>💬</span> View Inquiries
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
