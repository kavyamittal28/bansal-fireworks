import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWholesale } from '../context/WholesaleContext'

const RETAIL_QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Catalog' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

const WHOLESALE_QUICK_LINKS = [
  { to: '/wholesale/home', label: 'Home' },
  { to: '/wholesale/products', label: 'Catalog' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subError, setSubError] = useState('')
  const isWholesale = useWholesale()

  const QUICK_LINKS = isWholesale ? WHOLESALE_QUICK_LINKS : RETAIL_QUICK_LINKS
  const logoTo = isWholesale ? '/wholesale/home' : '/'

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
    <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 pb-10 sm:pb-12 border-b border-gray-800">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to={logoTo} className="flex items-center gap-2 mb-6 w-fit">
              <img src="/Logo.png" alt="Bansal Fireworks" className="h-12 w-auto" />
              <span className="text-white font-serif font-bold text-lg">Bansal Fireworks</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              India's most trusted fireworks manufacturer. Celebrating special moments since 1994 with quality, safety, and excellence.
            </p>
            <address className="not-italic flex items-start gap-3 text-gray-400 text-sm">
              <span aria-hidden="true">📍</span>
              <span>Sadulshahar, Sri Ganganagar,<br />Rajasthan 335062</span>
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-6">Navigation</h3>
            <ul className="flex flex-col gap-3 list-none">
              {QUICK_LINKS.map((l, i) => (
                <li key={`${l.to}-${i}`}>
                  <Link to={l.to} className="text-gray-400 text-sm hover:text-amber-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-6">Company</h3>
            <ul className="flex flex-col gap-3 list-none">
              {[
                { label: 'Our Story', to: '/about' },
                { label: 'Safety Standards', to: '/about' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Admin Portal', to: '/admin/login' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-gray-400 text-sm hover:text-amber-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-5">Get updates on new collections and seasonal offers.</p>
            {subscribed ? (
              <div className="bg-green-900/30 border border-green-700/50 text-green-300 text-xs rounded-lg px-4 py-3 flex items-center gap-2">
                ✓ Subscribed! Check your inbox.
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
                    className={`flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${subError ? 'border-red-600' : 'border-gray-700'}`}
                    aria-invalid={!!subError}
                    aria-describedby={subError ? 'newsletter-error' : undefined}
                  />
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    aria-label="Subscribe to newsletter"
                  >
                    →
                  </button>
                </div>
                {subError && (
                  <p id="newsletter-error" className="text-red-400 text-xs mt-2" role="alert">{subError}</p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10">
          <p className="text-gray-500 text-xs">© 2026 Bansal Fireworks. All rights reserved.</p>
          <nav aria-label="Footer legal links">
            <ul className="flex gap-4 sm:gap-8 list-none">
              {['Terms of Service', 'Privacy Policy', 'Refund Policy'].map(l => (
                <li key={l}>
                  <a href="#" className="text-gray-500 text-xs hover:text-amber-400 transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
