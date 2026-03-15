import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

const MAX_SLOTS = 5
const MAX_VIDEOS = 2

export default function AdminEditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    name: '', category: '', brand: '', price: '',
    market_price: '', stock: '', description: '',
    ecoFriendly: false, bestseller: false,
  })
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  const [existingMedia, setExistingMedia] = useState([])
  const [mediaPreviews, setMediaPreviews] = useState(Array(MAX_SLOTS).fill(null))
  const [mediaFiles, setMediaFiles] = useState(Array(MAX_SLOTS).fill(null))
  const [removedPublicIds, setRemovedPublicIds] = useState([])

  const [activeSlot, setActiveSlot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setFetching(true)
    try {
      const [prodRes, catsRes, brandsRes] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch('/api/categories'),
        fetch('/api/brands'),
      ])
      const [prod, cats, brnds] = await Promise.all([prodRes.json(), catsRes.json(), brandsRes.json()])

      if (!prodRes.ok) { setError('Product not found.'); return }

      setForm({
        name: prod.name || '',
        category: prod.category || '',
        brand: prod.brand || '',
        price: prod.price ?? '',
        market_price: prod.market_price ?? '',
        stock: prod.stock ?? '',
        description: prod.description || '',
        ecoFriendly: prod.eco_friendly || false,
        bestseller: prod.bestseller || false,
      })

      const media = Array.isArray(prod.media) ? prod.media : []
      setExistingMedia(media)
      const previews = Array(MAX_SLOTS).fill(null)
      media.slice(0, MAX_SLOTS).forEach((m, i) => {
        previews[i] = { src: m.url, isVideo: m.resource_type === 'video', existing: true, public_id: m.public_id }
      })
      setMediaPreviews(previews)

      if (Array.isArray(cats)) setCategories(cats)
      if (Array.isArray(brnds)) setBrands(brnds)
    } catch {
      setError('Failed to load product.')
    } finally {
      setFetching(false)
    }
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

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
    const preview = mediaPreviews[slotIndex]
    if (preview?.existing && preview?.public_id) {
      setRemovedPublicIds(prev => [...prev, preview.public_id])
    }
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
      setError(`Maximum ${MAX_VIDEOS} videos allowed.`)
      e.target.value = ''
      return
    }
    const prev = mediaPreviews[activeSlot]
    if (prev?.existing && prev?.public_id) {
      setRemovedPublicIds(p => [...p, prev.public_id])
    }
    const reader = new FileReader()
    reader.onload = ev => {
      setMediaPreviews(p => { const n = [...p]; n[activeSlot] = { src: ev.target.result, isVideo }; return n })
      setMediaFiles(p => { const n = [...p]; n[activeSlot] = file; return n })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
    setError('')
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name || !form.category || !form.price) { setError('Name, Category, and Price are required.'); return }
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const body = new FormData()
      body.append('name', form.name)
      body.append('category', form.category)
      body.append('brand', form.brand)
      body.append('price', form.price)
      if (form.market_price !== '') body.append('market_price', form.market_price)
      if (form.stock !== '') body.append('stock', form.stock)
      body.append('description', form.description)
      body.append('ecoFriendly', form.ecoFriendly)
      body.append('bestseller', form.bestseller)
      mediaFiles.filter(Boolean).forEach(f => body.append('images', f))

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail?.message || data.message || 'Failed to update product.')
      navigate('/admin/dashboard?updated=1')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Loading product…</span>
      </div>
    )
  }

  const videoCount = mediaFiles.filter(f => f && f.type.startsWith('video/')).length

  const headerRight = (
    <>
      <Link
        to="/admin/dashboard"
        className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cancel
      </Link>
      <button
        onClick={handleSave}
        disabled={loading}
        className="px-3 sm:px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
      >
        {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        Save Changes
      </button>
    </>
  )

  return (
    <AdminLayout
      activeHref="/admin/add-product"
      headerTitle="Edit Product"
      headerSubtitle="Update product details"
      headerRight={headerRight}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Media */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-gray-900 font-semibold text-base">Product Media</h2>
            <span className="text-xs text-gray-400">
              {mediaPreviews.filter(Boolean).length}/{MAX_SLOTS} &middot; {videoCount}/{MAX_VIDEOS} videos
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-5">
            Up to 5 files. Existing images are shown — click a slot to replace, ✕ to remove.
          </p>

          {/* Slot 0 */}
          <div
            className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all mb-3 h-48 relative overflow-hidden ${
              mediaPreviews[0] ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30'
            }`}
            onClick={() => handleSlotClick(0)}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) { setActiveSlot(0); handleMediaChange({ target: { files: [f] } }) } }}
            onDragOver={e => e.preventDefault()}
          >
            {mediaPreviews[0] ? (
              <>
                {mediaPreviews[0].isVideo
                  ? <video src={mediaPreviews[0].src} className="w-full h-full object-cover rounded-xl" muted />
                  : <img src={mediaPreviews[0].src} alt="Slot 0" className="w-full h-full object-cover rounded-xl" />
                }
                {mediaPreviews[0].isVideo && <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">Video</span>}
                {mediaPreviews[0].existing && <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">Saved</span>}
                <button type="button" onClick={e => removeSlot(e, 0)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs"
                >✕</button>
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
                className={`border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all h-24 relative overflow-hidden ${
                  mediaPreviews[i] ? 'border-blue-300' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30'
                }`}
                onClick={() => handleSlotClick(i)}
              >
                {mediaPreviews[i] ? (
                  <>
                    {mediaPreviews[i].isVideo
                      ? <video src={mediaPreviews[i].src} className="w-full h-full object-cover rounded-xl" muted />
                      : <img src={mediaPreviews[i].src} alt={`Slot ${i}`} className="w-full h-full object-cover rounded-xl" />
                    }
                    {mediaPreviews[i].isVideo && <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">Video</span>}
                    {mediaPreviews[i].existing && <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">Saved</span>}
                    <button type="button" onClick={e => removeSlot(e, i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs"
                    >✕</button>
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

        {/* Right: Form */}
        <div className="flex flex-col gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-blue-600 font-semibold text-base mb-5">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">Product Name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. Midnight Sky Rocket"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">Category</label>
                  <select id="category" name="category" value={form.category} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="brand">Brand</label>
                  <select id="brand" name="brand" value={form.brand} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
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
                      className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="market_price">Market Price / MRP (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">₹</span>
                    <input id="market_price" name="market_price" type="number" min="0" step="0.01" value={form.market_price} onChange={handleChange}
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="stock">
                  Stock Quantity <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input id="stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange}
                  placeholder="e.g. 100"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-blue-600 font-semibold text-base mb-5">Technical Specifications</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">Full Description & Specs</label>
                <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange}
                  placeholder="Describe the burst size, sound intensity, duration, and color effects…"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
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
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <Link to="/admin/dashboard"
          className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
        <button type="button" onClick={handleSave} disabled={loading}
          className="px-6 py-3 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-colors flex items-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          Save Changes
        </button>
      </div>
    </AdminLayout>
  )
}
