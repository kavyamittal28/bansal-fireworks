import { Link } from 'react-router-dom'

const TIMELINE = [
  { year: '1994', emoji: '🚀', title: 'We Started Out', desc: 'A small family workshop in Sivakasi started making traditional fireworks with love.' },
  { year: '2005', emoji: '🏭', title: 'We Grew Bigger', desc: 'We set up modern manufacturing lines to ensure every product is safe and consistent.' },
  { year: '2018', emoji: '🏆', title: 'Nationally Recognised', desc: 'Received India\'s top pyrotechnics safety certification. A proud moment for our whole team.' },
  { year: 'Now', emoji: '🎆', title: 'Serving India', desc: 'Trusted by 50,000+ families and businesses across the country for all their celebrations.' },
]

const VALUES = [
  { emoji: '🛡️', title: 'Your Safety First', desc: 'We test every single product before it reaches you. Your family\'s safety is our number one priority.', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  { emoji: '⭐', title: 'Premium Quality', desc: 'We use the best materials so that every firework looks amazing and works exactly as you\'d expect.', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  { emoji: '🌿', title: 'Cleaner & Greener', desc: 'We\'re working on eco-friendly fireworks that are kinder to the environment without sacrificing the wow factor.', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
]

const STATS = [
  { val: '30+', label: 'Years of Experience', emoji: '🏅' },
  { val: '500+', label: 'Products Available', emoji: '🎆' },
  { val: '50,000+', label: 'Happy Customers', emoji: '😊' },
  { val: '100%', label: 'Safety Certified', emoji: '✅' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100 py-20 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-amber-200">
            🌟 Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Crafting Moments of<br/>
            <span className="text-amber-500">Pure Wonder Since 1994</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl">
            What started as a small family workshop in Sivakasi has grown into one of India's most trusted fireworks brands.
            Every sparkle you see carries 30 years of dedication, care, and craftsmanship.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-amber-200 transition-all">
            🤝 Work With Us
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center p-6 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="text-3xl mb-2">{s.emoji}</div>
                <div className="text-3xl font-extrabold text-amber-600 mb-1">{s.val}</div>
                <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Our Journey</h2>
            <p className="text-gray-500">Three decades of lighting up celebrations across India.</p>
          </div>

          <div className="flex flex-col gap-6">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className="flex gap-5 items-start">
                {/* Year bubble */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center text-lg font-extrabold shadow-md">
                    {item.emoji}
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className="w-0.5 h-8 bg-amber-200 mt-2" />
                  )}
                </div>
                {/* Content */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1 mb-0">
                  <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">{item.year}</span>
                  <h3 className="text-gray-900 font-bold text-lg mt-1 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">What We Believe In</h2>
            <p className="text-gray-500">The values that have kept our customers coming back for 30 years.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className={`${v.bg} border ${v.border} rounded-2xl p-8 text-center`}>
                <div className="text-5xl mb-5">{v.emoji}</div>
                <h3 className={`font-bold text-lg ${v.text} mb-3`}>{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Want to Experience the Best Fireworks? 🎇</h2>
          <p className="text-amber-100 mb-8">Browse our products or give us a call — we're happy to help!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="bg-white text-amber-600 font-bold px-8 py-4 rounded-2xl hover:bg-amber-50 transition-all">
              🛒 Browse Products
            </Link>
            <Link to="/contact" className="bg-amber-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-amber-700 transition-all border-2 border-amber-400">
              📞 Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
