import { useState } from 'react'
import { Link } from 'react-router-dom'

const ALL_PRODUCTS = [
  { id: 1, name: 'Classic Sparklers', emoji: '✨', category: 'Sparklers', price: '₹180', rawPrice: 180, unit: 'per box (50 pcs)', minOrder: '10 boxes', tag: '⭐ Favourite', desc: 'Great for birthdays, cake moments, and indoor events. Very easy and safe to use.', brand: 'Bansal Classic' },
  { id: 2, name: 'Aerial Sky Shots', emoji: '🚀', category: 'Aerial Shows', price: '₹850', rawPrice: 850, unit: 'per pack (6 pcs)', minOrder: '5 packs', tag: '🔥 Wow Factor', desc: 'Bright, colourful explosions high in the sky. Perfect for weddings and big events.', brand: 'Bansal Pro' },
  { id: 3, name: 'Ground Spinners', emoji: '🌀', category: 'Ground Shows', price: '₹320', rawPrice: 320, unit: 'per set (12 pcs)', minOrder: '8 sets', tag: '✨ New', desc: 'Colourful spinning sparks at ground level. Fun and safe for all ages.', brand: 'Bansal Classic' },
  { id: 4, name: 'Chakra Wheel', emoji: '🎡', category: 'Ground Shows', price: '₹220', rawPrice: 220, unit: 'per wheel', minOrder: '20 units', tag: null, desc: 'A spinning wheel of red and green stars. Easy to set up against a fence or post.', brand: 'Bansal Classic' },
  { id: 5, name: 'Giant Flower Pot', emoji: '🌸', category: 'Novelty', price: '₹390', rawPrice: 390, unit: 'per unit', minOrder: '12 units', tag: '💛 Great Value', desc: 'Golden sparks fountain up to 3 metres tall. Beautiful photo backdrop.', brand: 'Bansal Pro' },
  { id: 6, name: 'Green Hydro Bomb', emoji: '💚', category: 'Aerial Shows', price: '₹480', rawPrice: 480, unit: 'per pack (4 pcs)', minOrder: '6 packs', tag: '👍 Popular', desc: 'Green whistling burst bombs with a dramatic waterfall effect.', brand: 'Bansal Pro' },
  { id: 7, name: 'Bullet Bomb Pack', emoji: '💥', category: 'Aerial Shows', price: '₹560', rawPrice: 560, unit: 'per pack (10 pcs)', minOrder: '5 packs', tag: null, desc: 'Powerful aerial shells with a loud burst and silver star shower.', brand: 'Bansal Pro' },
  { id: 8, name: 'Sky Shot 12 Chimes', emoji: '🎇', category: 'Aerial Shows', price: '₹640', rawPrice: 640, unit: 'per unit', minOrder: '4 units', tag: '👍 Popular', desc: '12 musical chime blasts with a glitter finale. Crowd-pleasing every time.', brand: 'Bansal Pro' },
]

const CATEGORIES = ['All', 'Sparklers', 'Aerial Shows', 'Ground Shows', 'Novelty']

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [added, setAdded] = useState([])

  const filtered = ALL_PRODUCTS
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'low') return a.rawPrice - b.rawPrice
      if (sortBy === 'high') return b.rawPrice - a.rawPrice
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  const toggleAdded = (id) => {
    setAdded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">🎆 Browse & Buy</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            All Our Fireworks
          </h1>
          <p className="text-gray-500 text-base">Choose what you love — we'll handle the rest. Simple prices, no hidden charges.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                id={`cat-${cat.toLowerCase().replace(/\s/g, '-')}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Sort */}
          <select
            id="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl text-sm text-gray-600 px-4 py-2.5 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        <p className="text-gray-400 text-sm mb-6">{filtered.length} items found</p>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
              {/* Emoji box */}
              <Link to={`/products/${p.id}`} className="block">
                <div className="bg-amber-50 h-32 flex items-center justify-center text-5xl hover:scale-105 transition-transform duration-300">
                  {p.emoji}
                </div>
              </Link>

              <div className="p-5 flex flex-col flex-1 gap-2">
                {p.tag && (
                  <span className="self-start bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">{p.tag}</span>
                )}
                <Link to={`/products/${p.id}`} className="text-gray-900 font-bold text-base hover:text-amber-600 transition-colors">
                  {p.name}
                </Link>
                <p className="text-amber-600 text-xs font-semibold uppercase tracking-wide">{p.category}</p>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{p.desc}</p>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100">
                  <div>
                    <span className="text-gray-900 font-extrabold text-xl">{p.price}</span>
                    <span className="text-gray-400 text-xs ml-1 block">{p.unit}</span>
                  </div>
                  <button
                    id={`add-btn-${p.id}`}
                    onClick={() => toggleAdded(p.id)}
                    className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                      added.includes(p.id)
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                    }`}
                  >
                    {added.includes(p.id) ? '✓ Added' : 'Add to List'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Order CTA */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-gray-900 font-bold text-xl mb-2">Need a Lot? Get a Bulk Discount! 🎉</h3>
            <p className="text-gray-500 text-sm mb-1">Special prices for events, weddings, and shop owners. Response within 2–4 hours.</p>
            <p className="text-amber-600 text-sm font-semibold">⏱️ We usually reply very quickly!</p>
          </div>
          <Link
            to="/contact"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-sm transition-all whitespace-nowrap flex-shrink-0"
            id="bulk-inquiry-btn"
          >
            Ask for Bulk Price →
          </Link>
        </div>
      </div>
    </main>
  )
}
