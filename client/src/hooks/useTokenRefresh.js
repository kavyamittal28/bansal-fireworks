import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Refresh the token every 3 hours while the tab is alive
const REFRESH_INTERVAL_MS = 3 * 60 * 60 * 1000

export function useTokenRefresh() {
  const navigate = useNavigate()

  useEffect(() => {
    async function refreshToken() {
      const token = localStorage.getItem('adminToken')
      if (!token) return

      try {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.status === 401) {
          // Token is expired or invalid — force re-login
          localStorage.removeItem('adminToken')
          navigate('/admin/login')
          return
        }

        if (res.ok) {
          const data = await res.json()
          localStorage.setItem('adminToken', data.token)
        }
      } catch {
        // Network error — silent fail, will retry on next cycle or visibility change
      }
    }

    // Refresh on a regular interval (keeps long-running tabs alive)
    const interval = setInterval(refreshToken, REFRESH_INTERVAL_MS)

    // Refresh when the admin returns to this tab after being away
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        refreshToken()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [navigate])
}
