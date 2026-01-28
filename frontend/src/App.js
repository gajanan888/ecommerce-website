import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CustomCursor from './components/CustomCursor';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const OrderHistoryPage = React.lazy(() => import('./pages/OrderHistoryPage'));
const WishlistPage = React.lazy(() => import('./pages/WishlistPage'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminProductsPage = React.lazy(() => import('./pages/AdminProductsPage'));
const AdminOrdersPage = React.lazy(() => import('./pages/AdminOrdersPage'));
const AdminUsersPage = React.lazy(() => import('./pages/AdminUsersPage'));
const AdminDiscountsPage = React.lazy(() => import('./pages/AdminDiscountsPage'));
const AdminPaymentsPage = React.lazy(() => import('./pages/AdminPaymentsPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = React.lazy(() => import('./pages/OrderConfirmationPage'));
const PaymentSuccessPage = React.lazy(() => import('./pages/PaymentSuccessPage'));
const PaymentCancelPage = React.lazy(() => import('./pages/PaymentCancelPage'));

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
    <div className="relative">
      <div className="w-20 h-20 border-2 border-white/5 rounded-full"></div>
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-orange-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const content = (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* ... other consumer routes ... */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout/:orderId" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
        <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
        <Route path="/order/:orderId" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
        <Route path="/payment-success/:orderId" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
        <Route path="/payment-cancel/:orderId" element={<ProtectedRoute><PaymentCancelPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute requireAdmin={true}><AdminProductsPage /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute requireAdmin={true}><AdminOrdersPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requireAdmin={true}><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/discounts" element={<ProtectedRoute requireAdmin={true}><AdminDiscountsPage /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute requireAdmin={true}><AdminPaymentsPage /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Suspense>
  );

  if (isAdminPath) {
    return content;
  }

  return <Layout>{content}</Layout>;
}

function App() {
  // ...existing code...
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <CustomCursor />
              <AppContent />
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
