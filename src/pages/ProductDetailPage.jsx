import { useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'

const PRODUCTS = [
  {
    id: 1, name: 'Classic Sparklers', category: 'Sparklers', price: 45, originalPrice: 60,
    img: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80',
    brand: 'Standard Fireworks', sku: 'BF-SPARK-001', weight: '250g', duration: '45 seconds',
    colors: 'Gold, Silver', safetyClass: 'F2', minAge: '12+',
    description: 'Classic sparklers are the perfect companion for any celebration. Safe, vibrant, and suitable for all ages, these gold-and-silver wonders burn bright for 45 seconds. Available in trade packs for both retail and wholesale purposes.',
    features: ['Internationally certified F2 safety rating', 'Gold and silver colour combination', 'Easy twist-wire handle for safe grip', 'Suitable for retail and wholesale trade']
  },
  {
    id: 2, name: 'Aerial Sky Shots', category: 'Aerial Shows', price: 850, originalPrice: 1000,
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    brand: 'Cock Brand', sku: 'BF-SKY-002', weight: '500g', duration: '90 seconds',
    colors: 'Red, Blue, Gold', safetyClass: 'F3', minAge: '18+',
    description: 'Spectacular aerial display with 12 chimes effect. A professional-grade firework designed for large open-air events and displays. Each shell reaches heights up to 50 metres, producing vivid color bursts.',
    features: ['12 chimes aerial burst pattern', 'Professional F3 grade', 'High altitude burst up to 50m', 'Licensed use only — requires permit']
  },
  {
    id: 3, name: 'Ground Spinners', category: 'Ground Shows', price: 320, originalPrice: 400,
    img: 'https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80',
    brand: 'Bansal Fireworks', sku: 'BF-SPIN-003', weight: '150g', duration: '30 seconds',
    colors: 'Red, Green', safetyClass: 'F1', minAge: '8+',
    description: 'Colorful ground-level spinning showers. Safe and fun for family celebrations. Easy to set up with a built-in ground spike and provides a stunning visual effect for driveway and garden displays.',
    features: ['Ground level spinning effect', 'Family-friendly F1 rating', 'Built-in ground spike for stability', 'Red and green colour wheel effect']
  },
]

const RELATED = [
  { id: 4, name: 'Blue Midnight Shot', price: 35, img: 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&q=80', tag: 'NEW' },
  { id: 5, name: 'Crimson Sky 250g',   price: 37, img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80', tag: 'NEW' },
  { id: 6, name: 'Crimson Silver Pro', price: 620, img: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=400&q=80', tag: null },
  { id: 7, name: 'Olive Dragon 500g',  price: 890, img: 'https://images.unsplash.com/photo-1484321220551-69c4bb37a1dd?w=400&q=80', tag: null },
]

const TABS = ['Overview', 'Performance Guide', 'Shipping & Legal', 'Reviews (14)']

// Mini toast notification
function WishlistToast({ visible, saved }) {
  if (!visible) return null
  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 ${visible ? 'toast-enter' : 'toast-exit'}`}>
      {saved ? '❤️ Added to Wishlist' : '🤍 Removed from Wishlist'}
    </div>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const product = PRODUCTS.find(p => p.id === Number(id)) || PRODUCTS[0]
  const allImages = [product.img, ...RELATED.slice(0, 3).map(r => r.img)]

  const [activeTab, setActiveTab] = useState('Overview')
  const [selectedImg, setSelectedImg] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const toggleWishlist = useCallback(() => {
    const next = !wishlisted
    setWishlisted(next)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }, [wishlisted])

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
            <div className="rounded-2xl overflow-hidden bg-gray-900 h-72 sm:h-96 mb-4">
              <img
                src={allImages[selectedImg]}
                alt={`${product.name} — view ${selectedImg + 1}`}
                className="w-full h-full object-cover transition-opacity duration-200"
                key={selectedImg}
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3" role="group" aria-label="Product image thumbnails">
              {allImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
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
          </div>

          {/* Product Info */}
          <div>
            <span className="inline-flex items-center bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-gray-400 line-through text-sm">₹{product.originalPrice}</span>
                  <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-0.5 rounded">
                    SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
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
            <div className="grid grid-cols-2 gap-x-4 text-sm border border-gray-100 rounded-xl overflow-hidden">
              {[
                ['Brand', product.brand],
                ['SKU', product.sku],
                ['Weight', product.weight],
                ['Duration', product.duration],
                ['Safety Class', product.safetyClass],
                ['Min. Age', product.minAge],
              ].map(([label, val], i) => (
                <div key={label} className={`flex justify-between items-center px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-900 font-semibold">{val}</span>
                </div>
              ))}
            </div>

            {/* Safety notice */}
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
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
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
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
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{product.description}</p>
                <ul className="space-y-3">
                  {product.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-gray-700 text-sm">
                      <span className="text-blue-600 mt-0.5 flex-shrink-0 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
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
                <p>📦 <strong>Shipping:</strong> All orders ship from Sivakasi, Tamil Nadu within 3–5 business days.</p>
                <p>⚖️ <strong>Legal:</strong> Check your state's regulations before ordering Class F2/F3 products.</p>
                <p>🔒 <strong>Packaging:</strong> All items are packed in PESO-approved safety packaging.</p>
              </div>
            )}
            {activeTab === 'Reviews (14)' && (
              <div className="text-center py-10 text-gray-400">
                <div className="text-4xl mb-3">⭐</div>
                <p className="text-sm">Customer reviews will appear here shortly.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Related Products</h2>
            <Link to="/products" className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">View Catalog →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {RELATED.map(r => (
              <Link
                key={r.id}
                to={`/products/${r.id}`}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="h-36 overflow-hidden bg-gray-100 relative">
                  <img src={r.img} alt={r.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {r.tag && (
                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">{r.tag}</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-gray-900 text-xs font-semibold">{r.name}</p>
                  <p className="text-blue-600 text-xs mt-1 font-medium">₹{r.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
