import { Link } from 'react-router-dom'

const PRODUCTS = [
  {
    id: 1, name: 'Classic Sparklers', category: 'Sparklers',
    img: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&q=80',
    desc: 'The perfect companion for any celebration.'
  },
  {
    id: 2, name: 'Aerial Sky Shots', category: 'Aerial Shows',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    desc: 'Spectacular pyrotechnic elements.'
  },
  {
    id: 3, name: 'Ground Spinners', category: 'Ground Shows',
    img: 'https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=400&q=80',
    desc: 'Amazing ground-level spinning effects.'
  },
]

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
  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section
        className="relative bg-gray-900 text-white py-32 px-4 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gray-900/65" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">
            🎆 Since 1994 · Sivakasi, India
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Bansal Fireworks
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Experience the magic of lights with India's most trusted fireworks manufacturer. Quality and safety built into every single spark.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg w-full sm:w-auto text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-800"
              id="hero-shop-btn"
            >
              Shop Fireworks
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3 rounded-lg transition-colors w-full sm:w-auto text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              id="hero-order-btn"
            >
              Bulk Order Inquiry
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Collections ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Collections</h2>
              <p className="text-gray-500 text-sm mt-1">Hand-picked premium selections from our catalog</p>
            </div>
            <Link to="/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors" id="view-all-link">
              See All Items →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PRODUCTS.map(p => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="group rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                id={`product-card-${p.id}`}
              >
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img
                    src={p.img}
                    alt={`${p.name} — ${p.category} fireworks`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">{p.category}</p>
                  <h3 className="text-gray-900 font-semibold text-base mb-1">{p.name}</h3>
                  <p className="text-gray-500 text-sm">{p.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Choose Us</h2>
              <p className="text-gray-500 text-sm mb-8">
                Since 1994, Bansal Fireworks has been at the forefront of the pyrotechnics industry. Our commitment to quality, safety and affordability sets us apart.
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
            <div className="rounded-2xl overflow-hidden h-80 bg-gray-200">
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
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to light up your event?</h2>
          <p className="text-blue-100 text-base mb-8">
            Our specialists are available to help you find the best solution for your budget and venue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors shadow w-full sm:w-auto justify-center"
              id="cta-call-btn"
            >
              📞 Speak with an Expert
            </a>
            <Link
              to="/contact"
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg border border-blue-500 transition-colors w-full sm:w-auto justify-center"
              id="cta-inquiry-btn"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
