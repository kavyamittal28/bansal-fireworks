import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function CartItem({ item, onUpdateQty, onRemove }) {
  const isCase = item.type === 'cases'
  const caseInfo = isCase && item.case_to_piece_qty ? `1 case = ${item.case_to_piece_qty} pcs` : null
  const lineTotal = isCase && item.case_to_piece_qty
    ? item.price * item.case_to_piece_qty * item.qty
    : item.price * item.qty

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4">
      {/* Thumbnail */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-gray-900 font-semibold text-sm leading-snug truncate">{item.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isCase ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {isCase ? 'CASE' : 'PIECES'}
              </span>
              {caseInfo && <span className="text-[10px] text-gray-400">{caseInfo}</span>}
            </div>
          </div>
          <button
            onClick={() => onRemove(item.productId, item.type)}
            className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 p-0.5"
            aria-label="Remove item"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          {/* Qty stepper */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onUpdateQty(item.productId, item.type, item.qty - 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-bold text-base"
              aria-label="Decrease quantity"
            >−</button>
            <span className="w-8 text-center text-gray-900 text-sm font-medium">{item.qty}</span>
            <button
              onClick={() => onUpdateQty(item.productId, item.type, item.qty + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-bold text-base"
              aria-label="Increase quantity"
            >+</button>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-gray-400 text-xs">
              ₹{Number(item.price).toLocaleString('en-IN')} / pc
              {isCase && item.case_to_piece_qty && ` × ${item.case_to_piece_qty}`}
            </div>
            <div className="text-gray-900 font-bold text-sm">₹{lineTotal.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const HARDCODED_OTP = '292001'

function PlaceOrderModal({ grandTotal, totalPieces, cart, onClose, onSuccess }) {
  const [step, setStep] = useState(1) // 1 = details, 2 = OTP
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(null)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [sendOtpError, setSendOtpError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSendOtp(e) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setSendingOtp(true)
    setSendOtpError(null)
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      })
      if (!res.ok) throw new Error('Failed to send OTP')
      setStep(2)
    } catch {
      setSendOtpError('Could not send OTP. Please try again.')
    } finally {
      setSendingOtp(false)
    }
  }

  async function handleVerifyAndOrder(e) {
    e.preventDefault()
    setOtpError(null)
    if (otp.trim() !== HARDCODED_OTP) {
      setOtpError('Incorrect OTP. Please try again.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            type: item.type,
            qty: item.qty,
            case_to_piece_qty: item.case_to_piece_qty || null,
            thumbnail: item.thumbnail || null,
          })),
          total_amount: grandTotal,
          total_pieces: totalPieces,
        }),
      })
      if (!res.ok) throw new Error('Failed to place order')
      const order = await res.json()
      onSuccess(order.id)
    } catch {
      setError('Could not place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 text-lg">✕</button>

        {step === 1 ? (
          <>
            <h2 className="text-gray-900 font-bold text-lg mb-1">Confirm Your Order</h2>
            <p className="text-gray-500 text-sm mb-5">
              {cart.length} item{cart.length !== 1 ? 's' : ''} · {totalPieces.toLocaleString('en-IN')} pcs · ₹{grandTotal.toLocaleString('en-IN')}
            </p>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {sendOtpError && <p className="text-red-500 text-sm">{sendOtpError}</p>}
              <button
                type="submit"
                disabled={!name.trim() || !phone.trim() || sendingOtp}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                {sendingOtp ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Send OTP'}
              </button>
            </form>
          </>
        ) : (
          <>
            <button
              onClick={() => { setStep(1); setOtp(''); setOtpError(null) }}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm mb-4 transition-colors"
            >
              ← Back
            </button>
            <h2 className="text-gray-900 font-bold text-lg mb-1">Verify Your Phone</h2>
            <p className="text-gray-500 text-sm mb-5">
              Enter the OTP sent to <span className="font-medium text-gray-700">{phone}</span>
            </p>
            <form onSubmit={handleVerifyAndOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => { setOtp(e.target.value); setOtpError(null) }}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                  autoFocus
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-900 tracking-widest text-center font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    otpError ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {otpError && <p className="text-red-500 text-xs mt-1">{otpError}</p>}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : '📦 Place Order'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart()
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const grandTotal = cart.reduce((sum, item) => {
    const isCase = item.type === 'cases'
    return sum + (isCase && item.case_to_piece_qty
      ? item.price * item.case_to_piece_qty * item.qty
      : item.price * item.qty)
  }, 0)

  const totalPieces = cart.reduce((sum, item) => {
    if (item.type === 'cases' && item.case_to_piece_qty) return sum + item.case_to_piece_qty * item.qty
    return sum + item.qty
  }, 0)

  function handleOrderSuccess(orderId) {
    clearCart()
    navigate(`/order/payment/${orderId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showModal && (
        <PlaceOrderModal
          grandTotal={grandTotal}
          totalPieces={totalPieces}
          cart={cart}
          onClose={() => setShowModal(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Cart</h1>
            <p className="text-gray-500 text-sm mt-1">
              {cart.length === 0
                ? 'Your cart is empty.'
                : `${cart.length} item${cart.length !== 1 ? 's' : ''} · ${totalPieces.toLocaleString('en-IN')} total pieces`}
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              Clear cart
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-gray-900 font-bold text-xl mb-2">No items yet</h3>
            <p className="text-gray-500 text-sm mb-8">Browse the catalog and add products to see pricing here.</p>
            <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {cart.map(item => (
                <CartItem
                  key={`${item.productId}-${item.type}`}
                  item={item}
                  onUpdateQty={updateQty}
                  onRemove={removeFromCart}
                />
              ))}
              <div className="pt-2">
                <Link to="/products" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  ← Continue browsing
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
                <h2 className="text-gray-900 font-bold text-base mb-4">Price Breakdown</h2>

                <div className="space-y-2.5 mb-4">
                  {cart.map(item => {
                    const isCase = item.type === 'cases'
                    const lineTotal = isCase && item.case_to_piece_qty
                      ? item.price * item.case_to_piece_qty * item.qty
                      : item.price * item.qty
                    return (
                      <div key={`${item.productId}-${item.type}`} className="flex items-start justify-between gap-2 text-sm">
                        <div className="min-w-0">
                          <span className="text-gray-600 line-clamp-1">{item.name}</span>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {item.qty} {item.type === 'cases' ? `case${item.qty !== 1 ? 's' : ''}` : `pc${item.qty !== 1 ? 's' : ''}`}
                            {isCase && item.case_to_piece_qty && ` × ${item.case_to_piece_qty} pcs`}
                          </div>
                        </div>
                        <span className="text-gray-900 font-semibold flex-shrink-0">₹{lineTotal.toLocaleString('en-IN')}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total pieces</span>
                    <span className="text-gray-900 font-medium">{totalPieces.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-1">
                    <span className="text-gray-900">Grand Total</span>
                    <span className="text-gray-900">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm w-full"
                  >
                    📦 Place Order
                  </button>
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 font-medium py-2.5 rounded-xl transition-colors text-sm w-full"
                  >
                    💬 Send Bulk Inquiry
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
