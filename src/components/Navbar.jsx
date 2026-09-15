import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiUser, FiX, FiMenu } from 'react-icons/fi';
import { FaChevronDown, FaStore, FaGem, FaGift } from 'react-icons/fa';
import productsData from '../data/products.json';
import useCartStore from '../store/useCartStore.js';
import useAuthStore from '../store/useAuthStore.js';
import AuthService from '../services/AuthService.js';
import CartDrawer from './CartDrawer.jsx';

const Navbar = ({ isScrolled, isTransparentInit }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const cart = useCartStore(state => state.cart);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const role = useAuthStore(state => state.role);

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const authDropdownRef = useRef(null);

  useEffect(() => {
    if (search.trim().length > 1) {
      const list = productsData.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5);
      setSuggestions(list);
    } else {
      setSuggestions([]);
    }
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target)) {
        setShowAuthDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?query=${encodeURIComponent(search.trim())}`);
      setSuggestions([]);
    }
  };

  const categories = [
    { name: "Pure Silk", path: "/shop?category=Pure%20Silk%20Paithani", icon: <FaGem className="text-gold" /> },
    { name: "Bridal Collection", path: "/shop?category=Bridal%20Paithani", icon: <FaStore className="text-gold" /> },
    { name: "Wedding Collection", path: "/shop?category=Wedding%20Collection", icon: <FaGem className="text-gold" /> },
    { name: "Heritage Collection", path: "/shop?category=Heritage%20Collection", icon: <FaStore className="text-gold" /> },
    { name: "Luxury Collection", path: "/shop?category=Luxury%20Collection", icon: <FaGem className="text-gold" /> },
    { name: "Paithani Dupattas", path: "/shop?category=Paithani%20Dupattas", icon: <FaGift className="text-gold" /> },
    { name: "Dress Materials", path: "/shop?category=Dress%20Materials", icon: <FaGift className="text-gold" /> },
    { name: "Paithani Bags", path: "/shop?category=Paithani%20Bags", icon: <FaStore className="text-gold" /> },
    { name: "Luxury Accessories", path: "/shop?category=Luxury%20Accessories", icon: <FaGem className="text-gold" /> },
    { name: "Gift Boxes", path: "/shop?category=Gift%20Boxes", icon: <FaGift className="text-gold" /> }
  ];

  // Dynamic navbar styling based on scroll position
  const isTransparent = isTransparentInit && !isScrolled;

  const navbarBg = isTransparent 
    ? 'bg-transparent text-white h-[80px] flex items-center'
    : 'bg-white/95 backdrop-blur-[16px] shadow-sm border-b border-[#111111]/10 text-[#111111] h-[80px] flex items-center';
  const brandColor = isTransparent ? 'text-white' : 'text-[#111111]';
  const inputBg = isTransparent 
    ? 'bg-white/20 text-white border-white/30 placeholder-white/70'
    : 'bg-[#111111]/5 text-[#111111] border-[#111111]/20 placeholder-[#111111]/60';
    
  const navLinkStyle = ({ isActive }) => {
    return isActive 
      ? `border-b-2 border-[#C9A14A] pb-1 font-bold ${isTransparent ? 'text-white' : 'text-[#111111]'}`
      : `${isTransparent ? 'text-white/80 hover:text-white' : 'text-[#111111]/80 hover:text-[#111111]'} transition pb-1 border-b-2 border-transparent`;
  };
  
  const iconClass = `transition focus:outline-none py-2 ${isTransparent ? 'text-white hover:text-[#C9A14A]' : 'text-[#111111] hover:text-[#C9A14A]'}`;

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className={`fixed w-full top-0 z-40 transition-all duration-300 ${navbarBg}`}
      >
        <nav className="container mx-auto flex items-center justify-between px-6 relative w-full">
          
          {/* Logo (Left) */}
          <div className="w-1/3 lg:w-1/4 flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/assets/official_logo.jpg" alt="Indrani Paithani Logo" className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-full shadow-sm border border-[#E5E5E5]" />
              <span className={`text-sm lg:text-xl font-heading font-bold tracking-widest transition duration-300 ${brandColor} hidden sm:block`}>
                INDRANI PAITHANI
              </span>
            </Link>
          </div>

          {/* Navigation Items (Center) */}
          <ul className="hidden lg:flex items-center justify-center space-x-8 text-[11px] font-semibold tracking-widest uppercase w-2/4">
            <li>
              <NavLink to="/" className={navLinkStyle}>Home</NavLink>
            </li>

            {/* Shop Mega Menu */}
            <li
              className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <NavLink to="/shop" className={navLinkStyle}>
                <span className="flex items-center space-x-1">
                  <span>Shop</span>
                  <FaChevronDown size={8} />
                </span>
              </NavLink>

              {showMegaMenu && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-[600px] bg-white text-black border border-gold/25 shadow-2xl rounded-2xl p-8 grid grid-cols-2 gap-8 z-50 animate-fade-in">
                  
                  {/* Category lists */}
                  <div className="space-y-4">
                    <h4 className="font-heading text-sm text-maroon font-bold border-b border-gold/25 pb-2">Collections</h4>
                    <ul className="space-y-3 text-xs">
                      {categories.slice(0, 5).map((cat, idx) => (
                        <li key={idx}>
                          <Link to={cat.path} className="hover:text-gold transition flex items-center space-x-2">
                            {cat.icon}
                            <span>{cat.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-heading text-sm text-maroon font-bold border-b border-gold/25 pb-2">Accessories & Gifting</h4>
                    <ul className="space-y-3 text-xs">
                      {categories.slice(5).map((cat, idx) => (
                        <li key={idx}>
                          <Link to={cat.path} className="hover:text-gold transition flex items-center space-x-2">
                            {cat.icon}
                            <span>{cat.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>

            <li>
              <NavLink to="/about" className={navLinkStyle}>About</NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={navLinkStyle}>Contact</NavLink>
            </li>
          </ul>

          {/* Search & Actions (Right) */}
          <div className="w-2/3 lg:w-1/4 flex items-center justify-end space-x-4 md:space-x-6">
            
            {/* Search Bar */}
            <div ref={searchRef} className="relative hidden xl:block w-56">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-full text-[11px] focus:outline-none focus:ring-1 focus:ring-[#111111] transition ${inputBg}`}
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#111111]/70 hover:text-[#C9A14A]">
                  🔍
                </button>
              </form>

              {suggestions.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-[#E5E5E5] rounded-2xl mt-2 shadow-2xl p-2 max-h-60 overflow-y-auto">
                  {suggestions.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        navigate(`/product/${p.id}`);
                        setSuggestions([]);
                        setSearch('');
                      }}
                      className="flex items-center space-x-3 p-2 hover:bg-[#F9F9F9] rounded-xl cursor-pointer transition text-[#111111]"
                    >
                      <img src={p.image} alt={p.name} className="w-8 h-10 object-cover rounded" />
                      <div>
                        <h5 className="text-xs font-semibold text-[#111111]">{p.name}</h5>
                        <span className="text-[10px] text-[#666666]">{p.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-5">
              <Link to="/buyer-dashboard/wishlist" className={iconClass} title="Wishlist">
                <FiHeart size={18} />
              </Link>
              
              {/* Shopping bag opens slide-out cart drawer */}
              <button 
                onClick={() => setShowCartDrawer(true)} 
                className={`${iconClass} relative`}
                title="Shopping Bag"
              >
                <FiShoppingCart size={18} />
                {totalCartCount > 0 && (
                  <span className={`absolute -top-1.5 -right-2 w-4 h-4 text-[9px] rounded-full flex items-center justify-center font-bold ${isTransparent ? 'bg-white text-black' : 'bg-maroon text-white border border-gold'}`}>
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* User portal */}
              <div ref={authDropdownRef} className="relative flex items-center h-full">
                <button
                  type="button"
                  onClick={() => setShowAuthDropdown(prev => !prev)}
                  className={`${iconClass} relative flex items-center space-x-1 p-2 rounded-full focus:outline-none`}
                  title="Account Options"
                  aria-label="User Account Options"
                >
                  {isAuthenticated && user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full border border-gold object-cover" />
                  ) : (
                    <FiUser size={20} />
                  )}
                  {isAuthenticated && (
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 absolute top-0 right-0 border-2 border-white"></span>
                  )}
                </button>

                {showAuthDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-gold/30 shadow-2xl rounded-2xl p-3 z-50 text-[#111111] animate-fade-in">
                    {isAuthenticated ? (
                      <div className="space-y-1">
                        <div className="px-4 py-2 border-b border-gray-100 bg-cream/40 rounded-xl mb-2">
                          <p className="text-xs font-bold text-maroon truncate">{user?.name || 'Valued Client'}</p>
                          <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/buyer-dashboard"
                          onClick={() => setShowAuthDropdown(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-cream rounded-xl text-xs font-semibold text-gray-800 transition"
                        >
                          <span className="text-sm">📦</span>
                          <span>My Orders & Profile</span>
                        </Link>
                        {role === 'owner' && (
                          <Link
                            to="/admin"
                            onClick={() => setShowAuthDropdown(false)}
                            className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-amber-50 rounded-xl text-xs font-bold text-maroon transition"
                          >
                            <span className="text-sm">👑</span>
                            <span>Owner Console</span>
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setShowAuthDropdown(false);
                            AuthService.logout();
                            navigate('/buyer-login');
                          }}
                          className="w-full flex items-center space-x-2.5 text-left px-4 py-2.5 hover:bg-red-50 text-red-600 rounded-xl text-xs font-semibold transition border-t border-gray-100 mt-2"
                        >
                          <span className="text-sm">🚪</span>
                          <span>Logout</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100 mb-1">
                          Account Portal
                        </div>
                        <Link
                          to="/buyer-login"
                          onClick={() => setShowAuthDropdown(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-cream rounded-xl text-xs font-semibold text-gray-800 transition"
                        >
                          <span className="text-sm">🔑</span>
                          <span>Buyer Login</span>
                        </Link>
                        <Link
                          to="/buyer-signup"
                          onClick={() => setShowAuthDropdown(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-cream rounded-xl text-xs font-bold text-maroon transition"
                        >
                          <span className="text-sm">📝</span>
                          <span>Register / Create Account</span>
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <Link
                          to="/owner-login"
                          onClick={() => setShowAuthDropdown(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-amber-50 rounded-xl text-xs font-bold text-gold transition"
                        >
                          <span className="text-sm">👑</span>
                          <span>Owner Portal Login</span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Hamburger Menu (Mobile Only) */}
              <button 
                onClick={() => setShowMobileMenu(true)} 
                className={`lg:hidden ${iconClass}`}
              >
                <FiMenu size={20} />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* SLIDE-OVER CART DRAWER */}
      <CartDrawer isOpen={showCartDrawer} onClose={() => setShowCartDrawer(false)} />

      {/* MOBILE MENU DRAWER */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-start lg:hidden">
          <div className="w-3/4 max-w-sm bg-white h-full flex flex-col shadow-2xl relative text-black">
            
            <div className="p-6 border-b border-gold/20 flex justify-between items-center bg-cream/10">
              <h3 className="font-heading text-xl text-maroon font-bold tracking-widest">MENU</h3>
              <button onClick={() => setShowMobileMenu(false)} className="text-gray-500 hover:text-maroon">
                <FiX size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Mobile Search */}
              <form onSubmit={(e) => { handleSearchSubmit(e); setShowMobileMenu(false); }} className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </button>
              </form>

              <div className="flex flex-col space-y-6 text-sm font-semibold tracking-widest uppercase">
                <Link to="/" onClick={() => setShowMobileMenu(false)} className="border-b border-gray-100 pb-2">Home</Link>
                <Link to="/shop" onClick={() => setShowMobileMenu(false)} className="border-b border-gray-100 pb-2">Shop All</Link>
                
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs text-gray-400 font-bold mb-2">Categories</h4>
                  {categories.map((cat, idx) => (
                    <Link 
                      key={idx} 
                      to={cat.path} 
                      onClick={() => setShowMobileMenu(false)} 
                      className="flex items-center space-x-3 text-gray-600 hover:text-maroon ml-4"
                    >
                      {cat.icon}
                      <span className="capitalize">{cat.name}</span>
                    </Link>
                  ))}
                </div>

                <Link to="/about" onClick={() => setShowMobileMenu(false)} className="border-b border-gray-100 pb-2 mt-4">About Us</Link>
                <Link to="/contact" onClick={() => setShowMobileMenu(false)} className="border-b border-gray-100 pb-2">Contact</Link>
              </div>
            </div>
            
            <div className="p-6 bg-cream/10 border-t border-gold/20">
               {isAuthenticated ? (
                 <>
                   <Link to="/buyer-dashboard" onClick={() => setShowMobileMenu(false)} className="w-full block text-center bg-maroon text-white font-semibold py-3 rounded-full mb-3">
                     My Orders & Profile
                   </Link>
                   <button 
                     onClick={() => { setShowMobileMenu(false); AuthService.logout(); navigate('/buyer-login'); }} 
                     className="w-full block text-center border-2 border-red-500 text-red-500 font-semibold py-3 rounded-full"
                   >
                     Logout
                   </button>
                 </>
               ) : (
                 <div className="space-y-2">
                   <Link to="/buyer-login" onClick={() => setShowMobileMenu(false)} className="w-full block text-center border-2 border-maroon text-maroon font-semibold py-2.5 rounded-full text-xs">Buyer Login</Link>
                   <Link to="/buyer-signup" onClick={() => setShowMobileMenu(false)} className="w-full block text-center bg-maroon text-white font-semibold py-2.5 rounded-full text-xs">Register / Sign Up</Link>
                   <Link to="/owner-login" onClick={() => setShowMobileMenu(false)} className="w-full block text-center bg-gold/10 text-maroon border border-gold font-semibold py-2.5 rounded-full text-xs">Owner Console</Link>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
