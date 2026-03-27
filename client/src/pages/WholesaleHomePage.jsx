import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const WHY_CHOOSE = [
  {
    icon: '💰', color: 'bg-blue-50 text-blue-600',
    title: 'Exclusive Wholesale Rates',
    desc: 'Direct manufacturer pricing with no middlemen. Get the best wholesale rates available in the market.'
  },
  {
    icon: '📦', color: 'bg-orange-50 text-orange-500',
    title: 'Bulk Order Ready',
    desc: 'Fully equipped to handle large bulk orders with consistent quality and on-time delivery across India.'
  },
  {
    icon: '🚚', color: 'bg-blue-50 text-blue-600',
    title: 'Priority Bulk Delivery',
    desc: 'Specialized logistics network ensures safe and timely delivery for all wholesale orders nationwide.'
  },
]

export default function WholesaleHomePage() {
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(Array.isArray(d) ? d : [])).catch(() => {})
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section
        className="relative bg-gray-900 text-white py-20 sm:py-32 px-4 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gray-900/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-blue-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            Wholesale Portal
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
            Bansal Fireworks
          </h1>
          <p className="text-gray-300 text-base sm:text-xl max-w-2xl mx-auto mb-8 sm:mb-10">
            India's most trusted fireworks manufacturer — offering exclusive wholesale pricing for distributors, retailers, and bulk buyers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/wholesale/products"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg w-full sm:w-auto text-center"
            >
              View Wholesale Catalog
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3 rounded-lg transition-colors w-full sm:w-auto text-center"
            >
              Wholesale Inquiry
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brands ── */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Our Brands</h2>
              <p className="text-gray-500 text-sm mt-1">Trusted manufacturers we work with</p>
            </div>
            <Link to="/wholesale/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              Browse All →
            </Link>
          </div>

          {brands.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-10">No brands added yet.</div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-hide">
              {brands.map(brand => (
                <Link
                  key={brand.id}
                  to={`/wholesale/products?brand=${encodeURIComponent(brand.name)}`}
                  className="group flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0 w-36"
                >
                  <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {brand.image_url
                      ? <img src={brand.image_url} alt={brand.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <span className="text-2xl">🏭</span>
                    }
                  </div>
                  <p className="text-gray-900 font-semibold text-sm text-center leading-tight">{brand.name}</p>
                  {brand.description && (
                    <p className="text-gray-400 text-xs text-center line-clamp-2">{brand.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 text-sm mt-1">Find exactly what you're looking for</p>
            </div>
            <Link to="/wholesale/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              View All →
            </Link>
          </div>

          {categories.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-10">No categories added yet.</div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-hide">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/wholesale/products?category=${encodeURIComponent(cat.name)}`}
                  className="group relative rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0 w-40 h-36 sm:w-48 sm:h-40 flex items-end hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {cat.image_url
                    ? <img src={cat.image_url} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-4xl">🎆</div>
                  }
                  <div className="relative w-full bg-gradient-to-t from-black/70 to-transparent px-3 py-3">
                    <p className="text-white font-semibold text-sm">{cat.name}</p>
                    {cat.description && <p className="text-white/70 text-xs truncate">{cat.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Buy Wholesale from Us</h2>
              <p className="text-gray-500 text-sm mb-8">
                Since 1994, Bansal Fireworks has been supplying dealers and distributors across India with premium quality fireworks at competitive wholesale prices.
              </p>
              <div className="flex flex-col gap-6">
                {WHY_CHOOSE.map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-semibold text-base mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden h-56 sm:h-80 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=800&q=80"
                alt="Fireworks celebration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-10 sm:py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Ready to place a wholesale order?</h2>
          <p className="text-blue-100 text-sm sm:text-base mb-6 sm:mb-8">
            Our wholesale team is available to help you with pricing, MOQ, and delivery across India.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919587638000"
              className="flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors shadow w-full sm:w-auto justify-center"
            >
              📞 Speak with Wholesale Team
            </a>
            <Link
              to="/contact"
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg border border-blue-500 transition-colors w-full sm:w-auto justify-center"
            >
              Request Wholesale Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
