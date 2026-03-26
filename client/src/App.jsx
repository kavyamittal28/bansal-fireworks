import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import CartPage from './pages/CartPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminAddProductPage from './pages/AdminAddProductPage'
import AdminInquiriesPage from './pages/AdminInquiriesPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import OrderPaymentPage from './pages/OrderPaymentPage'
import AdminSettingsPage from './pages/AdminSettingsPage'
import AdminCatalogPage from './pages/AdminCatalogPage'
import AdminEditProductPage from './pages/AdminEditProductPage'
import NotFoundPage from './pages/NotFoundPage'
import './index.css'

function AdminLoginGuard() {
  return localStorage.getItem('adminToken') ? <Navigate to="/admin/dashboard" replace /> : <AdminLoginPage />
}

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
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
          <Route path="/products/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
          <Route path="/order/payment/:orderId" element={<OrderPaymentPage />} />

          {/* /admin → dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Admin — login is public, redirect to dashboard if already logged in */}
          <Route path="/admin/login" element={<AdminLoginGuard />} />

          {/* Admin — protected */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/add-product" element={<ProtectedRoute><AdminAddProductPage /></ProtectedRoute>} />
          <Route path="/admin/catalog" element={<ProtectedRoute><AdminCatalogPage /></ProtectedRoute>} />
          <Route path="/admin/edit-product/:id" element={<ProtectedRoute><AdminEditProductPage /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>} />
          <Route path="/admin/inquiries" element={<ProtectedRoute><AdminInquiriesPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
