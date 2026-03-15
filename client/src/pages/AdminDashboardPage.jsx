import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import ConfirmModal from '../components/ConfirmModal'

export default function AdminDashboardPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [confirmProduct, setConfirmProduct] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updateMsg, setUpdateMsg] = useState(searchParams.get('updated') === '1')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch('/api/admin/get-products', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  useEffect(() => {
    if (updateMsg) {
      const t = setTimeout(() => setUpdateMsg(false), 4000)
      return () => clearTimeout(t)
    }
  }, [updateMsg])

  async function handleToggle(product) {
    setToggling(product.id)
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`/api/admin/toggle-product/${product.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
    } catch {
      // silent
    } finally {
      setToggling(null)
    }
  }

  async function handleDelete() {
    if (!confirmProduct) return
    setDeleting(confirmProduct.id)
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`/api/delete-product/${confirmProduct.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok && res.status !== 204) throw new Error()
      setProducts(prev => prev.filter(p => p.id !== confirmProduct.id))
    } catch {
      // silent
    } finally {
      setDeleting(null)
      setConfirmProduct(null)
    }
  }

  const filtered = products.filter(p => {
    if (filter === 'active' && !p.is_active) return false
    if (filter === 'inactive' && p.is_active) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const activeCount = products.filter(p => p.is_active).length
  const inactiveCount = products.length - activeCount

  return (
    <>
      {confirmProduct && (
        <ConfirmModal
          title="Delete product?"
          message={`"${confirmProduct.name}" will be permanently deleted along with all its images. This cannot be undone.`}
          confirmLabel="Delete"
          loading={deleting === confirmProduct.id}
          onConfirm={handleDelete}
          onCancel={() => setConfirmProduct(null)}
        />
      )}
      <AdminLayout
        activeHref="/admin/dashboard"
        headerTitle="Dashboard"
        headerSubtitle="Overview of your store"
      >
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Total</p>
            <p className="text-gray-900 text-2xl sm:text-3xl font-bold">{loading ? '…' : products.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Active</p>
            <p className="text-green-600 text-2xl sm:text-3xl font-bold">{loading ? '…' : activeCount}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Inactive</p>
            <p className="text-gray-400 text-2xl sm:text-3xl font-bold">{loading ? '…' : inactiveCount}</p>
          </div>
        </div>

        {updateMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
            ✅ Product updated successfully!
          </div>
        )}

        {/* Products table */}
        <div className="bg-white rounded-2xl border border-gray-200">
          {/* Table toolbar */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <h2 className="text-gray-900 font-semibold text-base">All Products</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-36 sm:w-44"
              />
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm font-medium">
                {[['all', 'All'], ['active', 'Active'], ['inactive', 'Inactive']].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setFilter(val)}
                    className={`px-2.5 sm:px-3 py-1.5 transition-colors ${filter === val ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Link
                to="/admin/add-product"
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap"
              >
                + Add
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-gray-400 text-sm">Loading products…</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-400 text-sm">No products found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs border-b border-gray-100">
                    <th className="text-left px-4 sm:px-6 py-3 font-medium">Product</th>
                    <th className="text-left px-3 py-3 font-medium hidden sm:table-cell">Category</th>
                    <th className="text-left px-3 py-3 font-medium hidden md:table-cell">Brand</th>
                    <th className="text-right px-3 py-3 font-medium">Price</th>
                    <th className="text-right px-3 py-3 font-medium hidden sm:table-cell">Stock</th>
                    <th className="text-center px-3 py-3 font-medium">Status</th>
                    <th className="text-center px-3 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.media?.[0]?.url ? (
                              <img src={product.media[0].url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-base">🎆</div>
                            )}
                          </div>
                          <span className="text-gray-900 font-medium truncate max-w-[120px] sm:max-w-[180px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-500 hidden sm:table-cell">{product.category || '—'}</td>
                      <td className="px-3 py-3 text-gray-500 hidden md:table-cell">{product.brand || '—'}</td>
                      <td className="px-3 py-3 text-right text-gray-900 font-medium whitespace-nowrap">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                        {product.market_price && (
                          <span className="block text-xs text-gray-400 line-through">₹{Number(product.market_price).toLocaleString('en-IN')}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right text-gray-500 hidden sm:table-cell">
                        {product.stock != null ? product.stock : '—'}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => handleToggle(product)}
                          disabled={toggling === product.id}
                          className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all disabled:opacity-50 ${
                            product.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-600'
                              : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600'
                          }`}
                          title={product.is_active ? 'Click to deactivate' : 'Click to activate'}
                        >
                          {toggling === product.id ? (
                            <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                          )}
                          {product.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <Link
                            to={`/admin/edit-product/${product.id}`}
                            className="px-2 sm:px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setConfirmProduct(product)}
                            disabled={deleting === product.id}
                            className="px-2 sm:px-3 py-1 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleting === product.id
                              ? <span className="inline-block w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                              : 'Delete'
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && (
            <div className="px-4 sm:px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
              Showing {filtered.length} of {products.length} products
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  )
}
