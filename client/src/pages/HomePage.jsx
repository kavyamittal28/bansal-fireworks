import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const WHY_CHOOSE = [
  {
    icon: '🛡️', color: 'bg-blue-50 text-blue-600',
    title: 'Safety Certified',
    desc: 'Every product meets stringent quality standards to ensure maximum safety during use. Internationally certified.'
  },
  {
    icon: '🏭', color: 'bg-orange-50 text-orange-500',
    title: 'Direct Manufacturer Pricing',
    desc: 'We manufacture directly so you eliminate the middleman and get the best possible prices on all products.'
  },
  {
    icon: '🚚', color: 'bg-blue-50 text-blue-600',
    title: 'Priority Bulk Delivery',
    desc: 'Specialized logistics network ensures safe and on-time delivery for all bulk and wholesale orders nationwide.'
  },
]

export default function HomePage() {
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
        className="relative bg-gray-900 text-white py-24 sm:py-40 px-4 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gray-900/70" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-6 animate-fade-in-up">
            ✨ Est. 1994 · Sadulshahar, Rajasthan · 30+ Years of Excellence
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6 sm:mb-8 animate-fade-in-up">
            Bansal Fireworks
          </h1>
          <p className="text-gray-200 text-lg sm:text-xl max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed animate-fade-in-up">
            Experience the magic of premium fireworks with India's most trusted manufacturer. Crafted with precision, certified for safety, and celebrated across the nation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
            <Link
              to="/products"
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 w-full sm:w-auto text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
              id="hero-shop-btn"
            >
              Explore Collection
            </Link>
            <Link
              to="/contact"
              className="bg-white/15 hover:bg-white/25 border border-white/40 text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 backdrop-blur w-full sm:w-auto text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              id="hero-order-btn"
            >
              Bulk Order Inquiry
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brands ── */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-2">Trusted Partners</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">Premium Brands</h2>
            </div>
            <Link to="/products" className="text-amber-600 hover:text-amber-700 text-sm font-semibold transition-colors hidden sm:block">
              See all →
            </Link>
          </div>

          {brands.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-16">No brands added yet.</div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-hide">
              {brands.map(brand => (
                <Link
                  key={brand.id}
                  to={`/products?brand=${encodeURIComponent(brand.name)}`}
                  className="group flex flex-col items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-shrink-0 w-44"
                >
                  <div className="w-20 h-20 rounded-xl bg-amber-50 overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                    {brand.image_url
                      ? <img src={brand.image_url} alt={brand.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      : <span className="text-3xl">✨</span>
                    }
                  </div>
                  <p className="text-gray-900 font-semibold text-base text-center leading-tight">{brand.name}</p>
                  {brand.description && (
                    <p className="text-gray-500 text-xs text-center line-clamp-2">{brand.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-2">Shop by Category</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">Explore Our Collections</h2>
            </div>
            <Link to="/products" className="text-amber-600 hover:text-amber-700 text-sm font-semibold transition-colors hidden sm:block">
              Browse all →
            </Link>
          </div>

          {categories.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-16">No categories added yet.</div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-hide">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group relative rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0 w-44 h-48 sm:w-56 sm:h-56 flex items-end hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  {cat.image_url
                    ? <img src={cat.image_url} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    : <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-5xl">✨</div>
                  }
                  <div className="relative w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 py-5">
                    <p className="text-white font-serif font-bold text-lg">{cat.name}</p>
                    {cat.description && <p className="text-white/80 text-xs truncate mt-1">{cat.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-3">Since 1994</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-5">Why Choose Bansal</h2>
              <p className="text-gray-600 text-base mb-10 leading-relaxed">
                For over three decades, we've been India's trusted fireworks manufacturer. Our unwavering commitment to quality, safety, and innovation has made us the choice of celebrations across the nation.
              </p>
              <div className="flex flex-col gap-7">
                {WHY_CHOOSE.map(item => (
                  <div key={item.title} className="flex items-start gap-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-semibold text-base mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden h-64 sm:h-96 bg-gray-200 shadow-xl">
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
      <section className="py-16 sm:py-24 bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4 sm:mb-6">Ready to light up your celebration?</h2>
          <p className="text-amber-100 text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
            Our expert team is ready to help you find the perfect fireworks for your special occasion. Experience unmatched quality and service.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919587638000"
              className="flex items-center justify-center gap-2 bg-white text-amber-700 font-semibold px-8 py-3.5 rounded-lg hover:bg-amber-50 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
              id="cta-call-btn"
            >
              ☎️ Call us now
            </a>
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
              id="cta-inquiry-btn"
            >
              Request a Quote
            </Link>
          </div>
          <p className="text-amber-200 text-xs mt-6">Response within 2–4 hours · Available 6 AM to 10 PM</p>
        </div>
      </section>
    </main>
  )
}
