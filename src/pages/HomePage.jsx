import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const PRODUCTS = [
  { id: 1, name: 'Classic Sparklers', emoji: '✨', category: 'Sparklers', price: '₹180', unit: 'per box', tag: 'Favourite', desc: 'Perfect for birthdays & small celebrations. Easy to use for everyone.' },
  { id: 2, name: 'Aerial Sky Shots', emoji: '🚀', category: 'Aerial Shows', price: '₹850', unit: 'per pack', tag: 'Wow Factor!', desc: 'Big bright colours that burst high in the sky. Great for weddings.' },
  { id: 3, name: 'Ground Spinners', emoji: '🌀', category: 'Ground Shows', price: '₹320', unit: 'per set', tag: 'New', desc: 'Colourful spinning showers at ground level. Kids and adults love these!' },
  { id: 4, name: 'Sky Shot 12 Chimes', emoji: '🎇', category: 'Aerial Shows', price: '₹640', unit: 'per unit', tag: 'Popular', desc: '12 beautiful blasts with musical chime effects. A crowd favourite.' },
  { id: 5, name: 'Giant Flower Pot', emoji: '🌸', category: 'Novelty', price: '₹390', unit: 'per unit', tag: 'Great Value', desc: 'Big golden sparks fountain. Perfect backdrop for any celebration.' },
  { id: 6, name: 'Chakra Special Wheel', emoji: '🎡', category: 'Ground Shows', price: '₹220', unit: 'per wheel', tag: null, desc: 'A spinning wheel of red and green stars. Easy to set up and safe.' },
]

const WHY_US = [
  { emoji: '🛡️', title: 'Safe & Tested', desc: 'Every product goes through strict safety checks. You can celebrate with peace of mind.' },
  { emoji: '💰', title: 'Best Prices', desc: 'Buy directly from us — no middlemen — so you always get the best deal.' },
  { emoji: '🚚', title: 'Fast Delivery', desc: 'We deliver quickly to your doorstep, even for large festival orders.' },
]

const STATS = [
  { val: '30+', label: 'Years Trusted' },
  { val: '500+', label: 'Products' },
  { val: '50,000+', label: 'Happy Families' },
  { val: '100%', label: 'Safety Certified' },
]

export default function HomePage() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="min-h-screen">
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pt-28 pb-20">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-amber-200">
            🇮🇳 India's Trusted Fireworks Brand Since 1994
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
            Light Up Every<br/>
            <span className="text-amber-500">Celebration 🎆</span>
          </h1>

          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            From sparklers for birthdays to grand aerial shows for weddings —
            Bansal Fireworks has the perfect fireworks for your special moments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/products"
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-amber-200 transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              id="hero-shop-btn"
            >
              🛒 Shop Fireworks
            </Link>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold text-lg px-8 py-4 rounded-2xl border-2 border-gray-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              id="hero-call-btn"
            >
              📞 Call Us Now
            </a>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-px bg-amber-200/60 rounded-2xl overflow-hidden border border-amber-200 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {STATS.map(s => (
              <div key={s.label} className="bg-white/80 backdrop-blur-sm py-5 px-4 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mb-1">{s.val}</div>
                <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Featured Products ---- */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-amber-200 mb-4">
              🎇 Shop by Category
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Our Most Popular Fireworks</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">Hand-picked favourites for every kind of celebration, big or small.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map(p => (
              <Link
                to={`/products/${p.id}`}
                key={p.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
                id={`product-card-${p.id}`}
              >
                {/* Emoji Preview */}
                <div className="bg-amber-50 h-36 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                  {p.emoji}
                </div>

                <div className="p-5 flex flex-col flex-1 gap-2">
                  {p.tag && (
                    <span className="self-start bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {p.tag}
                    </span>
                  )}
                  <h3 className="text-gray-900 font-bold text-base">{p.name}</h3>
                  <p className="text-amber-600 text-xs font-semibold uppercase tracking-wide">{p.category}</p>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{p.desc}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-gray-900 font-extrabold text-lg">{p.price}</span>
                      <span className="text-gray-400 text-xs ml-1">{p.unit}</span>
                    </div>
                    <span className="text-amber-600 text-sm font-semibold group-hover:underline">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3.5 rounded-xl shadow-sm transition-all"
              id="see-all-products-btn"
            >
              See All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Why Choose Us ---- */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Why Families Trust Us</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Over 30 years of making celebrations safer and brighter.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {WHY_US.map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-8 text-center border border-amber-100 shadow-sm hover:shadow-md transition-all">
                <div className="text-5xl mb-5">{item.emoji}</div>
                <h3 className="text-gray-900 font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA Banner ---- */}
      <section className="py-12 bg-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Planning a Celebration? 🎉
          </h2>
          <p className="text-amber-100 text-lg mb-8">
            Our friendly team will help you pick the right fireworks for your budget. No confusing jargon, just great advice!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 bg-white text-amber-600 font-bold text-base px-8 py-4 rounded-2xl hover:bg-amber-50 transition-all shadow-sm w-full sm:w-auto justify-center"
            >
              📞 Call for Free Advice
            </a>
            <Link
              to="/contact"
              className="flex items-center gap-2 bg-amber-600 text-white font-bold text-base px-8 py-4 rounded-2xl hover:bg-amber-700 transition-all border-2 border-amber-400 w-full sm:w-auto justify-center"
            >
              ✉️ Send Us a Message
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
