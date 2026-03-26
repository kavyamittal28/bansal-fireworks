import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'

// ── Payment details — update these when going live ──────────────────────────
const UPI_ID = 'bansalfireworks@upi'
const UPI_PHONE = '+91 98765 43210'
// ────────────────────────────────────────────────────────────────────────────

export default function OrderPaymentPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [screenshot, setScreenshot] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const fileRef = useRef()

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/order/${orderId}`)
        if (res.status === 404) { setNotFound(true); return }
        if (!res.ok) throw new Error()
        const data = await res.json()
        setOrder(data)
        // If screenshot was already submitted in a previous visit
        if (data.payment_status === 'pending_confirmation' || data.payment_status === 'confirmed') {
          setSubmitted(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setScreenshot(file)
    setPreview(URL.createObjectURL(file))
    setUploadError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!screenshot) return
    setUploading(true)
    setUploadError(null)
    const form = new FormData()
    form.append('screenshot', screenshot)
    try {
      const res = await fetch(`/api/order/${orderId}/payment-screenshot`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="inline-block w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-gray-900 font-bold text-xl mb-2">Order not found</h2>
        <p className="text-gray-500 text-sm mb-6">This payment link is invalid or has expired.</p>
        <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
          Browse Catalog
        </Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 max-w-sm w-full">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-gray-900 font-bold text-xl mb-2">Payment Submitted!</h2>
          <p className="text-gray-500 text-sm mb-2">
            Your screenshot has been sent for verification. We'll confirm your order shortly.
          </p>
          <p className="text-gray-400 text-xs mb-6">Order ID: <span className="font-mono">{orderId}</span></p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-left mb-6">
            <p className="text-blue-800 font-semibold text-xs mb-1">🏪 Picking up from store?</p>
            <p className="text-blue-700 text-xs leading-relaxed">
              Mention your <span className="font-semibold">mobile number</span> and <span className="font-semibold">Order ID</span> at the store counter.
            </p>
          </div>
          <Link to="/products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/Logo.png" alt="Bansal Fireworks" className="h-9 w-auto" />
            <span className="text-gray-900 font-bold text-base">Bansal Fireworks</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-500 text-sm mt-1">Order for {order.name}</p>
        </div>

        {/* Amount card */}
        <div className="bg-blue-600 text-white rounded-2xl p-5 mb-5 text-center">
          <p className="text-blue-200 text-sm mb-1">Amount to Pay</p>
          <p className="text-4xl font-bold">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
          <p className="text-blue-200 text-xs mt-1">{order.total_pieces?.toLocaleString('en-IN')} pieces · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Payment methods */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
          <h2 className="text-gray-900 font-semibold text-base mb-5 text-center">Pay via UPI</h2>

          {/* QR Code */}
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 border-2 border-gray-100 rounded-2xl bg-white inline-block mb-3">
              <img
                src="/images/payment-qr.png"
                alt="UPI Payment QR Code"
                className="w-44 h-44 object-contain"
              />
            </div>
            <p className="text-gray-400 text-xs">Scan with any UPI app</p>
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-3">
            {/* UPI ID */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">UPI ID</p>
                <p className="text-gray-900 font-medium text-sm font-mono">{UPI_ID}</p>
              </div>
              <button
                onClick={() => navigator.clipboard?.writeText(UPI_ID)}
                className="text-blue-600 hover:text-blue-700 text-xs font-medium border border-blue-200 hover:border-blue-400 px-2.5 py-1 rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Phone / GPay</p>
                <p className="text-gray-900 font-medium text-sm">{UPI_PHONE}</p>
              </div>
              <button
                onClick={() => navigator.clipboard?.writeText(UPI_PHONE.replace(/\s/g, ''))}
                className="text-blue-600 hover:text-blue-700 text-xs font-medium border border-blue-200 hover:border-blue-400 px-2.5 py-1 rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Screenshot upload */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-gray-900 font-semibold text-base mb-1">Upload Payment Screenshot</h2>
          <p className="text-gray-400 text-xs mb-5">After making the payment, upload a screenshot so we can confirm your order.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                preview ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              {preview ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={preview} alt="Screenshot preview" className="max-h-40 rounded-lg object-contain" />
                  <p className="text-blue-600 text-xs font-medium">Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className="text-sm font-medium text-gray-600">Tap to upload screenshot</p>
                  <p className="text-xs">PNG, JPG supported</p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}

            <button
              type="submit"
              disabled={!screenshot || uploading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading…
                </>
              ) : 'Submit Payment Screenshot'}
            </button>
          </form>
        </div>

        {/* Pickup notice */}
        <div className="mt-5 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex gap-3 items-start">
          <span className="text-xl flex-shrink-0">🏪</span>
          <div>
            <p className="text-blue-800 font-semibold text-sm mb-1">Want to pick up from our store?</p>
            <p className="text-blue-700 text-xs leading-relaxed">
              You can collect your order directly from our store. Just walk in and mention your{' '}
              <span className="font-semibold">registered mobile number</span> and{' '}
              <span className="font-semibold">Order ID: <span className="font-mono">{orderId}</span></span>.
            </p>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">
          Need help? Call us at {UPI_PHONE}
        </p>
      </div>
    </div>
  )
}
