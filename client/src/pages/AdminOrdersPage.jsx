import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }) +
    ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })
}

const PAYMENT_STATUS = {
  pending_confirmation: { label: 'Payment Uploaded', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  confirmed: { label: 'Payment Approved', color: 'bg-green-100 text-green-700 border-green-200' },
  rejected: { label: 'Payment Rejected', color: 'bg-red-100 text-red-700 border-red-200' },
}

const ORDER_STATUS = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  acknowledged: { label: 'Acknowledged', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
}

const FULFILLMENT = {
  delivered: { label: '🚚 Delivered', color: 'bg-green-100 text-green-700 border-green-200' },
  picked_up: { label: '🏪 Picked Up', color: 'bg-purple-100 text-purple-700 border-purple-200' },
}

function DeleteConfirmModal({ order, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-gray-900 font-bold text-lg mb-1">Delete Order?</h3>
          <p className="text-gray-500 text-sm">
            This will permanently delete the order for <span className="font-semibold text-gray-700">{order.name}</span>.
            {order.order_number && <> (#{order.order_number})</>} This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [actionLoading, setActionLoading] = useState(null) // orderId being acted on
  const [deleteTarget, setDeleteTarget] = useState(null) // order to confirm delete

  const token = localStorage.getItem('adminToken')

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    try {
      const res = await fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error()
      setOrders(await res.json())
    } catch {
      setError('Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }

  async function apiPatch(url) {
    const res = await fetch(url, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error()
    return res.json()
  }

  async function handleApprove(id) {
    setActionLoading(id + '_approve')
    try {
      const updated = await apiPatch(`/api/admin/confirm-payment/${id}`)
      setOrders(prev => prev.map(o => o.id === id ? updated : o))
    } catch { /* silent */ } finally { setActionLoading(null) }
  }

  async function handleReject(id) {
    setActionLoading(id + '_reject')
    try {
      const updated = await apiPatch(`/api/admin/reject-payment/${id}`)
      setOrders(prev => prev.map(o => o.id === id ? updated : o))
    } catch { /* silent */ } finally { setActionLoading(null) }
  }

  async function handleDelete(id) {
    try {
      await fetch(`/api/admin/delete-order/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      setOrders(prev => prev.filter(o => o.id !== id))
    } catch { /* silent */ } finally {
      setDeleteTarget(null)
    }
  }

  async function handleStatusChange(id, status) {
    try {
      const res = await fetch(`/api/admin/update-order-status/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setOrders(prev => prev.map(o => o.id === id ? updated : o))
    } catch { /* silent */ }
  }

  async function handleFulfill(id, fulfillment_type) {
    setActionLoading(id + '_' + fulfillment_type)
    try {
      const res = await fetch(`/api/admin/update-order-status/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed', fulfillment_type }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setOrders(prev => prev.map(o => o.id === id ? updated : o))
    } catch { /* silent */ } finally { setActionLoading(null) }
  }

  const awaitingCount = orders.filter(o => o.payment_status === 'pending_confirmation').length

  if (loading) return (
    <AdminLayout activeHref="/admin/orders" headerTitle="Orders" headerSubtitle="Customer orders from the cart">
      <div className="flex items-center justify-center py-20">
        <span className="inline-block w-6 h-6 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    </AdminLayout>
  )

  if (error) return (
    <AdminLayout activeHref="/admin/orders" headerTitle="Orders" headerSubtitle="Customer orders from the cart">
      <div className="text-center py-20 text-red-500 text-sm">{error}</div>
    </AdminLayout>
  )

  return (
    <>
    {deleteTarget && (
      <DeleteConfirmModal
        order={deleteTarget}
        onConfirm={() => handleDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    )}
    <AdminLayout
      activeHref="/admin/orders"
      headerTitle="Orders"
      headerSubtitle="Customer orders from the cart"
      headerRight={
        <div className="flex items-center gap-2">
          {awaitingCount > 0 && (
            <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-200">
              {awaitingCount} awaiting approval
            </span>
          )}
          <span className="text-gray-400 text-sm">{orders.length} total</span>
        </div>
      }
    >
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-4">📦</div>
          <h2 className="text-gray-900 font-bold text-xl mb-2">No Orders Yet</h2>
          <p className="text-gray-400 text-sm max-w-xs">Orders placed by customers through the cart will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(order => {
            const isExpanded = expandedId === order.id
            const paymentMeta = PAYMENT_STATUS[order.payment_status]
            const orderMeta = ORDER_STATUS[order.status] || ORDER_STATUS.pending
            const needsApproval = order.payment_status === 'pending_confirmation'

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                  needsApproval ? 'border-orange-300 shadow-sm shadow-orange-100' : 'border-gray-200'
                }`}
              >
                {/* Top bar — approval prompt */}
                {order.payment_status === 'confirmed' && order.status === 'acknowledged' && (
                  <div className="bg-blue-50 border-b border-blue-200 px-5 py-2.5 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-blue-700 text-sm font-medium">
                      <span>Payment approved — mark how this order was fulfilled:</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleFulfill(order.id, 'delivered')}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {actionLoading === order.id + '_delivered'
                          ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : '🚚'} Delivered
                      </button>
                      <button
                        onClick={() => handleFulfill(order.id, 'picked_up')}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {actionLoading === order.id + '_picked_up'
                          ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : '🏪'} Picked Up
                      </button>
                    </div>
                  </div>
                )}

                {needsApproval && (
                  <div className="bg-orange-50 border-b border-orange-200 px-5 py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-orange-700 text-sm font-medium">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse flex-shrink-0" />
                      Payment screenshot uploaded — awaiting your approval
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(order.id)}
                        disabled={actionLoading === order.id + '_approve'}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {actionLoading === order.id + '_approve'
                          ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : '✓'} Approve
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        disabled={actionLoading === order.id + '_reject'}
                        className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {actionLoading === order.id + '_reject'
                          ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : '✕'} Reject
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                    {/* Left: customer + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-gray-900 font-bold text-base">{order.name}</h3>
                        <span className="text-gray-300">·</span>
                        <a href={`tel:${order.phone}`} className="text-blue-600 text-sm hover:underline font-medium">
                          {order.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${orderMeta.color}`}>
                          {orderMeta.label}
                        </span>
                        {paymentMeta && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${paymentMeta.color}`}>
                            {paymentMeta.label}
                          </span>
                        )}
                        {order.fulfillment_type && FULFILLMENT[order.fulfillment_type] && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${FULFILLMENT[order.fulfillment_type].color}`}>
                            {FULFILLMENT[order.fulfillment_type].label}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-400 text-[10px] mb-0.5">Amount</p>
                          <p className="text-gray-900 font-bold text-sm">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-400 text-[10px] mb-0.5">Pieces</p>
                          <p className="text-gray-900 font-bold text-sm">{order.total_pieces?.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-400 text-[10px] mb-0.5">Items</p>
                          <p className="text-gray-900 font-bold text-sm">{order.items?.length}</p>
                        </div>
                      </div>

                      <p className="text-gray-400 text-xs">{formatDate(order.created_at)}</p>
                    </div>

                    {/* Right: screenshot */}
                    {order.payment_screenshot_url && (
                      <div className="flex-shrink-0">
                        <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wide mb-1.5">Payment Screenshot</p>
                        <a href={order.payment_screenshot_url} target="_blank" rel="noreferrer">
                          <img
                            src={order.payment_screenshot_url}
                            alt="Payment screenshot"
                            className="w-36 h-44 object-cover rounded-xl border border-gray-200 hover:opacity-90 transition-opacity cursor-zoom-in"
                          />
                        </a>
                        <p className="text-gray-400 text-[10px] mt-1 text-center">Click to enlarge</p>
                      </div>
                    )}
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                        className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {isExpanded ? 'Hide items' : `View ${order.items?.length} item${order.items?.length !== 1 ? 's' : ''}`}
                      </button>
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="acknowledged">Acknowledged</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(order)}
                      className="text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Delete Order
                    </button>
                  </div>
                </div>

                {/* Expanded items */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => {
                        const isCase = item.type === 'cases'
                        const lineTotal = isCase && item.case_to_piece_qty
                          ? item.price * item.case_to_piece_qty * item.qty
                          : item.price * item.qty
                        return (
                          <div key={idx} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                              {item.thumbnail
                                ? <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                                : <span className="text-gray-300 text-lg">🎆</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 text-sm font-medium truncate">{item.name}</p>
                              <p className="text-gray-400 text-xs">
                                {item.qty} {isCase ? `case${item.qty !== 1 ? 's' : ''}` : `pc${item.qty !== 1 ? 's' : ''}`}
                                {isCase && item.case_to_piece_qty && ` × ${item.case_to_piece_qty} pcs`}
                                {' · '}₹{Number(item.price).toLocaleString('en-IN')}/pc
                              </p>
                            </div>
                            <div className="text-gray-900 text-sm font-bold flex-shrink-0">
                              ₹{lineTotal.toLocaleString('en-IN')}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                      <span>Order Total</span>
                      <span>₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </AdminLayout>
    </>
  )
}
