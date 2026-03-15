import AdminLayout from '../components/AdminLayout'

export default function AdminInquiriesPage() {
  return (
    <AdminLayout
      activeHref="/admin/inquiries"
      headerTitle="Inquiries"
      headerSubtitle="Customer contact form submissions"
    >
      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-4">💬</div>
        <h2 className="text-gray-900 font-bold text-xl mb-2">No Inquiries Yet</h2>
        <p className="text-gray-400 text-sm max-w-xs">
          Customer inquiries submitted via the contact form will appear here once the feature is connected to the backend.
        </p>
        <span className="mt-4 inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-medium px-3 py-1.5 rounded-full">
          Coming Soon
        </span>
      </div>
    </AdminLayout>
  )
}
