import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import { WholesaleProvider, useWholesale } from './context/WholesaleContext'
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
import WholesalePage from './pages/WholesalePage'
import WholesaleHomePage from './pages/WholesaleHomePage'
import WholesaleProductDetailPage from './pages/WholesaleProductDetailPage'
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

// Redirect retail routes to wholesale equivalents when in wholesale mode
function HomeGuard() {
  const isWholesale = useWholesale()
  return isWholesale
    ? <Navigate to="/wholesale/home" replace />
    : <PublicLayout><HomePage /></PublicLayout>
}

function ProductsGuard() {
  const isWholesale = useWholesale()
  return isWholesale
    ? <Navigate to="/wholesale/products" replace />
    : <PublicLayout><ProductsPage /></PublicLayout>
}

function ProductDetailGuard() {
  const isWholesale = useWholesale()
  const { id } = useParams()
  return isWholesale
    ? <Navigate to={`/wholesale/products/${id}`} replace />
    : <PublicLayout><ProductDetailPage /></PublicLayout>
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <WholesaleProvider>
          <ScrollToTop />
          <Routes>
            {/* Public pages — wholesale-aware */}
            <Route path="/" element={<HomeGuard />} />
            <Route path="/products" element={<ProductsGuard />} />
            <Route path="/products/:id" element={<ProductDetailGuard />} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
            <Route path="/wholesale" element={<Navigate to="/wholesale/home" replace />} />
            <Route path="/wholesale/home" element={<PublicLayout><WholesaleHomePage /></PublicLayout>} />
            <Route path="/wholesale/products" element={<PublicLayout><WholesalePage /></PublicLayout>} />
            <Route path="/wholesale/products/:id" element={<PublicLayout><WholesaleProductDetailPage /></PublicLayout>} />
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
        </WholesaleProvider>
      </BrowserRouter>
    </CartProvider>
  )
}
