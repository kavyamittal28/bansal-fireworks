import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = localStorage.getItem('adminToken')

  async function fetchInquiries() {
    try {
      const res = await fetch('/api/get-inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setInquiries(data)
    } catch {
      setError('Failed to load inquiries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchInquiries() }, [])

  async function handleToggleRead(id) {
    try {
      const res = await fetch(`/api/toggle-inquiry/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setInquiries(prev => prev.map(inq => inq.id === id ? updated : inq))
    } catch {
      // silently fail
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this inquiry permanently?')) return
    try {
      const res = await fetch(`/api/delete-inquiry/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      setInquiries(prev => prev.filter(inq => inq.id !== id))
    } catch {
      // silently fail
    }
  }

  if (loading) {
    return (
      <AdminLayout activeHref="/admin/inquiries" headerTitle="Inquiries" headerSubtitle="Customer contact form submissions">
        <div className="flex items-center justify-center py-20">
          <span className="inline-block w-6 h-6 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout activeHref="/admin/inquiries" headerTitle="Inquiries" headerSubtitle="Customer contact form submissions">
        <div className="text-center py-20 text-red-500 text-sm">{error}</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      activeHref="/admin/inquiries"
      headerTitle="Inquiries"
      headerSubtitle="Customer contact form submissions"
      headerRight={
        <span className="text-gray-400 text-sm">{inquiries.length} total</span>
      }
    >
      {inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-4">💬</div>
          <h2 className="text-gray-900 font-bold text-xl mb-2">No Inquiries Yet</h2>
          <p className="text-gray-400 text-sm max-w-xs">
            Customer inquiries submitted via the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map(inq => (
            <div
              key={inq.id}
              className={`bg-white border rounded-xl p-4 sm:p-5 transition-colors ${
                inq.is_read ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!inq.is_read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                    <h3 className="text-gray-900 font-semibold text-sm truncate">{inq.name}</h3>
                    <span className="text-gray-300 text-xs">|</span>
                    <a href={`tel:${inq.phone}`} className="text-blue-600 text-sm hover:underline flex-shrink-0">
                      {inq.phone}
                    </a>
                  </div>
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-md mb-2">
                    {inq.requirement}
                  </span>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{inq.message}</p>
                  <p className="text-gray-400 text-xs mt-2">{formatDate(inq.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleRead(inq.id)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      inq.is_read
                        ? 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                        : 'text-blue-600 bg-blue-100 hover:bg-blue-200'
                    }`}
                  >
                    {inq.is_read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => handleDelete(inq.id)}
                    className="text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
