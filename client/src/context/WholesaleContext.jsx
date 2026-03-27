import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const WholesaleContext = createContext(false)

export function WholesaleProvider({ children }) {
  const [isWholesale, setIsWholesale] = useState(
    () => sessionStorage.getItem('bansalWholesale') === 'true'
  )
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith('/wholesale')) {
      setIsWholesale(true)
      sessionStorage.setItem('bansalWholesale', 'true')
    }
  }, [location.pathname])

  return (
    <WholesaleContext.Provider value={isWholesale}>
      {children}
    </WholesaleContext.Provider>
  )
}

export function useWholesale() {
  return useContext(WholesaleContext)
}
