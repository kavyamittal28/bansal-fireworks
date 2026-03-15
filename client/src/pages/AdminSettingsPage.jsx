import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

export default function AdminSettingsPage() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <AdminLayout
      activeHref="/admin/settings"
      headerTitle="Settings"
      headerSubtitle="Manage your admin preferences"
    >
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
    </AdminLayout>
  )
}
