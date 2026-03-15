import { useState } from 'react'
import { Link } from 'react-router-dom'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Catalog' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Wholesale' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subError, setSubError] = useState('')

  function handleSubscribe(e) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubError('Please enter a valid email.')
      return
    }
    setSubscribed(true)
    setSubError('')
  }

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 pb-8 sm:pb-10 border-b border-gray-200">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
              <img src="/Logo.png" alt="Bansal Fireworks" className="h-10 w-auto" />
              <span className="text-gray-900 font-bold text-base">Bansal Fireworks</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              India's trusted fireworks brand. Safe, vibrant, and celebrated across the country for 30+ years.
            </p>
            <address className="not-italic flex items-start gap-2 text-gray-500 text-sm">
              <span aria-hidden="true">📍</span>
              <span>Sadulshahar, Sri Ganganagar,<br />Rajasthan 335062</span>
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-3 list-none">
              {QUICK_LINKS.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-gray-900 font-semibold text-sm mb-4">Company</h3>
            <ul className="flex flex-col gap-3 list-none">
              {[
                { label: 'Our Story', to: '/about' },
                { label: 'Safety Standards', to: '/about' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Admin Portal', to: '/admin/login' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-gray-900 font-semibold text-sm mb-2">Newsletter</h3>
            <p className="text-gray-500 text-sm mb-4">Stay updated on new collections and seasonal offers.</p>
            {subscribed ? (
              <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
                ✅ You're subscribed! Watch your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} id="newsletter-form" noValidate>
                <div className="flex gap-2">
                  <label htmlFor="newsletter-email" className="sr-only">Your email address</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setSubError('') }}
                    placeholder="Your email"
                    className={`flex-1 border rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${subError ? 'border-red-300' : 'border-gray-300'}`}
                    aria-invalid={!!subError}
                    aria-describedby={subError ? 'newsletter-error' : undefined}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    aria-label="Subscribe to newsletter"
                  >
                    →
                  </button>
                </div>
                {subError && (
                  <p id="newsletter-error" className="text-red-500 text-xs mt-1.5" role="alert">{subError}</p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-gray-400 text-xs">© 2026 Bansal Fireworks. All rights reserved.</p>
          <nav aria-label="Footer legal links">
            <ul className="flex gap-3 sm:gap-6 list-none">
              {['Terms of Service', 'Privacy Policy', 'Refund Policy'].map(l => (
                <li key={l}>
                  <a href="#" className="text-gray-400 text-xs hover:text-blue-600 transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
