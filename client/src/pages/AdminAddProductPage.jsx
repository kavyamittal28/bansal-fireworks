import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

const MAX_SLOTS = 5
const MAX_VIDEOS = 2

export default function AdminAddProductPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fileInputRef = useRef(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === '1') {
      setSuccess(true)
      const t = setTimeout(() => setSuccess(false), 4000)
      return () => clearTimeout(t)
    }
  }, [searchParams])

  const [form, setForm] = useState({
    name: '', category: '', brand: '', price: '',
    market_price: '', stock: '', description: '',
    ecoFriendly: false, bestseller: false,
    order_type: 'both', case_to_piece_qty: '',
  })
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  const fetchCatalog = useCallback(async () => {
    const [catsRes, brandsRes] = await Promise.all([fetch('/api/categories'), fetch('/api/brands')])
    const [cats, brnds] = await Promise.all([catsRes.json(), brandsRes.json()])
    if (Array.isArray(cats)) setCategories(cats)
    if (Array.isArray(brnds)) setBrands(brnds)
  }, [])

  useEffect(() => { fetchCatalog() }, [fetchCatalog])

  const [mediapreviews, setMediaPreviews] = useState(Array(MAX_SLOTS).fill(null))
  const [mediaFiles, setMediaFiles] = useState(Array(MAX_SLOTS).fill(null))
  const [activeSlot, setActiveSlot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  function handleSlotClick(slotIndex) {
    setActiveSlot(slotIndex)
    fileInputRef.current?.click()
  }

  function removeSlot(e, slotIndex) {
    e.stopPropagation()
    setMediaPreviews(prev => { const n = [...prev]; n[slotIndex] = null; return n })
    setMediaFiles(prev => { const n = [...prev]; n[slotIndex] = null; return n })
    setError('')
  }

  function handleMediaChange(e) {
    const file = e.target.files?.[0]
    if (!file || activeSlot === null) return
    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')
    if (!isVideo && !isImage) { setError('Only image (PNG/JPG/WebP) or video files are allowed.'); e.target.value = ''; return }
    if (file.size > 50 * 1024 * 1024) { setError('File must be under 50 MB.'); e.target.value = ''; return }
    const currentVideos = mediaFiles.filter((f, i) => i !== activeSlot && f && f.type.startsWith('video/')).length
    if (isVideo && currentVideos >= MAX_VIDEOS) {
      setError(`You can upload a maximum of ${MAX_VIDEOS} videos.`)
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = ev => {
      setMediaPreviews(prev => { const n = [...prev]; n[activeSlot] = { src: ev.target.result, isVideo }; return n })
      setMediaFiles(prev => { const n = [...prev]; n[activeSlot] = file; return n })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
    setError('')
  }

  async function handlePublish(e) {
    e.preventDefault()
    if (!form.name || !form.category || !form.price) { setError('Name, Category, and Price are required.'); return }
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const body = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'stock' || k === 'market_price' || k === 'case_to_piece_qty') {
          if (v !== '' && v !== null && v !== undefined) body.append(k, v)
        } else {
          body.append(k, v)
        }
      })
      mediaFiles.filter(Boolean).forEach(f => body.append('images', f))
      const res = await fetch('/api/admin/add-product', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail?.message || data.message || 'Failed to add product.')
      setForm({ name: '', category: '', brand: '', price: '', market_price: '', stock: '', description: '', ecoFriendly: false, bestseller: false, order_type: 'both', case_to_piece_qty: '' })
      setMediaPreviews(Array(MAX_SLOTS).fill(null))
      setMediaFiles(Array(MAX_SLOTS).fill(null))
      navigate('/admin/add-product?success=1')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const headerRight = (
    <>
      <Link
        to="/admin/dashboard"
        className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cancel
      </Link>
      <button
        onClick={handlePublish}
        disabled={loading}
        className="px-3 sm:px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
      >
        {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        Save Product
      </button>
    </>
  )

  return (
    <AdminLayout
      activeHref="/admin/add-product"
      headerTitle="Add New Product"
      headerSubtitle="Expand your fireworks catalog with new inventory"
      headerRight={headerRight}
    >
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          ✅ Product published to catalog successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Product Media */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-gray-900 font-semibold text-base">Product Media</h2>
            <span className="text-xs text-gray-400">
              {mediaFiles.filter(Boolean).length}/{MAX_SLOTS} &middot; {mediaFiles.filter(f => f && f.type.startsWith('video/')).length}/{MAX_VIDEOS} videos
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-4">Up to 5 files (images or videos). Max 2 videos.</p>

          {/* Slot 0 */}
          <div
            className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all mb-3 h-44 sm:h-48 relative overflow-hidden ${
              mediapreviews[0] ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30'
            }`}
            onClick={() => handleSlotClick(0)}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) { setActiveSlot(0); handleMediaChange({ target: { files: [f] } }) } }}
            onDragOver={e => e.preventDefault()}
          >
            {mediapreviews[0] ? (
              <>
                {mediapreviews[0].isVideo
                  ? <video src={mediapreviews[0].src} className="w-full h-full object-cover rounded-xl" muted />
                  : <img src={mediapreviews[0].src} alt="Slot 0" className="w-full h-full object-cover rounded-xl" />}
                {mediapreviews[0].isVideo && <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">Video</span>}
                <button type="button" onClick={e => removeSlot(e, 0)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs">✕</button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 text-blue-600 text-xl">☁️</div>
                <p className="text-gray-700 text-sm font-medium">Click to upload</p>
                <p className="text-gray-400 text-xs mt-1">Image or video · Max 50 MB</p>
              </>
            )}
          </div>

          {/* Slots 1–4 */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i}
                className={`border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all h-20 sm:h-24 relative overflow-hidden ${
                  mediapreviews[i] ? 'border-blue-300' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30'
                }`}
                onClick={() => handleSlotClick(i)}
              >
                {mediapreviews[i] ? (
                  <>
                    {mediapreviews[i].isVideo
                      ? <video src={mediapreviews[i].src} className="w-full h-full object-cover rounded-xl" muted />
                      : <img src={mediapreviews[i].src} alt={`Slot ${i}`} className="w-full h-full object-cover rounded-xl" />}
                    {mediapreviews[i].isVideo && <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">Video</span>}
                    <button type="button" onClick={e => removeSlot(e, i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs">✕</button>
                  </>
                ) : (
                  <span className="text-gray-300 text-2xl">+</span>
                )}
              </div>
            ))}
          </div>

          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,video/*"
            className="hidden" onChange={handleMediaChange} />
        </div>

        {/* Right: Forms */}
        <div className="flex flex-col gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-blue-600 font-semibold text-base mb-5">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">Product Name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. Midnight Sky Rocket – XL Edition"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">Category</label>
                  <select id="category" name="category" value={form.category} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="brand">Brand</label>
                  <select id="brand" name="brand" value={form.brand} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white">
                    <option value="">Select Brand</option>
                    {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="price">Sale Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
                    <input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange}
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="market_price">Market Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
                    <input id="market_price" name="market_price" type="number" min="0" step="0.01" value={form.market_price} onChange={handleChange}
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="stock">
                  Stock Quantity <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input id="stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange}
                  placeholder="e.g. 100"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-blue-600 font-semibold text-base mb-5">Technical Specifications</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">Full Description & Specs</label>
                <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange}
                  placeholder="Describe the burst size, sound intensity, duration, and color effects…"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="ecoFriendly" checked={form.ecoFriendly} onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-600 text-sm">Eco-Friendly Grade</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="bestseller" checked={form.bestseller} onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-600 text-sm">Bestseller Badge</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Quantity */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-blue-600 font-semibold text-base mb-1">Order Quantity</h2>
            <p className="text-gray-400 text-sm mb-5">Set how this product can be ordered by customers.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">Ordering Method</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'pieces', label: 'Pieces only', desc: 'Sold per individual piece' },
                    { value: 'cases', label: 'Cases only', desc: 'Sold in bulk cases' },
                    { value: 'both', label: 'Pieces & Cases', desc: 'Customer can choose either' },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 cursor-pointer border rounded-xl p-3 flex-1 min-w-[130px] transition-all ${
                        form.order_type === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <input type="radio" name="order_type" value={opt.value}
                        checked={form.order_type === opt.value} onChange={handleChange}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500" />
                      <div>
                        <div className="text-gray-800 text-sm font-medium">{opt.label}</div>
                        <div className="text-gray-400 text-xs">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {(form.order_type === 'cases' || form.order_type === 'both') && (
                <div>
                  <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-2" htmlFor="case_to_piece_qty">
                    Case-to-Piece Quantity
                    <span className="relative group/tip">
                      <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover/tip:opacity-100 transition-opacity shadow-lg z-10 text-center">
                        Number of pieces in one case. Case price = price per piece × this quantity.
                        <span className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-gray-900" />
                      </span>
                    </span>
                  </label>
                  <input id="case_to_piece_qty" name="case_to_piece_qty" type="number" min="1" step="1"
                    value={form.case_to_piece_qty} onChange={handleChange} placeholder="e.g. 12"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  <p className="text-gray-400 text-xs mt-1.5">Case price = price per piece × this quantity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <button type="button"
          onClick={() => setForm({ name:'', category:'', brand:'', price:'', market_price:'', stock:'', description:'', ecoFriendly:false, bestseller:false, order_type:'both', case_to_piece_qty:'' })}
          className="px-5 sm:px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          Draft
        </button>
        <button type="button" onClick={handlePublish} disabled={loading}
          className="px-5 sm:px-6 py-3 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-colors flex items-center gap-2">
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          Publish to Catalog
        </button>
      </div>
    </AdminLayout>
  )
}
