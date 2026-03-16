import { useState, useEffect, useCallback, useRef } from 'react'
import AdminLayout from '../components/AdminLayout'
import ConfirmModal from '../components/ConfirmModal'

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ── Reusable add-form ──────────────────────────────────────────────────────────
function AddForm({ label, onAdd }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed.'); return }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10 MB.'); return }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
    setError('')
    e.target.value = ''
  }

  function removeImage(e) {
    e.stopPropagation()
    setImageFile(null)
    setImagePreview(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Name is required.'); return }
    setLoading(true)
    setError('')
    try {
      await onAdd({ name: name.trim(), slug: slugify(name), description: description.trim() || undefined, imageFile })
      setName('')
      setDescription('')
      setImageFile(null)
      setImagePreview(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div>
        <label className="block text-gray-600 text-xs font-medium mb-1">Name *</label>
        <input
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
          placeholder={`e.g. ${label === 'Category' ? 'Sparklers' : 'Bansal Fireworks'}`}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {name && (
          <p className="text-gray-400 text-xs mt-1">Slug: <span className="font-mono">{slugify(name)}</span></p>
        )}
      </div>
      <div>
        <label className="block text-gray-600 text-xs font-medium mb-1">Description <span className="text-gray-400">(optional)</span></label>
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Short description…"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-gray-600 text-xs font-medium mb-1">Image <span className="text-gray-400">(optional)</span></label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-colors flex items-center justify-center overflow-hidden ${
            imagePreview ? 'border-blue-300 h-28' : 'border-gray-200 hover:border-blue-300 h-20'
          }`}
        >
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs"
              >✕</button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-lg">🖼️</span>
              <span className="text-xs">Click to upload image</span>
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="self-start flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        Add {label}
      </button>
    </form>
  )
}

// ── Reusable item row ──────────────────────────────────────────────────────────
function ItemRow({ item, onDelete }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
          {item.image_url
            ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-base">🏷️</div>
          }
        </div>
        <div className="min-w-0">
          <p className="text-gray-900 text-sm font-medium">{item.name}</p>
          <p className="text-gray-400 text-xs font-mono">{item.slug}</p>
          {item.description && <p className="text-gray-400 text-xs mt-0.5 truncate">{item.description}</p>}
        </div>
      </div>
      <button
        onClick={() => onDelete(item)}
        className="text-red-400 hover:text-red-600 text-xs font-medium transition-all px-2 py-1 rounded hover:bg-red-50 flex-shrink-0 ml-2"
      >
        Delete
      </button>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AdminCatalogPage() {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loadingCats, setLoadingCats] = useState(true)
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [confirmItem, setConfirmItem] = useState(null) // { item, type: 'category'|'brand' }
  const [confirmDeleting, setConfirmDeleting] = useState(false)

  const token = () => localStorage.getItem('adminToken')

  const fetchCategories = useCallback(async () => {
    setLoadingCats(true)
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } finally { setLoadingCats(false) }
  }, [])

  const fetchBrands = useCallback(async () => {
    setLoadingBrands(true)
    try {
      const res = await fetch('/api/brands')
      const data = await res.json()
      setBrands(Array.isArray(data) ? data : [])
    } finally { setLoadingBrands(false) }
  }, [])

  useEffect(() => { fetchCategories(); fetchBrands() }, [fetchCategories, fetchBrands])

  async function addCategory({ name, slug, description, imageFile }) {
    const fd = new FormData()
    fd.append('name', name)
    fd.append('slug', slug)
    if (description) fd.append('description', description)
    if (imageFile) fd.append('image', imageFile)
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token()}` },
      body: fd,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.detail?.message || 'Failed to add category.')
    setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
  }

  async function deleteCategory(id) {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` },
    })
    if (!res.ok) { const d = await res.json(); throw new Error(d?.detail?.message || 'Failed to delete.') }
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  async function addBrand({ name, slug, description, imageFile }) {
    const fd = new FormData()
    fd.append('name', name)
    fd.append('slug', slug)
    if (description) fd.append('description', description)
    if (imageFile) fd.append('image', imageFile)
    const res = await fetch('/api/brands', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token()}` },
      body: fd,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.detail?.message || 'Failed to add brand.')
    setBrands(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
  }

  async function deleteBrand(id) {
    const res = await fetch(`/api/brands/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` },
    })
    if (!res.ok) { const d = await res.json(); throw new Error(d?.detail?.message || 'Failed to delete.') }
    setBrands(prev => prev.filter(b => b.id !== id))
  }

  async function handleConfirmDelete() {
    if (!confirmItem) return
    setConfirmDeleting(true)
    try {
      if (confirmItem.type === 'category') await deleteCategory(confirmItem.item.id)
      else await deleteBrand(confirmItem.item.id)
      setConfirmItem(null)
    } catch {
      // silent
    } finally {
      setConfirmDeleting(false)
    }
  }

  return (
    <>
      {confirmItem && (
        <ConfirmModal
          title={`Delete ${confirmItem.type}?`}
          message={`"${confirmItem.item.name}" will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete"
          loading={confirmDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmItem(null)}
        />
      )}
      <AdminLayout
        activeHref="/admin/catalog"
        headerTitle="Catalog"
        headerSubtitle="Manage product categories and brands"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Categories ── */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-gray-900 font-semibold text-base mb-0.5">Categories</h2>
              <p className="text-gray-400 text-sm">Add or remove product categories.</p>
            </div>

            <AddForm label="Category" onAdd={addCategory} />

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Existing ({categories.length})</p>
              </div>
              {loadingCats ? (
                <p className="text-gray-400 text-sm py-4 text-center">Loading…</p>
              ) : categories.length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center">No categories yet.</p>
              ) : (
                <div>
                  {categories.map(cat => (
                    <ItemRow key={cat.id} item={cat} onDelete={item => setConfirmItem({ item, type: 'category' })} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Brands ── */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-gray-900 font-semibold text-base mb-0.5">Brands</h2>
              <p className="text-gray-400 text-sm">Add or remove product brands.</p>
            </div>

            <AddForm label="Brand" onAdd={addBrand} />

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Existing ({brands.length})</p>
              </div>
              {loadingBrands ? (
                <p className="text-gray-400 text-sm py-4 text-center">Loading…</p>
              ) : brands.length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center">No brands yet.</p>
              ) : (
                <div>
                  {brands.map(brand => (
                    <ItemRow key={brand.id} item={brand} onDelete={item => setConfirmItem({ item, type: 'brand' })} />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </AdminLayout>
    </>
  )
}
