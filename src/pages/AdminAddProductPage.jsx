import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const CATEGORIES = ['Sparklers', 'Aerial Shows', 'Ground Shows', 'Novelty', 'Crackers', 'Gift Boxes', 'Other']
const BRANDS = ['Standard Fireworks', 'Cock Brand', 'Sivakasi Brand', 'Bansal Fireworks', 'Other']

const NAV_ITEMS = [
  { icon: '⊞', label: 'Dashboard', href: '/admin/dashboard' },
  { icon: '📦', label: 'Products', href: '/admin/add-product', active: true },
  { icon: '💬', label: 'Inquiries', href: '/admin/inquiries' },
  { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
]

export default function AdminAddProductPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    description: '',
    ecoFriendly: false,
    bestseller: false,
  })
  const [images, setImages] = useState([null, null, null]) // up to 3 image slots
  const [imageFiles, setImageFiles] = useState([null, null, null])
  const [activeSlot, setActiveSlot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  function handleImageClick(slotIndex) {
    setActiveSlot(slotIndex)
    fileInputRef.current?.click()
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file || activeSlot === null) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5 MB.'); return }
    const reader = new FileReader()
    reader.onload = ev => {
      setImages(prev => { const n = [...prev]; n[activeSlot] = ev.target.result; return n })
      setImageFiles(prev => { const n = [...prev]; n[activeSlot] = file; return n })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function handlePublish(e) {
    e.preventDefault()
    if (!form.name || !form.category || !form.price) { setError('Name, Category, and Price are required.'); return }
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const body = new FormData()
      Object.entries(form).forEach(([k, v]) => body.append(k, v))
      imageFiles.filter(Boolean).forEach(f => body.append('images', f))
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to add product.')
      navigate('/admin/add-product?success=1')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ── */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 fixed top-0 left-0 h-full">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🎆</span>
          </div>
          <span className="text-gray-900 font-bold text-sm">Bansal Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              id={`sidebar-${item.label.toLowerCase()}`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-gray-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">A</div>
          <div className="min-w-0">
            <p className="text-gray-900 text-sm font-semibold truncate">Admin User</p>
            <p className="text-gray-400 text-xs">Super Admin</p>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 ml-56 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-gray-900 font-bold text-xl">Add New Product</h1>
            <p className="text-gray-400 text-xs mt-0.5">Expand your fireworks catalog with new inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              id="cancel-btn"
            >
              Cancel
            </Link>
            <button
              onClick={handlePublish}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
              id="save-product-btn"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              Save Product
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-8 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Product Media */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-gray-900 font-semibold text-base mb-1">Product Media</h2>
              <p className="text-gray-400 text-sm mb-5">Upload high-quality images of the firework and its effect.</p>

              {/* Main upload zone */}
              <div
                className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all mb-4 h-48 ${
                  images[0] ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30'
                }`}
                onClick={() => handleImageClick(0)}
                onDrop={e => {
                  e.preventDefault()
                  const file = e.dataTransfer.files?.[0]
                  if (file) { setActiveSlot(0); const ev = { target: { files: [file] } }; handleImageChange(ev) }
                }}
                onDragOver={e => e.preventDefault()}
                id="main-upload-zone"
              >
                {images[0] ? (
                  <img src={images[0]} alt="Upload 1" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 text-blue-600 text-xl">
                      ☁️
                    </div>
                    <p className="text-gray-700 text-sm font-medium">Click to upload</p>
                    <p className="text-gray-400 text-xs mt-1">PNG, JPG or WebP (Max 5MB)</p>
                  </>
                )}
              </div>

              {/* Thumbnail slots */}
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map(i => (
                  <div
                    key={i}
                    className={`border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all h-24 ${
                      images[i] ? 'border-blue-300' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                    onClick={() => handleImageClick(i)}
                    id={`upload-slot-${i}`}
                  >
                    {images[i] ? (
                      <img src={images[i]} alt={`Slot ${i}`} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-gray-300 text-2xl">📷</span>
                    )}
                  </div>
                ))}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleImageChange}
                id="product-image-input"
              />
            </div>

            {/* Right: Forms */}
            <div className="flex flex-col gap-6">
              {/* Basic Information */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-blue-600 font-semibold text-base mb-5">Basic Information</h2>
                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                      Product Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Midnight Sky Rocket – XL Edition"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Category + Brand */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="">Select Category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="brand">
                        Brand
                      </label>
                      <select
                        id="brand"
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="">Select Brand</option>
                        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="price">
                      Price per Unit (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-blue-600 font-semibold text-base mb-5">Technical Specifications</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                      Full Description & Specs
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe the burst size, sound intensity, duration, and color effects…"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="ecoFriendly"
                        checked={form.ecoFriendly}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        id="eco-friendly-checkbox"
                      />
                      <span className="text-gray-600 text-sm">Eco-Friendly Grade</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="bestseller"
                        checked={form.bestseller}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        id="bestseller-checkbox"
                      />
                      <span className="text-gray-600 text-sm">Bestseller Badge</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setForm({ name:'', category:'', brand:'', price:'', description:'', ecoFriendly:false, bestseller:false })}
              className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              id="draft-btn"
            >
              Draft
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={loading}
              className="px-6 py-3 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-colors flex items-center gap-2"
              id="publish-catalog-btn"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              Publish to Catalog
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
