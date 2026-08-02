import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import BuyerLogin from './pages/BuyerLogin.jsx';
import BuyerSignup from './pages/BuyerSignup.jsx';
import OwnerLogin from './pages/OwnerLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import BuyerDashboard from './pages/BuyerDashboard.jsx';
import Checkout from './pages/Checkout.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import RefundPolicy from './pages/RefundPolicy.jsx';
import AccessibilityStatement from './pages/AccessibilityStatement.jsx';
import ShippingPolicy from './pages/ShippingPolicy.jsx';
import TermsConditions from './pages/TermsConditions.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { FaWhatsapp, FaArrowUp, FaHome, FaShoppingBag, FaHeart, FaShoppingCart, FaUser } from 'react-icons/fa';
import useAppStore from './store/useAppStore.js';

// Simple auth guard based on localStorage "role" ("buyer" or "owner")
const ProtectedRoute = ({ children, role }) => {
  const storedRole = localStorage.getItem('role');
  if (storedRole !== role) {
    return <Navigate to={role === 'owner' ? '/owner-login' : '/buyer-login'} replace />;
  }
  return children;
};

const App = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const initStore = useAppStore(state => state.initStore);

  useEffect(() => {
    initStore();
    const handleScroll = () => {
      // Manage transparency of navbar
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Manage scroll-to-top visibility
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine if Navbar should be transparent initially (e.g. only on Hero page /)
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen font-body bg-cream text-black relative">
      {/* Polished Navbar passing scrolled state */}
      <Navbar isScrolled={isScrolled} isTransparentInit={isHomePage} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/buyer-signup" element={<BuyerSignup />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/accessibility" element={<AccessibilityStatement />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route
            path="/buyer-dashboard/*"
            element={
              <ProtectedRoute role="buyer">
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role="owner">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/917507755836?text=Hello%20Indrani%20Paithani%20Expert%2C%20I%27d%20like%20to%20know%20more%20about%20your%20saree%20collections."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 sm:bottom-6 left-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition transform hover:scale-110 flex items-center space-x-2 font-semibold text-xs tracking-wider"
        title="Chat with Saree Expert"
      >
        <FaWhatsapp size={20} />
        <span className="hidden sm:inline">Chat With Our Saree Expert</span>
      </a>

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-6 right-6 z-40 bg-maroon text-gold border border-gold/40 p-4 rounded-full shadow-2xl hover:bg-gold hover:text-maroon transition transform hover:scale-110"
          title="Scroll to Top"
        >
          <FaArrowUp size={16} />
        </button>
      )}

      {/* Mobile Sticky Bottom Navigation (Sabyasachi style mobile navigation layout) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gold/20 shadow-2xl z-40 flex justify-around py-3">
        <Link to="/" className="flex flex-col items-center text-maroon hover:text-gold transition">
          <FaHome size={18} />
          <span className="text-[9px] uppercase mt-1 font-semibold tracking-wider">Home</span>
        </Link>
        <Link to="/shop" className="flex flex-col items-center text-maroon hover:text-gold transition">
          <FaShoppingBag size={18} />
          <span className="text-[9px] uppercase mt-1 font-semibold tracking-wider">Shop</span>
        </Link>
        <Link to="/buyer-dashboard/wishlist" className="flex flex-col items-center text-maroon hover:text-gold transition">
          <FaHeart size={18} />
          <span className="text-[9px] uppercase mt-1 font-semibold tracking-wider">Wishlist</span>
        </Link>
        <Link to="/buyer-dashboard/cart" className="flex flex-col items-center text-maroon hover:text-gold transition">
          <FaShoppingCart size={18} />
          <span className="text-[9px] uppercase mt-1 font-semibold tracking-wider">Cart</span>
        </Link>
        <Link to="/buyer-login" className="flex flex-col items-center text-maroon hover:text-gold transition">
          <FaUser size={18} />
          <span className="text-[9px] uppercase mt-1 font-semibold tracking-wider">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default App;
