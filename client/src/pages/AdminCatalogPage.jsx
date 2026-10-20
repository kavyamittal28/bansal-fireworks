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
function ItemRow({ item, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(item.name)
  const [editDesc, setEditDesc] = useState(item.description || '')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  function openEdit() {
    setEditName(item.name)
    setEditDesc(item.description || '')
    setImageFile(null)
    setImagePreview(null)
    setRemoveImage(false)
    setError('')
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setError('')
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed.'); return }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10 MB.'); return }
    setImageFile(file)
    setRemoveImage(false)
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
    setError('')
    e.target.value = ''
  }

  async function handleSave() {
    if (!editName.trim()) { setError('Name is required.'); return }
    setSaving(true)
    setError('')
    try {
      const fd = new FormData()
      if (editName.trim() !== item.name) {
        fd.append('name', editName.trim())
        fd.append('slug', slugify(editName))
      }
      if (editDesc.trim() !== (item.description || '')) {
        fd.append('description', editDesc.trim())
      }
      if (imageFile) fd.append('image', imageFile)
      else if (removeImage) fd.append('remove_image', 'true')
      await onUpdate(item.id, fd)
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const currentImage = removeImage ? null : (imagePreview || item.image_url)

  if (editing) {
    return (
      <div className="py-3 border-b border-gray-100 last:border-0">
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 cursor-pointer border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors relative group/img"
            >
              {currentImage ? (
                <>
                  <img src={currentImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Change</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <span className="text-lg">+</span>
                  <span className="text-[9px]">Image</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name"
              />
              <input
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description (optional)"
              />
            </div>
          </div>
          {currentImage && (
            <button
              type="button"
              onClick={() => { setRemoveImage(true); setImageFile(null); setImagePreview(null) }}
              className="self-start text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
            >
              Remove image
            </button>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              {saving && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Save
            </button>
            <button
              onClick={cancelEdit}
              disabled={saving}
              className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

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
      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
        <button
          onClick={openEdit}
          className="text-gray-400 hover:text-blue-600 text-xs font-medium transition-all px-2 py-1 rounded hover:bg-blue-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item)}
          className="text-red-400 hover:text-red-600 text-xs font-medium transition-all px-2 py-1 rounded hover:bg-red-50"
        >
          Delete
        </button>
      </div>
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

  async function updateCategory(id, formData) {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token()}` },
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.detail?.message || 'Failed to update category.')
    setCategories(prev => prev.map(c => c.id === id ? data : c).sort((a, b) => a.name.localeCompare(b.name)))
  }

  async function updateBrand(id, formData) {
    const res = await fetch(`/api/brands/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token()}` },
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.detail?.message || 'Failed to update brand.')
    setBrands(prev => prev.map(b => b.id === id ? data : b).sort((a, b) => a.name.localeCompare(b.name)))
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
                    <ItemRow key={cat.id} item={cat} onDelete={item => setConfirmItem({ item, type: 'category' })} onUpdate={updateCategory} />
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
                    <ItemRow key={brand.id} item={brand} onDelete={item => setConfirmItem({ item, type: 'brand' })} onUpdate={updateBrand} />
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
