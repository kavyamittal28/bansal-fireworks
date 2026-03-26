import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bansal_cart')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('bansal_cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(product, type, qty = 1) {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id && i.type === type)
      if (existing) {
        return prev.map(i =>
          i.productId === product.id && i.type === type
            ? { ...i, qty: i.qty + qty }
            : i
        )
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.media?.[0]?.url || null,
        order_type: product.order_type || 'both',
        type,
        qty,
        case_to_piece_qty: product.case_to_piece_qty || null,
        addedAt: Date.now(),
      }]
    })
  }

  function removeFromCart(productId, type) {
    setCart(prev => prev.filter(i => !(i.productId === productId && i.type === type)))
  }

  function updateQty(productId, type, qty) {
    if (qty <= 0) {
      removeFromCart(productId, type)
      return
    }
    setCart(prev =>
      prev.map(i =>
        i.productId === productId && i.type === type ? { ...i, qty } : i
      )
    )
  }

  function clearCart() {
    setCart([])
  }

  const totalItems = cart.length

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
