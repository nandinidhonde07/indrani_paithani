import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiUser, FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { FaUserShield, FaChevronDown, FaStore, FaGem, FaGift, FaHeartbeat } from 'react-icons/fa';
import productsData from '../data/products.json';

const Navbar = ({ isScrolled, isTransparentInit }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Sync mini cart drawer data
  const syncCart = () => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  };

  useEffect(() => {
    syncCart();
    // Setup simple listener for local storage changes
    window.addEventListener('storage', syncCart);
    return () => window.removeEventListener('storage', syncCart);
  }, [showCartDrawer]);

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

  const updateQuantity = (id, q) => {
    if (q < 1) return;
    const updated = cart.map(item => item.id === id ? { ...item, quantity: q } : item);
    localStorage.setItem('cart', JSON.stringify(updated));
    setCart(updated);
  };

  const removeFromCart = (id) => {
    const updated = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(updated));
    setCart(updated);
  };

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

  // Dynamic navbar styling based on scroll positions
  const navbarBg = (isTransparentInit && !isScrolled)
    ? 'bg-transparent text-black border-transparent'
    : 'bg-white text-black shadow-premium border-b border-gold/15';

  const brandColor = 'text-black';
  const inputBg = (isTransparentInit && !isScrolled) ? 'bg-white/10 text-black placeholder-black/70 border-gold/30' : 'bg-cream/40 text-black border-gold/30';
  const navLinkStyle = ({ isActive }) =>
    isActive ? 'text-black border-b-2 border-black pb-1 font-bold' : 'text-black hover:text-black/70 transition pb-1 border-b-2 border-transparent';

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${navbarBg}`}>
        <nav className="container mx-auto flex items-center justify-between py-4 px-6 relative">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/assets/logo.jpg" alt="Indrani Paithani Logo" className="w-9 h-9 rounded-full border border-gold/30 object-cover shadow" />
            <span className={`text-xl font-heading font-bold tracking-widest transition duration-300 ${brandColor}`}>
              INDRANI PAITHANI
            </span>
          </Link>

          {/* Navigation Items */}
          <ul className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-widest uppercase">
            <li>
              <NavLink to="/" className={navLinkStyle}>Home</NavLink>
            </li>

            {/* Shop Mega Menu */}
            <li
              className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <button className="text-black hover:text-black/70 flex items-center space-x-1 py-2 font-semibold tracking-wider">
                <span>Shop</span>
                <FaChevronDown size={8} />
              </button>


              {showMegaMenu && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-[850px] bg-white text-black border border-gold/25 shadow-2xl rounded-2xl p-8 grid grid-cols-3 gap-8 z-50 animate-fade-in">
                  
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

                  {/* Featured Collection image */}
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-cream shadow-md">
                    <img
                      src="/assets/founder_home.jpg"
                      alt="Featured Drape Collection"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 to-transparent flex flex-col justify-end p-4">
                      <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">Bridal Showcase</span>
                      <h5 className="text-white text-sm font-heading font-bold">Maharani Paithani Collection</h5>
                      <Link to="/shop?category=Bridal%20Paithani" className="text-gold underline text-[9px] mt-1 hover:text-white font-medium">
                        View Heritage Gallery
                      </Link>
                    </div>
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

          {/* Search Bar */}
          <div ref={searchRef} className="relative hidden lg:block w-64">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search color, motif..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full px-4 py-2 border rounded-full text-[11px] focus:outline-none focus:ring-2 focus:ring-gold transition ${inputBg}`}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                🔍
              </button>
            </form>

            {suggestions.length > 0 && (
              <div className="absolute z-50 w-full bg-white border border-gold/20 rounded-2xl mt-2 shadow-2xl p-2 max-h-60 overflow-y-auto">
                {suggestions.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      navigate(`/product/${p.id}`);
                      setSuggestions([]);
                      setSearch('');
                    }}
                    className="flex items-center space-x-3 p-2 hover:bg-cream/40 rounded-xl cursor-pointer transition text-black"
                  >
                    <img src={p.image} alt={p.name} className="w-8 h-10 object-cover rounded" />
                    <div>
                      <h5 className="text-xs font-semibold text-maroon">{p.name}</h5>
                      <span className="text-[10px] text-gray-500">{p.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions & Dropdowns */}
          <div className="flex items-center space-x-6">
            <Link to="/buyer-dashboard/wishlist" className="hover:text-black/70 transition">
              <FiHeart size={18} />
            </Link>
            
            {/* Shopping bag opens slide-out cart drawer */}
            <button onClick={() => { syncCart(); setShowCartDrawer(true); }} className="hover:text-black/70 transition relative">
              <FiShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-maroon text-gold border border-gold/30 w-4 h-4 text-[9px] rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>

            {/* User portal */}
            <div
              className="relative"
              onMouseEnter={() => setShowAuthDropdown(true)}
              onMouseLeave={() => setShowAuthDropdown(false)}
            >
              <button className="hover:text-black/70 transition focus:outline-none py-2">
                <FiUser size={18} />
              </button>

              {showAuthDropdown && (
                <div className="absolute right-0 top-full w-48 bg-white border border-gold/20 shadow-xl rounded-xl p-2 z-50 text-black">
                  <Link to="/buyer-login" className="block px-4 py-2 hover:bg-cream/40 rounded-lg text-xs font-semibold">
                    Buyer Portal
                  </Link>
                  <Link to="/owner-login" className="block px-4 py-2 hover:bg-cream/40 rounded-lg text-xs font-semibold">
                    Owner console
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

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
    </>
  );
};

export default Navbar;
