import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminAddProductPage from './pages/AdminAddProductPage'
import NotFoundPage from './pages/NotFoundPage'
import './index.css'

/** Public layout with shared Navbar + Footer */
function PublicLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>{children}</div>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
        <Route path="/products/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

        {/* Admin pages — full-screen, no shared header/footer */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/add-product" element={<AdminAddProductPage />} />

        {/* 404 — public layout */}
        <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  )
}
