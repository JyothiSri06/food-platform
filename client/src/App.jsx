import React, { useContext, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HelpBox from './components/HelpBox';

const Home = React.lazy(() => import('./pages/Home'));
const Products = React.lazy(() => import('./pages/Products'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Orders = React.lazy(() => import('./pages/Orders'));
const Wishlist = React.lazy(() => import('./pages/Wishlist'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const DeliveryDashboard = React.lazy(() => import('./pages/DeliveryDashboard'));
const TrackOrder = React.lazy(() => import('./pages/TrackOrder'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const RefundPolicy = React.lazy(() => import('./pages/RefundPolicy'));

function App() {
  console.log("App.jsx: App component is rendering.");
  
  return (
    <SettingsProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SettingsProvider>
  );
}

function AppContent() {
  const { user } = useContext(AuthContext);
  
  // Using a unique key on providers forces a clean state re-initialization on logout/login.
  // This is the most robust way to clear all local state permanently.
  const authKey = user ? user.id : 'guest';

  const LoadingSpinner = (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <CartProvider key={`cart-${authKey}`}>
      <WishlistProvider key={`wishlist-${authKey}`}>
        <Router>
          <div className="min-h-screen flex flex-col font-sans text-[#213C51]">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={LoadingSpinner}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/delivery" element={<DeliveryDashboard />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/refund" element={<RefundPolicy />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <HelpBox />
          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
