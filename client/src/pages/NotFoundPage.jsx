import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      {/* Firework decoration */}
      <div className="text-7xl mb-6 select-none" aria-hidden="true">🎆</div>

      {/* Error code */}
      <div className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">
        Error 404
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        Page Not Found
      </h1>

      <p className="text-gray-500 text-base max-w-md mb-8 leading-relaxed">
        Looks like this page went up in smoke! The page you're looking for doesn't exist or may have been moved.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-10">
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm w-full sm:w-auto"
          id="go-home-btn"
        >
          ← Back to Home
        </Link>
        <Link
          to="/products"
          className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl border border-gray-200 transition-colors w-full sm:w-auto"
          id="browse-products-btn"
        >
          Browse Products
        </Link>
        <Link
          to="/contact"
          className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl border border-gray-200 transition-colors w-full sm:w-auto"
          id="contact-support-btn"
        >
          Contact Support
        </Link>
      </div>

      {/* Auto-redirect notice */}
      <p className="text-gray-400 text-sm">
        Redirecting to home in{' '}
        <span className="text-blue-600 font-semibold tabular-nums">{countdown}</span>
        {' '}second{countdown !== 1 ? 's' : ''}…
      </p>

      {/* Progress bar */}
      <div className="mt-3 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-1000"
          style={{ width: `${(countdown / 10) * 100}%` }}
        />
      </div>
    </div>
  )
}
