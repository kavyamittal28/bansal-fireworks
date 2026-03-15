import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-gray-800">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎆</span>
              <div>
                <div className="text-white font-bold text-base">Bansal Fireworks</div>
                <div className="text-amber-400 text-xs">Since 1994 · Sivakasi</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              India's trusted fireworks brand. Safe, vibrant, and celebrated across the country for 30+ years.
            </p>
            <div className="flex items-start gap-2 text-gray-400 text-sm">
              <span>📍</span>
              <span>123 Fireworks Industrial Area,<br/>Sivakasi, Tamil Nadu, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Explore</h4>
            <ul className="flex flex-col gap-3 list-none">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Our Products' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 text-sm hover:text-amber-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Help</h4>
            <ul className="flex flex-col gap-3 list-none">
              {['Bulk Orders', 'Shipping Info', 'Safety Guide', 'Return Policy'].map(l => (
                <li key={l}><a href="#" className="text-gray-400 text-sm hover:text-amber-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Reach Us</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+919876543210" className="flex items-center gap-2 text-gray-400 text-sm hover:text-amber-400 transition-colors">
                <span>📞</span> +91 98765 43210
              </a>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>🕐</span> Mon–Sat, 9 AM – 7 PM
              </div>
              <a href="mailto:sales@bansalfireworks.com" className="flex items-center gap-2 text-gray-400 text-sm hover:text-amber-400 transition-colors">
                <span>✉️</span> sales@bansalfireworks.com
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-gray-500 text-xs">© 2024 Bansal Fireworks. All rights reserved. Always follow safety guidelines.</p>
          <div className="flex gap-6">
            {['Terms', 'Privacy', 'Refund Policy'].map(l => (
              <a key={l} href="#" className="text-gray-500 text-xs hover:text-amber-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
