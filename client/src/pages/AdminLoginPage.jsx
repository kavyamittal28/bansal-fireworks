import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail?.message || data.message || 'Invalid credentials')
      localStorage.setItem('adminToken', data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link to="/" id="admin-logo">
          <img src="/Logo.png" alt="Bansal Fireworks" className="h-10 w-auto" />
        </Link>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm transition-colors">
          <span>❓</span>
          Support
        </button>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-500 text-sm mt-1">Secure access for authorized personnel only</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Auth badge */}
            <div className="bg-blue-50 py-6 flex flex-col items-center gap-2 border-b border-gray-100">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl border border-blue-100">
                🔐
              </div>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-widest">Authentication</p>
            </div>

            {/* Form */}
            <div className="p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} id="admin-login-form" className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉️</span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="admin@bansalfireworks.com"
                      className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-700 text-sm font-medium" htmlFor="password">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-blue-600 text-xs hover:text-blue-700 transition-colors font-medium"
                      id="forgot-password-btn"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full border border-gray-300 rounded-xl pl-10 pr-12 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      id="toggle-password-btn"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    id="remember-checkbox"
                  />
                  <span className="text-gray-600 text-sm">Remember this device</span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm"
                  id="admin-login-btn"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    'Login to Dashboard →'
                  )}
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-gray-400 text-xs uppercase tracking-widest mt-6">
                  Bansal Fireworks Industrial Management System
                </p>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Privacy Policy</a>
                  <span className="text-gray-300">·</span>
                  <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Terms of Service</a>
                  <span className="text-gray-300">·</span>
                  <Link to="/contact" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Contact</Link>
                </div>
            </div>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            © 2026 Bansal Fireworks. All rights reserved. Professional Grade Pyrotechnics.
          </p>
        </div>
      </div>
    </div>
  )
}
