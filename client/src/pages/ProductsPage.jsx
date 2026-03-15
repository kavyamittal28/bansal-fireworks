import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const SORT_OPTIONS = [
  { id: 'default', label: 'Default Order' },
  { id: 'price_asc', label: 'Price: Low → High' },
  { id: 'price_desc', label: 'Price: High → Low' },
  { id: 'name_asc', label: 'Name: A → Z' },
]

export default function ProductsPage() {
  const [searchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  const [brands, setBrands] = useState([{ id: 'all', label: 'All Brands' }])
  const [categories, setCategories] = useState([])

  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || null)
  const [sortBy, setSortBy] = useState('default')
  const [sortOpen, setSortOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/get-products')
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        setProducts(data)

        // Derive unique brands and categories from the data
        const uniqueBrands = [...new Set(data.map(p => p.brand).filter(Boolean))]
        setBrands([
          { id: 'all', label: 'All Brands' },
          ...uniqueBrands.map(b => ({ id: b, label: b })),
        ])
        const uniqueCats = [...new Set(data.map(p => p.category).filter(Boolean))]
        setCategories(uniqueCats)
      } catch (err) {
        setFetchError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filtered = products.filter(p => {
    const brandOk = selectedBrand === 'all' || p.brand === selectedBrand
    const catOk = !selectedCategory || p.category === selectedCategory
    const searchOk = !search.trim() || p.name.toLowerCase().includes(search.toLowerCase())
    return brandOk && catOk && searchOk
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price
    if (sortBy === 'price_desc') return b.price - a.price
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
    return 0
  })

  function resetFilters() {
    setSearch('')
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
        {brands.map(brand => (
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
          </button>
        ))}
      </div>

      {/* Wholesale CTA */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center mb-3 text-white text-xs">📋</div>
        <p className="text-gray-700 text-xs font-medium mb-2">Looking for our full wholesale price list for the 2026 festive season?</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
            <p className="text-gray-500 text-sm mt-1">Transparent unit pricing for premium firecrackers.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >✕</button>
            )}
          </div>
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
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-expanded={mobileFiltersOpen}
              id="mobile-filter-btn"
            >
              ⚙️ Filters {selectedBrand !== 'all' || selectedCategory ? '●' : ''}
            </button>

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

            <span className="text-gray-400 text-xs ml-auto">
              {loading ? 'Loading…' : `${sorted.length} product${sorted.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter by category">
              {categories.map(cat => {
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
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fetch error */}
          {fetchError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
              ⚠️ {fetchError}
            </div>
          )}

          {/* Empty state */}
          {!loading && !fetchError && sorted.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-gray-900 font-semibold text-lg mb-2">No products found</h3>
              <p className="text-gray-500 text-sm mb-6">
                {products.length === 0
                  ? 'No products have been added yet. Use the admin portal to add products.'
                  : 'Try adjusting your filters or browse all products.'}
              </p>
              {products.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Product Grid */}
          {!loading && sorted.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
              {sorted.map(p => {
                const thumbnail = p.media?.[0]?.url
                return (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    id={`product-${p.id}`}
                  >
                    <div className="h-44 overflow-hidden bg-gray-100 flex items-center justify-center">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-300">
                          <svg className="w-12 h-12 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                          </svg>
                          <span className="text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {p.brand && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-medium">
                            {p.brand.toUpperCase()}
                          </span>
                        )}
                        {p.bestseller && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">
                            BESTSELLER
                          </span>
                        )}
                        {p.eco_friendly && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                            ECO
                          </span>
                        )}
                      </div>
                      <h3 className="text-gray-900 font-semibold text-sm mb-3">{p.name}</h3>
                      <div>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-gray-900 font-bold text-lg">₹{Number(p.price).toLocaleString('en-IN')}</span>
                          {p.market_price && Number(p.market_price) > Number(p.price) && (
                            <span className="text-sm text-gray-400 line-through">₹{Number(p.market_price).toLocaleString('en-IN')}</span>
                          )}
                        </div>
                        {p.market_price && Number(p.market_price) > Number(p.price) && (
                          <span className="inline-block text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-1">
                            {Math.round((1 - p.price / p.market_price) * 100)}% off
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Bulk CTA */}
          <div className="bg-gray-800 rounded-2xl p-5 sm:p-8 text-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">📦</div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-2">Ready to Place a Bulk Order?</h3>
            <p className="text-gray-400 text-sm mb-5 sm:mb-6 max-w-lg mx-auto">
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
          <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-xs bg-gray-50 overflow-y-auto p-4 shadow-2xl">
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

      {sortOpen && <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />}
    </div>
  )
}
