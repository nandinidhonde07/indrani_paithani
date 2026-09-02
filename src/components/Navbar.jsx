import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiUser, FiX, FiPlus, FiMinus, FiMenu } from 'react-icons/fi';
import { FaUserShield, FaChevronDown, FaStore, FaGem, FaGift, FaHeartbeat } from 'react-icons/fa';
import productsData from '../data/products.json';
import useCartStore from '../store/useCartStore.js';

const Navbar = ({ isScrolled, isTransparentInit }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const cart = useCartStore(state => state.cart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Cart sync is handled by zustand store automatically!

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?query=${encodeURIComponent(search.trim())}`);
      setSuggestions([]);
    }
  };

  // Removed local updateQuantity and removeFromCart, using zustand directly

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
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
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${navbarBg}`}
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
              <Link to="/buyer-dashboard/wishlist" className={iconClass}>
                <FiHeart size={18} />
              </Link>
              
              {/* Shopping bag opens slide-out cart drawer */}
              <button onClick={() => setShowCartDrawer(true)} className={`${iconClass} relative`}>
                <FiShoppingCart size={18} />
                {cart.length > 0 && (
                  <span className={`absolute -top-2 -right-2 w-4 h-4 text-[9px] rounded-full flex items-center justify-center font-bold ${isTransparent ? 'bg-white text-black' : 'bg-[#111111] text-white'}`}>
                    {cart.length}
                  </span>
                )}
              </button>

              {/* User portal */}
              <div
                className="relative flex items-center h-full"
                onMouseEnter={() => setShowAuthDropdown(true)}
                onMouseLeave={() => setShowAuthDropdown(false)}
              >
                <button onClick={() => setShowAuthDropdown(!showAuthDropdown)} className={iconClass}>
                  <FiUser size={18} />
                </button>

                {showAuthDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E5E5E5] shadow-xl rounded-xl p-2 z-50 text-[#111111] before:absolute before:-top-4 before:left-0 before:w-full before:h-4">
                    <Link to="/buyer-login" onClick={() => setShowAuthDropdown(false)} className="block px-4 py-2 hover:bg-[#F9F9F9] rounded-lg text-xs font-semibold">
                      Buyer Portal
                    </Link>
                    <Link to="/owner-login" onClick={() => setShowAuthDropdown(false)} className="block px-4 py-2 hover:bg-[#F9F9F9] rounded-lg text-xs font-semibold">
                      Owner Console
                    </Link>
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

      {/* MINI CART DRAWER */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
          <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl relative text-black">
            
            {/* Header */}
            <div className="p-6 border-b border-gold/20 flex justify-between items-center bg-cream/10">
              <h3 className="font-heading text-xl text-maroon font-bold">Shopping Bag ({cart.length})</h3>
              <button onClick={() => setShowCartDrawer(false)} className="text-gray-500 hover:text-maroon">
                <FiX size={24} />
              </button>
            </div>

            {/* List */}
            <div className="p-6 flex-grow overflow-y-auto space-y-4">
              {cart.length > 0 ? (
                cart.map(item => (
                  <div key={item.id} className="flex space-x-4 border-b pb-4">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
                    <div className="flex-grow space-y-1">
                      <h4 className="font-semibold text-sm text-maroon">{item.name}</h4>
                      <span className="text-[10px] text-gray-400 block">{item.category}</span>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="border p-1 rounded hover:bg-cream"><FiMinus size={10} /></button>
                        <span className="text-xs font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="border p-1 rounded hover:bg-cream"><FiPlus size={10} /></button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline mt-2">Remove</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-500 text-sm">
                  Your luxury shopping bag is empty.
                </div>
              )}
            </div>

            {/* Summary & checkout footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gold/20 space-y-4 bg-cream/5">
                <div className="flex justify-between font-bold text-base text-maroon">
                  <span>Bag Subtotal:</span>
                  <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
                </div>
                <button
                  onClick={() => {
                    setShowCartDrawer(false);
                    navigate('/checkout');
                  }}
                  className="w-full bg-maroon hover:bg-gold text-white font-semibold py-3 rounded-full transition text-center block"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE MENU DRAWER */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-start lg:hidden">
          <div className="w-3/4 max-w-sm bg-white h-full flex flex-col shadow-2xl relative text-black animate-slide-right">
            
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
               <Link to="/buyer-login" onClick={() => setShowMobileMenu(false)} className="w-full block text-center border-2 border-maroon text-maroon font-semibold py-3 rounded-full mb-3">Buyer Login</Link>
               <Link to="/owner-login" onClick={() => setShowMobileMenu(false)} className="w-full block text-center bg-maroon text-white font-semibold py-3 rounded-full">Owner Console</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
