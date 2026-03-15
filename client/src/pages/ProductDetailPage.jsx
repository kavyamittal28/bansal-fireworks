import { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'

const TABS = ['Overview', 'Performance Guide', 'Shipping & Legal']

function WishlistToast({ visible, saved }) {
  if (!visible) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
      {saved ? '❤️ Added to Wishlist' : '🤍 Removed from Wishlist'}
    </div>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  const [activeTab, setActiveTab] = useState('Overview')
  const [selectedImg, setSelectedImg] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      setFetchError('')
      try {
        const res = await fetch(`/api/get-product/${id}`)
        if (res.status === 404) throw new Error('Product not found')
        if (!res.ok) throw new Error('Failed to load product')
        const data = await res.json()
        setProduct(data)
        setSelectedImg(0)
      } catch (err) {
        setFetchError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const toggleWishlist = useCallback(() => {
    const next = !wishlisted
    setWishlisted(next)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }, [wishlisted])

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="flex gap-3">
                {[1, 2, 3].map(i => <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-gray-900 font-bold text-xl mb-2">{fetchError}</h2>
          <Link to="/products" className="text-blue-600 hover:underline text-sm">← Back to catalog</Link>
        </div>
      </div>
    )
  }

  if (!product) return null

  const images = product.media?.length > 0
    ? product.media.map(m => m.url)
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <WishlistToast visible={toastVisible} saved={wishlisted} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-blue-600 transition-colors">Bansal Fireworks</Link>
            <span aria-hidden="true">›</span>
            <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <span aria-hidden="true">›</span>
            <span className="text-gray-900 font-medium" aria-current="page">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product top section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-gray-100 h-56 sm:h-72 md:h-96 mb-4 flex items-center justify-center">
              {images.length > 0 ? (
                <img
                  src={images[selectedImg]}
                  alt={`${product.name} — view ${selectedImg + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-200"
                  key={selectedImg}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-300">
                  <svg className="w-20 h-20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                  <span className="text-sm">No Image Available</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3" role="group" aria-label="Product image thumbnails">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                      i === selectedImg
                        ? 'border-blue-600 ring-2 ring-blue-200'
                        : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400'
                    }`}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={i === selectedImg}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.category && (
              <span className="inline-flex items-center bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                {product.category}
              </span>
            )}
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

            {product.description && (
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{product.description}</p>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{Number(product.price).toLocaleString('en-IN')}</span>
                {product.market_price && Number(product.market_price) > Number(product.price) && (
                  <span className="text-lg text-gray-400 line-through">₹{Number(product.market_price).toLocaleString('en-IN')}</span>
                )}
                {product.market_price && Number(product.market_price) > Number(product.price) && (
                  <span className="text-sm font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    {Math.round((1 - product.price / product.market_price) * 100)}% off
                  </span>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex gap-2 mb-5">
              {product.bestseller && (
                <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                  ⭐ Bestseller
                </span>
              )}
              {product.eco_friendly && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  🌿 Eco-Friendly
                </span>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm"
                id="send-bulk-inquiry-btn"
              >
                📦 Send Bulk Order Inquiry
              </Link>
              <button
                onClick={toggleWishlist}
                className={`flex items-center justify-center gap-2 border font-medium py-3 rounded-xl transition-all ${
                  wishlisted
                    ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                aria-pressed={wishlisted}
                id="wishlist-btn"
              >
                {wishlisted ? '❤️ Saved to Wishlist' : '🤍 Save to Wishlist'}
              </button>
            </div>

            {/* Key specs */}
            {product.brand && (
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-4 text-sm border border-gray-100 rounded-xl overflow-hidden mb-4">
                {[
                  ['Brand', product.brand],
                  ['Category', product.category],
                ].filter(([, v]) => v).map(([label, val], i) => (
                  <div key={label} className={`flex justify-between items-center px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <span className="text-gray-500">{label}</span>
                    <span className="text-gray-900 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Safety notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <span className="text-blue-600 text-xl flex-shrink-0" aria-hidden="true">ℹ️</span>
              <div>
                <p className="text-blue-800 font-semibold text-sm">Safety & Legal Notice</p>
                <p className="text-blue-600 text-xs mt-1 leading-relaxed">
                  Some products require a valid explosives license. Please ensure you comply with local laws and regulations before purchase. Bansal Fireworks only ships to licensed dealers for Class F3 items.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-10 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto" role="tablist">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
                className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-6" role="tabpanel">
            {activeTab === 'Overview' && (
              <div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
            )}
            {activeTab === 'Performance Guide' && (
              <div className="text-center py-10 text-gray-400">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-sm">Performance data and charts coming soon.</p>
              </div>
            )}
            {activeTab === 'Shipping & Legal' && (
              <div className="text-sm text-gray-600 space-y-3">
                <p>📦 <strong>Shipping:</strong> All orders ship from Sadulshahar, Rajasthan within 3–5 business days.</p>
                <p>⚖️ <strong>Legal:</strong> Check your state's regulations before ordering Class F2/F3 products.</p>
                <p>🔒 <strong>Packaging:</strong> All items are packed in PESO-approved safety packaging.</p>
              </div>
            )}
          </div>
        </div>

        {/* Back to catalog */}
        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            ← Back to Product Catalog
          </Link>
        </div>
      </div>
    </div>
  )
}
