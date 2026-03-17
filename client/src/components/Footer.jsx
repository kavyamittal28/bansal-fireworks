import { useState } from 'react'
import { Link } from 'react-router-dom'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Product Catalog' },
  { to: '/about', label: 'Our Story' },
  { to: '/contact', label: 'Wholesale Inquiry' },
]

const COMPANY_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Safety Standards', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Admin Portal', to: '/admin/login' },
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
    <footer className="bg-stone-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 w-fit group">
              <img src="/Logo.png" alt="Bansal Fireworks" className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg tracking-tight">Bansal Fireworks</span>
                <span className="text-amber-500 text-[10px] font-medium tracking-widest uppercase">Est. 1994</span>
              </div>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              India's trusted fireworks manufacturer. Premium quality, certified safety, and vibrant celebrations for over 30 years.
            </p>
            <address className="not-italic flex items-start gap-3 text-stone-400 text-sm">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>Sadulshahar, Sri Ganganagar,<br />Rajasthan 335062</span>
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-red-700 to-amber-500 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3.5 list-none">
              {QUICK_LINKS.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-stone-400 text-sm hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-stone-600 group-hover:bg-amber-500 transition-colors"></span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-red-700 to-amber-500 rounded-full"></span>
              Company
            </h3>
            <ul className="flex flex-col gap-3.5 list-none">
              {COMPANY_LINKS.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-stone-400 text-sm hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-stone-600 group-hover:bg-amber-500 transition-colors"></span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-red-700 to-amber-500 rounded-full"></span>
              Stay Updated
            </h3>
            <p className="text-stone-400 text-sm mb-5">Get notified about new collections and seasonal offers.</p>
            {subscribed ? (
              <div className="bg-emerald-900/30 border border-emerald-700/50 text-emerald-400 text-sm rounded-xl px-4 py-3.5 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                You're subscribed! Watch your inbox.
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
                    placeholder="Enter your email"
                    className={`flex-1 bg-stone-800 border rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all ${subError ? 'border-red-500' : 'border-stone-700'}`}
                    aria-invalid={!!subError}
                    aria-describedby={subError ? 'newsletter-error' : undefined}
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20"
                    aria-label="Subscribe to newsletter"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
                {subError && (
                  <p id="newsletter-error" className="text-red-400 text-xs mt-2" role="alert">{subError}</p>
                )}
              </form>
            )}
            
            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-stone-800 space-y-3">
              <a href="tel:+919587638000" className="flex items-center gap-3 text-stone-400 text-sm hover:text-amber-500 transition-colors">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 95876 38000
              </a>
              <a href="mailto:Nikhilbnsl380@gmail.com" className="flex items-center gap-3 text-stone-400 text-sm hover:text-amber-500 transition-colors">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Nikhilbnsl380@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-stone-500 text-xs">
              &copy; 2026 Bansal Fireworks. All rights reserved.
            </p>
            <nav aria-label="Footer legal links">
              <ul className="flex items-center gap-6 list-none">
                {['Terms of Service', 'Privacy Policy', 'Refund Policy'].map(l => (
                  <li key={l}>
                    <a href="#" className="text-stone-500 text-xs hover:text-amber-500 transition-colors duration-200">{l}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
