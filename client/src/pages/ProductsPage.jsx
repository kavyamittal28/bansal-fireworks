import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const SORT_OPTIONS = [
  { id: 'default', label: 'Default Order' },
  { id: 'price_asc', label: 'Price: Low → High' },
  { id: 'price_desc', label: 'Price: High → Low' },
  { id: 'name_asc', label: 'Name: A → Z' },
]

function ProductCard({ p }) {
  const thumbnail = p.media?.[0]?.url
  const { addToCart } = useCart()

  const orderType = p.order_type || 'both'
  const canPieces = orderType === 'pieces' || orderType === 'both'
  const canCases = orderType === 'cases' || orderType === 'both'

  const [selectedType, setSelectedType] = useState(canPieces ? 'pieces' : 'cases')
  const [added, setAdded] = useState(false)

  function handleAddToCart(e) {
    e.preventDefault()
    e.stopPropagation()
    addToCart(p, selectedType, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col" id={`product-${p.id}`}>
      {/* Clickable area */}
      <Link to={`/products/${p.id}`} className="block">
        <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={p.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <svg className="w-14 h-14 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.20 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-3">
            {p.brand && (
              <span className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-semibold">
                {p.brand}
              </span>
            )}
            {p.category && (
              <span className="text-[11px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">
                {p.category}
              </span>
            )}
            {p.bestseller && (
              <span className="text-[11px] bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-bold">⭐ BESTSELLER</span>
            )}
            {p.eco_friendly && (
              <span className="text-[11px] bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">🌿 ECO</span>
            )}
          </div>
          <h3 className="text-gray-900 font-semibold text-sm mb-4 leading-snug line-clamp-2">{p.name}</h3>
          <div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-gray-900 font-bold text-xl">₹{Number(p.price).toLocaleString('en-IN')}</span>
              {p.market_price && Number(p.market_price) > Number(p.price) && (
                <span className="text-sm text-gray-400 line-through">₹{Number(p.market_price).toLocaleString('en-IN')}</span>
              )}
            </div>
            {p.market_price && Number(p.market_price) > Number(p.price) && (
              <span className="inline-block text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full mt-2">
                {Math.round((1 - p.price / p.market_price) * 100)}% OFF
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart — outside the Link */}
      <div className="px-5 pb-5 pt-2 border-t border-gray-100 flex items-center gap-2 mt-auto">
        {/* Type toggle (only when both are available) */}
        {canPieces && canCases && (
          <div className="flex rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
            <button
              onClick={e => { e.preventDefault(); setSelectedType('pieces') }}
              className={`px-3 py-1.5 text-[10px] font-bold transition-colors ${
                selectedType === 'pieces'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Pcs
            </button>
            <button
              onClick={e => { e.preventDefault(); setSelectedType('cases') }}
              className={`px-3 py-1.5 text-[10px] font-bold border-l border-gray-300 transition-colors ${
                selectedType === 'cases'
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              Case
            </button>
          </div>
        )}
        {!canPieces && canCases && (
          <span className="text-[10px] text-amber-600 font-bold">Case</span>
        )}
        {canPieces && !canCases && (
          <span className="text-[10px] text-gray-600 font-bold">Pieces</span>
        )}

        <button
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg transition-all duration-200 ${
            added
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-600 hover:text-white'
          }`}
        >
          {added ? '✓ Added' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  )
}

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
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          fetch('/api/get-products'),
          fetch('/api/categories'),
          fetch('/api/brands'),
        ])
        if (!productsRes.ok) throw new Error('Failed to load products')
        const [productsData, categoriesData, brandsData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
          brandsRes.json(),
        ])
        setProducts(productsData)
        setBrands([
          { id: 'all', label: 'All Brands' },
          ...brandsData.map(b => ({ id: b.name, label: b.name })),
        ])
        setCategories(categoriesData.map(c => c.name))
      } catch (err) {
        setFetchError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
          <div>
            <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-2">Premium Selection</p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">Our Collection</h1>
            <p className="text-gray-600 text-sm mt-2">Transparent pricing on premium fireworks & firecrackers.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder="Search by name, brand..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl pl-12 pr-12 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition-all duration-200"
              aria-label="Search products"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg hover:scale-110 transition-transform"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex-1 min-w-0">
          {/* Search Results Summary */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              {search || selectedBrand !== 'all' || selectedCategory ? (
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{sorted.length}</span> product{sorted.length !== 1 ? 's' : ''} found
                  {search && <span> for "<span className="font-medium">{search}</span>"</span>}
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{sorted.length}</span> product{sorted.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative">
              <button
                onClick={() => setSortOpen(v => !v)}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                aria-expanded={sortOpen}
                id="sort-btn"
              >
                ↕️ Sort
              </button>
              {sortOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-20 py-2 min-w-[200px]">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { setSortBy(opt.id); setSortOpen(false) }}
                      className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                        sortBy === opt.id ? 'text-amber-700 bg-amber-50 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {(selectedBrand !== 'all' || selectedCategory || search) && (
              <button onClick={resetFilters} className="text-xs text-white bg-amber-600 hover:bg-amber-700 font-bold px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">↻ Clear All Filters</button>
            )}
          </div>

          {/* Filter Groups */}
          <div className="mb-10 space-y-5">
            {/* Brand Filters */}
            {brands.length > 1 && (
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  Brand
                  {selectedBrand !== 'all' && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-amber-600 text-white rounded-full">
                      1
                    </span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by brand">
                  {brands.map(brand => {
                    const isActive = selectedBrand === brand.id
                    return (
                      <button
                        key={brand.id}
                        onClick={() => setSelectedBrand(isActive && brand.id !== 'all' ? 'all' : brand.id)}
                        className={`text-xs font-semibold px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                          isActive
                            ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-amber-400 hover:text-amber-600'
                        }`}
                        aria-pressed={isActive}
                      >
                        {brand.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Category Filters */}
            {categories.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  Category
                  {selectedCategory && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-amber-600 text-white rounded-full">
                      1
                    </span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`text-xs font-semibold px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                      !selectedCategory
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-amber-400 hover:text-amber-600'
                    }`}
                    aria-pressed={!selectedCategory}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => {
                    const isActive = selectedCategory === cat
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(isActive ? null : cat)}
                        className={`text-xs font-semibold px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                          isActive
                            ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-amber-400 hover:text-amber-600'
                        }`}
                        aria-pressed={isActive}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                  <div className="p-5 space-y-4">
                    <div className="flex gap-2">
                      <div className="h-5 bg-gray-200 rounded-full w-1/4 animate-pulse" />
                      <div className="h-5 bg-gray-200 rounded-full w-1/3 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                    </div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fetch error */}
          {fetchError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4 mb-8 font-semibold">
              ⚠️ {fetchError}
            </div>
          )}

          {/* Empty state */}
          {!loading && !fetchError && sorted.length === 0 && (
            <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-amber-50 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="text-7xl mb-8">🔍</div>
              <h3 className="text-gray-900 font-serif font-bold text-2xl mb-4">No Products Found</h3>
              {products.length === 0 ? (
                <p className="text-gray-600 text-base mb-8 max-w-md mx-auto">
                  No products have been added yet. Use the admin portal to add some premium fireworks to get started.
                </p>
              ) : (
                <>
                  <p className="text-gray-600 text-base mb-4">
                    {search && <span>No products match "<strong>{search}</strong>"</span>}
                    {(selectedBrand !== 'all' || selectedCategory) && !search && <span>No products match your filters</span>}
                  </p>
                  <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
                    Try adjusting your search terms or removing some filters to find what you're looking for.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    ↻ Clear All Filters
                  </button>
                </>
              )}
            </div>
          )}

          {/* Product Grid */}
          {!loading && sorted.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
              {sorted.map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          )}

          {/* Bulk CTA */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 sm:p-12 text-center border border-gray-700">
            <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6 text-white text-2xl shadow-lg">📦</div>
            <h3 className="text-white font-serif font-bold text-2xl sm:text-3xl mb-4">Bulk Order Inquiry</h3>
            <p className="text-gray-300 text-base mb-8 max-w-2xl mx-auto leading-relaxed">
              Special tiered pricing and dedicated support for wholesale buyers, retailers, and event organizers. Get a personalized quote tailored to your needs.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              id="send-bulk-inquiry-btn"
            >
              Request a Quote
            </Link>
            <p className="text-gray-400 text-xs mt-6 font-semibold">Response within 2–4 hours</p>
          </div>
        </div>
      </div>

      {sortOpen && <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />}
    </div>
  )
}
