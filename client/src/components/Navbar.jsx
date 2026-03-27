import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWholesale } from '../context/WholesaleContext'

const RETAIL_NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

const WHOLESALE_NAV_LINKS = [
  { to: '/wholesale/home', label: 'Home' },
  { to: '/wholesale/products', label: 'Products' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { totalItems } = useCart()
  const isWholesale = useWholesale()

  const NAV_LINKS = isWholesale ? WHOLESALE_NAV_LINKS : RETAIL_NAV_LINKS

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  const isActive = (to) => {
    if (to === '/wholesale/home') return location.pathname === '/wholesale/home'
    if (to === '/wholesale/products') return location.pathname.startsWith('/wholesale/products')
    return to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
  }

  const logoTo = isWholesale ? '/wholesale/home' : '/'

  return (
    <nav
      className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`}
      style={{ borderBottom: scrolled ? '1px solid #e5e7eb' : 'none' }}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={logoTo} className="flex items-center gap-3 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-lg py-1" id="navbar-logo">
            <img src="/Logo.png" alt="Bansal Fireworks" className="h-12 w-auto" />
            <div className="flex flex-col leading-tight">
              <span className="text-gray-900 font-bold text-lg">Bansal Fireworks</span>
              {isWholesale && (
                <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">B2B Wholesale</span>
              )}
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1 list-none" role="list">
            {NAV_LINKS.map((link, i) => (
              <li key={`${link.to}-${i}`}>
                <Link
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 ${
                    isActive(link.to)
                      ? 'text-green-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-current={isActive(link.to) ? 'page' : undefined}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-600 rounded-full" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart icon — only for retail */}
            {!isWholesale && (
              <Link
                to="/cart"
                className="relative p-2 rounded-lg text-gray-500 hover:text-green-700 hover:bg-green-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                aria-label={`Cart${totalItems > 0 ? ` — ${totalItems} item${totalItems !== 1 ? 's' : ''}` : ''}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            <Link
              to="/contact"
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 shadow-md hover:shadow-lg"
              id="navbar-inquiry-btn"
            >
              {isWholesale ? 'Request Quote' : 'Bulk Order Inquiry'}
            </Link>
          </div>

          {/* Mobile cart + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {!isWholesale && (
              <Link
                to="/cart"
                className="relative p-2 rounded-lg text-gray-500 hover:text-green-700 hover:bg-green-50 transition-colors"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-green-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            <button
              id="hamburger-btn"
              onClick={() => setMobileOpen(v => !v)}
              className="p-2 rounded-lg text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className="text-xl leading-none" aria-hidden="true">{mobileOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden border-t border-gray-100 bg-white overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
        aria-hidden={!mobileOpen}
      >
        <ul className="px-4 py-3 flex flex-col gap-1 list-none" role="list">
          {NAV_LINKS.map((link, i) => (
            <li key={`${link.to}-${i}`}>
              <Link
                to={link.to}
                className={`block px-4 py-3 rounded text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-green-50'
                }`}
                aria-current={isActive(link.to) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-3">
            <Link
              to="/contact"
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-3 rounded transition-colors shadow-md"
            >
              {isWholesale ? 'Request Quote' : 'Bulk Order Inquiry'}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
