import { useState } from 'react'
import { Link } from 'react-router-dom'

const BRANDS = [
  { id: 'all', label: 'All Brands', count: 6 },
  { id: 'standard', label: 'Standard Fireworks', count: 2 },
  { id: 'cock', label: 'Cock Brand', count: 2 },
  { id: 'sivakasi', label: 'Sivakasi', count: 1 },
  { id: 'bansal', label: 'Bansal Fireworks', count: 1 },
]

const ALL_PRODUCTS = [
  { id: 1, name: '10cm Electric Sparklers', brand: 'standard', tags: ['STANDARD', 'PRODUCT'], price: 45, img: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&q=80', category: 'Sparklers' },
  { id: 2, name: 'Chakra Special Wheel',    brand: 'cock',     tags: ['COCK BRAND', 'RARE'],    price: 30, img: 'https://images.unsplash.com/photo-1533230408708-8f9f91d1235a?w=400&q=80', category: 'Ground Wheels' },
  { id: 3, name: 'Flower Pot (Giant)',       brand: 'sivakasi', tags: ['SIVAKASI', 'CLEARANCE'], price: 80, img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80', category: 'Flower Pots' },
  { id: 4, name: 'Hydro Bomb (Green)',       brand: 'standard', tags: ['STANDARD', '100G'],      price: 15, img: 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&q=80', category: 'Sky Shots' },
  { id: 5, name: 'Bullet Bomb (Pack)',       brand: 'cock',     tags: ['COCK BRAND', '100G'],    price: 20, img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80', category: 'Sky Shots' },
  { id: 6, name: 'Sky Shot 12 Chimes',      brand: 'bansal',   tags: ['BANSAL', '30G'],          price: 450, img: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=400&q=80', category: 'Gift Boxes' },
]

const CATEGORIES = ['Sparklers', 'Ground Wheels', 'Flower Pots', 'Sky Shots', 'Gift Boxes']
const SORT_OPTIONS = [
  { id: 'default', label: 'Default Order' },
  { id: 'price_asc', label: 'Price: Low → High' },
  { id: 'price_desc', label: 'Price: High → Low' },
  { id: 'name_asc', label: 'Name: A → Z' },
]

export default function ProductsPage() {
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sortBy, setSortBy] = useState('default')
  const [sortOpen, setSortOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = ALL_PRODUCTS.filter(p => {
    const brandOk = selectedBrand === 'all' || p.brand === selectedBrand
    const catOk = !selectedCategory || p.category === selectedCategory
    return brandOk && catOk
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price
    if (sortBy === 'price_desc') return b.price - a.price
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
    return 0
  })

  function resetFilters() {
    setSelectedBrand('all')
    setSelectedCategory(null)
    setSortBy('default')
  }

  const SidebarContent = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand Catalog</h3>
        {(selectedBrand !== 'all' || selectedCategory) && (
          <button onClick={resetFilters} className="text-xs text-blue-600 hover:underline">Reset</button>
        )}
      </div>
      <p className="text-gray-400 text-xs mb-4">Filter products by maker</p>
      <div className="flex flex-col gap-1">
        {BRANDS.map(brand => (
          <button
            key={brand.id}
            onClick={() => { setSelectedBrand(brand.id); setMobileFiltersOpen(false) }}
            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              selectedBrand === brand.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            id={`brand-filter-${brand.id}`}
            aria-pressed={selectedBrand === brand.id}
          >
            <span>{brand.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              selectedBrand === brand.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {brand.count}
            </span>
          </button>
        ))}
      </div>

      {/* Wholesale CTA */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center mb-3 text-white text-xs">📋</div>
        <p className="text-gray-700 text-xs font-medium mb-2">Looking for our full wholesale price list for the 2024 festive season?</p>
        <Link
          to="/contact"
          className="block w-full text-center bg-white border border-blue-200 text-blue-600 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          id="download-pdf-btn"
          onClick={() => setMobileFiltersOpen(false)}
        >
          Request Price List →
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
            <p className="text-gray-500 text-sm mt-1">Transparent unit pricing for premium firecrackers.</p>
          </div>
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            id="bulk-inquiry-btn"
          >
            Bulk Order Inquiry
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-56 flex-shrink-0">
          <SidebarContent />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-expanded={mobileFiltersOpen}
              id="mobile-filter-btn"
            >
              ⚙️ Filters {selectedBrand !== 'all' || selectedCategory ? '●' : ''}
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(v => !v)}
                className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                aria-expanded={sortOpen}
                id="sort-btn"
              >
                ↕️ {SORT_OPTIONS.find(s => s.id === sortBy)?.label || 'Sort'}
              </button>
              {sortOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 min-w-[180px]">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { setSortBy(opt.id); setSortOpen(false) }}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.id ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-gray-400 text-xs ml-auto">{sorted.length} product{sorted.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter by category">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isActive ? null : cat)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                  aria-pressed={isActive}
                >
                  {cat}{isActive ? ' ×' : ''}
                </button>
              )
            })}
          </div>

          {/* Empty state */}
          {sorted.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-gray-900 font-semibold text-lg mb-2">No products found</h3>
              <p className="text-gray-500 text-sm mb-6">
                Try adjusting your filters or browse all products.
              </p>
              <button
                onClick={resetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Product Grid */}
          {sorted.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
              {sorted.map(p => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  id={`product-${p.id}`}
                >
                  <div className="h-44 overflow-hidden bg-gray-100">
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {p.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-medium">{tag}</span>
                      ))}
                    </div>
                    <h3 className="text-gray-900 font-semibold text-sm mb-3">{p.name}</h3>
                    <div>
                      <span className="text-xs text-gray-400">Price per unit</span>
                      <div className="text-gray-900 font-bold text-lg">₹{p.price.toFixed(2)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Bulk CTA */}
          <div className="bg-gray-800 rounded-2xl p-8 text-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">📦</div>
            <h3 className="text-white font-bold text-lg mb-2">Ready to Place a Bulk Order?</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-lg mx-auto">
              Special tiered pricing for wholesale buyers, retailers, and event organizers. Click below to start an inquiry.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              id="send-bulk-inquiry-btn"
            >
              Send Bulk Order Inquiry
            </Link>
            <p className="text-gray-500 text-xs mt-4">Response time usually within 2–4 hours</p>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-gray-50 overflow-y-auto p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 font-bold text-base">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Click outside to close sort */}
      {sortOpen && <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />}
    </div>
  )
}
