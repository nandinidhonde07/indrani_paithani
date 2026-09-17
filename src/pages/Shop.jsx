import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import productsData from '../data/products.json';
import { FiHeart, FiEye, FiShoppingCart, FiStar, FiX, FiFilter, FiSliders, FiRotateCcw, FiChevronDown } from 'react-icons/fi';
import useCartStore from '../store/useCartStore.js';
import SidebarFilter from '../components/SidebarFilter.jsx';
import TrustBadges from '../components/TrustBadges.jsx';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialQuery = searchParams.get('query') || '';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedVariety, setSelectedVariety] = useState([]);
  const [maxPrice, setMaxPrice] = useState(400000);
  const [selectedFabric, setSelectedFabric] = useState('');
  const [selectedMotif, setSelectedMotif] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  
  // Slide-Over Filter Drawer State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Compare products state
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const navigate = useNavigate();

  // Load Products (Fix for 0 Masterpiece Designs Issue - fallback to productsData if localStorage is empty)
  useEffect(() => {
    const stored = localStorage.getItem('products') || localStorage.getItem('indrani_products');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        } else {
          setProducts(productsData);
        }
      } catch (e) {
        setProducts(productsData);
      }
    } else {
      setProducts(productsData);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSearchQuery(initialQuery);
    setSelectedCategory(initialCategory);
  }, [initialQuery, initialCategory]);

  useEffect(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.color && p.color.toLowerCase().includes(q)) ||
        (p.motif && p.motif.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      result = result.filter(p => 
        p.category.includes(selectedCategory) || 
        (selectedCategory === 'Bags' && p.category.toLowerCase().includes('bag'))
      );
    }

    if (selectedVariety.length > 0) {
      result = result.filter(p =>
        selectedVariety.some(v =>
          (p.fabric && p.fabric.toLowerCase().includes(v.toLowerCase())) ||
          (p.name && p.name.toLowerCase().includes(v.toLowerCase())) ||
          (p.category && p.category.toLowerCase().includes(v.toLowerCase()))
        )
      );
    }

    if (selectedFabric) result = result.filter(p => p.fabric === selectedFabric);
    if (selectedMotif) result = result.filter(p => p.motif === selectedMotif);
    if (selectedColor) result = result.filter(p => p.color === selectedColor);
    result = result.filter(p => p.price <= maxPrice);

    if (sortBy === 'low-to-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-to-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    } else if (sortBy === 'best-selling') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, selectedVariety, selectedFabric, selectedMotif, selectedColor, maxPrice, sortBy, products]);

  const addToCart = useCartStore(state => state.addToCart);
  const addToWishlist = useCartStore(state => state.toggleWishlist);

  const buyNow = (product) => {
    addToCart(product);
    navigate('/checkout');
  };

  const resetAllFilters = () => {
    setSelectedCategory('');
    setSelectedVariety([]);
    setSelectedFabric('');
    setSelectedMotif('');
    setSelectedColor('');
    setMaxPrice(400000);
    setSearchQuery('');
  };

  const handleCompareToggle = (product) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 sarees at a time.');
        return;
      }
      setCompareList([...compareList, product]);
    }
  };

  // Calculate active filter count (excluding default search unless present)
  const activeFilterCount = 
    selectedVariety.length + 
    (selectedColor ? 1 : 0) + 
    (maxPrice < 400000 ? 1 : 0) + 
    (selectedMotif ? 1 : 0) + 
    (selectedFabric ? 1 : 0) + 
    (selectedCategory ? 1 : 0);

  return (
    <div className="bg-cream min-h-screen pt-32 pb-12 px-4 sm:px-6 relative text-black">
      <div className="container mx-auto max-w-7xl">
        
        {/* Boutique Header Title */}
        <h1 className="text-3xl md:text-5xl font-heading text-maroon text-center mb-3 tracking-widest font-bold">
          The Luxury Saree Boutique
        </h1>
        <p className="text-center text-xs md:text-sm text-gray-600 mb-8 max-w-2xl mx-auto font-light">
          Explore handwoven Yeola Paithani sarees, 100% Silk Mark Certified bridal heirlooms and handcrafted accessories.
        </p>

        {/* Category Filter Pills Bar */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-8 px-2">
          {[
            "All",
            "Pure Silk",
            "Bridal",
            "Heritage",
            "Luxury",
            "Wedding",
            "Dupattas",
            "Bags",
            "Shawls",
            "Gift Boxes"
          ].map((cat, idx) => {
            const isSelected = selectedCategory === cat || (cat === "All" && selectedCategory === "");
            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat === "All" ? "" : cat)}
                className={`flex flex-col items-center justify-center h-10 px-5 rounded-full border transition-all duration-300 font-heading text-xs uppercase tracking-wider cursor-pointer ${
                  isSelected
                    ? 'bg-maroon text-white border-gold shadow-md font-bold'
                    : 'bg-white border-gold/30 text-black hover:border-gold hover:bg-cream hover:-translate-y-0.5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* FILTER TOOLBAR & CONTROL BAR (Replaces Left Sidebar) */}
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-premium border border-gold/20 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left: Filter & Refine Trigger Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="bg-maroon hover:bg-gold hover:text-maroon text-white font-bold py-2.5 px-6 rounded-full text-xs transition-all duration-300 shadow-md flex items-center space-x-2 border border-gold/30 uppercase tracking-wider group shrink-0"
            >
              <FiSliders className="w-4 h-4 text-gold group-hover:text-maroon transition" />
              <span>
                Filter & Refine {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </span>
            </button>

            {/* Total Results Count */}
            <span className="text-xs text-gray-500 font-medium hidden sm:inline-block">
              Showing <strong className="text-maroon font-heading text-sm">{filteredProducts.length}</strong> masterpiece designs
            </span>
          </div>

          {/* Right: Sort By Dropdown & Compare Button */}
          <div className="flex items-center space-x-4 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs text-gray-500 font-medium sm:hidden">
              {filteredProducts.length} designs
            </span>

            <div className="flex items-center space-x-3">
              {compareList.length > 0 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="bg-gold text-maroon font-bold px-4 py-2 rounded-full text-xs hover:bg-maroon hover:text-white transition shadow-xs flex items-center space-x-1"
                >
                  <span>Compare ({compareList.length})</span>
                </button>
              )}

              {/* Sort By Select */}
              <div className="flex items-center space-x-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:inline">Sort By:</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-cream/40 border border-gold/30 text-maroon font-bold text-xs py-2 pl-4 pr-8 rounded-full focus:outline-none focus:ring-2 focus:ring-maroon cursor-pointer"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="best-selling">Best Selling (Rating)</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-maroon pointer-events-none w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE FILTER CHIPS BAR */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-white/70 backdrop-blur-xs p-3.5 rounded-2xl border border-gold/20 shadow-xs">
            <span className="text-xs font-bold text-maroon uppercase tracking-wider mr-1">Active Filters:</span>
            
            {/* Category Chip */}
            {selectedCategory && (
              <span className="inline-flex items-center space-x-1 text-xs bg-gold/20 text-maroon border border-gold/30 font-semibold px-3 py-1 rounded-full">
                <span>Category: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory('')} className="hover:text-red-700 ml-1 font-bold">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Variety Chips */}
            {selectedVariety.map((v, i) => (
              <span key={i} className="inline-flex items-center space-x-1 text-xs bg-gold/20 text-maroon border border-gold/30 font-semibold px-3 py-1 rounded-full">
                <span>Variety: {v}</span>
                <button onClick={() => setSelectedVariety(selectedVariety.filter(item => item !== v))} className="hover:text-red-700 ml-1 font-bold">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {/* Color Chip */}
            {selectedColor && (
              <span className="inline-flex items-center space-x-1 text-xs bg-gold/20 text-maroon border border-gold/30 font-semibold px-3 py-1 rounded-full">
                <span>Color: {selectedColor}</span>
                <button onClick={() => setSelectedColor('')} className="hover:text-red-700 ml-1 font-bold">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Budget Chip */}
            {maxPrice < 400000 && (
              <span className="inline-flex items-center space-x-1 text-xs bg-gold/20 text-maroon border border-gold/30 font-semibold px-3 py-1 rounded-full">
                <span>Under ₹{maxPrice.toLocaleString('en-IN')}</span>
                <button onClick={() => setMaxPrice(400000)} className="hover:text-red-700 ml-1 font-bold">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Motif Chip */}
            {selectedMotif && (
              <span className="inline-flex items-center space-x-1 text-xs bg-gold/20 text-maroon border border-gold/30 font-semibold px-3 py-1 rounded-full">
                <span>Motif: {selectedMotif}</span>
                <button onClick={() => setSelectedMotif('')} className="hover:text-red-700 ml-1 font-bold">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Fabric Chip */}
            {selectedFabric && (
              <span className="inline-flex items-center space-x-1 text-xs bg-gold/20 text-maroon border border-gold/30 font-semibold px-3 py-1 rounded-full">
                <span>Fabric: {selectedFabric}</span>
                <button onClick={() => setSelectedFabric('')} className="hover:text-red-700 ml-1 font-bold">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Clear All Button */}
            <button
              onClick={resetAllFilters}
              className="text-xs text-red-700 font-bold hover:underline ml-auto flex items-center space-x-1 px-2 py-1"
            >
              <FiRotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* FULL-WIDTH MAIN PRODUCT GRID */}
        <main className="w-full space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <div key={s} className="bg-white rounded-3xl p-4 space-y-4 animate-pulse border border-gold/10">
                  <div className="w-full aspect-[3/4] bg-gray-200 rounded-2xl"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gold/20 space-y-4 max-w-xl mx-auto shadow-premium">
              <div className="w-16 h-16 bg-gold/20 text-maroon rounded-full flex items-center justify-center mx-auto">
                <FiFilter className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading text-maroon font-bold">No Sarees Found</h3>
              <p className="text-xs text-gray-500 font-light">No masterpiece designs match your currently selected filter criteria.</p>
              <button
                onClick={resetAllFilters}
                className="bg-maroon text-white text-xs px-6 py-2.5 rounded-full font-bold hover:bg-gold hover:text-maroon transition uppercase tracking-wider shadow-md inline-flex items-center space-x-2"
              >
                <FiRotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(p => {
                const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

                return (
                  <div
                    key={p.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-premium border border-gold/15 hover:shadow-2xl hover:-translate-y-1.5 transition duration-500 relative flex flex-col justify-between"
                  >
                    {/* Card Image */}
                    <div className="relative overflow-hidden aspect-[3/4] bg-white">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col space-y-1 z-10">
                        {discount > 0 && (
                          <span className="bg-red-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                            -{discount}% Off
                          </span>
                        )}
                        <span className="bg-maroon text-gold text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-gold/30 shadow-xs">
                          Handwoven
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex flex-col space-y-1 z-10">
                        <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                          Authentic
                        </span>
                        {p.price > 50000 && (
                          <span className="bg-gold text-maroon text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                            Limited Edition
                          </span>
                        )}
                      </div>

                      {/* Hover Action Overlay */}
                      <div className="absolute inset-0 bg-maroon/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center space-x-3">
                        <button
                          onClick={() => addToWishlist(p)}
                          className="bg-white p-3 rounded-full text-maroon hover:bg-gold hover:text-white transition duration-300 shadow-md"
                          title="Add to Wishlist"
                        >
                          <FiHeart size={18} />
                        </button>
                        <button
                          onClick={() => setQuickViewProduct(p)}
                          className="bg-white p-3 rounded-full text-maroon hover:bg-gold hover:text-white transition duration-300 shadow-md"
                          title="Quick View"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => addToCart(p)}
                          className="bg-white p-3 rounded-full text-maroon hover:bg-gold hover:text-white transition duration-300 shadow-md"
                          title="Add to Cart"
                        >
                          <FiShoppingCart size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Details & Compare checkbox */}
                    <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-[10px] text-gold font-bold uppercase tracking-wider">
                          <span>{p.category}</span>
                          <div className="flex items-center space-x-1 text-orange-500 font-bold">
                            <FiStar size={11} className="fill-orange-500" />
                            <span>{p.rating || 4.8} ({p.reviewsCount || 10})</span>
                          </div>
                        </div>
                        
                        <h3 className="font-heading text-base text-maroon font-bold hover:text-gold transition mt-1.5 leading-snug">
                          <Link to={`/product/${p.id}`}>{p.name}</Link>
                        </h3>
                      </div>
                      
                      <div className="space-y-3 pt-2 border-t border-gold/10">
                        <div className="flex justify-between items-baseline">
                          <div className="flex items-baseline space-x-2">
                            <span className="font-heading text-lg text-black font-bold">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                            {p.originalPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          
                          {/* Compare Checkbox */}
                          <label className="flex items-center space-x-1 cursor-pointer text-[10px] font-bold text-gray-500 uppercase hover:text-maroon">
                            <input
                              type="checkbox"
                              checked={!!compareList.find(c => c.id === p.id)}
                              onChange={() => handleCompareToggle(p)}
                              className="rounded border-gray-300 text-gold focus:ring-gold accent-gold"
                            />
                            <span>Compare</span>
                          </label>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => buyNow(p)}
                            className="bg-maroon hover:bg-gold hover:text-maroon text-white text-xs py-2.5 rounded-full flex-1 transition font-bold uppercase tracking-wider shadow-xs"
                          >
                            Buy Now
                          </button>
                          <button
                            onClick={() => addToCart(p)}
                            className="border border-maroon hover:bg-cream text-maroon text-xs py-2.5 rounded-full flex-1 transition font-bold uppercase tracking-wider"
                          >
                            + Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* TRUST BADGES SECTION */}
        <TrustBadges className="mt-16" />
      </div>

      {/* SLIDE-OVER FILTER DRAWER MODAL */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-slide-in-right">
            <SidebarFilter
              isDrawer={true}
              onClose={() => setIsFilterDrawerOpen(false)}
              onApply={() => setIsFilterDrawerOpen(false)}
              selectedVariety={selectedVariety}
              setSelectedVariety={setSelectedVariety}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedMotif={selectedMotif}
              setSelectedMotif={setSelectedMotif}
              selectedFabric={selectedFabric}
              setSelectedFabric={setSelectedFabric}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onResetFilters={resetAllFilters}
            />
          </div>
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 relative shadow-2xl">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 bg-maroon text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-gold transition z-10"
            >
              ✕
            </button>
            <div className="aspect-[3/4]">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 space-y-6 flex flex-col justify-between text-black">
              <div>
                <span className="text-xs tracking-wider text-gold font-medium uppercase">{quickViewProduct.category}</span>
                <h2 className="text-2xl font-heading text-maroon font-bold">{quickViewProduct.name}</h2>
                <div className="flex items-center space-x-2 text-xs text-orange-500 font-bold mt-1">
                  <FiStar className="fill-orange-500" />
                  <span>{quickViewProduct.rating || 4.8} ({quickViewProduct.reviewsCount || 10} reviews)</span>
                </div>
                <p className="text-2xl font-bold font-heading text-black mt-2">
                  ₹{quickViewProduct.price.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-gray-600 font-light mt-4 leading-relaxed">{quickViewProduct.description}</p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="bg-maroon hover:bg-gold hover:text-maroon text-white font-bold flex-1 py-3 rounded-full transition shadow-md uppercase tracking-wider text-xs"
                  >
                    Add To Cart
                  </button>
                  <Link
                    to={`/product/${quickViewProduct.id}`}
                    className="border border-maroon text-maroon font-bold flex-1 py-3 rounded-full text-center hover:bg-cream transition uppercase tracking-wider text-xs"
                  >
                    View Details
                  </Link>
                </div>
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    `Hello Indrani Paithani! I am interested in ordering *${quickViewProduct.name}* (Price: ₹${quickViewProduct.price.toLocaleString('en-IN')}). Link: ${window.location.origin}/product/${quickViewProduct.id}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold py-2.5 rounded-full flex items-center justify-center space-x-2 transition text-xs shadow-xs"
                >
                  <span>💬 Order on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPARE DRAWER MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full space-y-6 relative shadow-2xl text-black border border-gold/30">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-4 right-4 bg-maroon text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-gold transition"
            >
              ✕
            </button>
            <h3 className="font-heading text-2xl text-maroon text-center mb-6 font-bold">Compare Saree Masterpieces</h3>
            
            <div className="grid grid-cols-4 gap-4 text-sm text-left">
              {/* Labels Column */}
              <div className="space-y-4 pt-28 font-semibold text-gray-500 uppercase text-xs">
                <div>Price</div>
                <div>Category</div>
                <div>Fabric</div>
                <div>Zari details</div>
                <div>Saree Color</div>
                <div>Motif border</div>
              </div>

              {/* Products Columns */}
              {compareList.map(item => (
                <div key={item.id} className="border border-gold/20 p-4 rounded-2xl bg-cream/20 text-center space-y-4 flex flex-col justify-between">
                  <div className="flex flex-col items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md mb-2 shadow-xs" />
                    <h5 className="font-heading text-xs font-bold text-maroon truncate w-full">{item.name}</h5>
                  </div>
                  <div className="space-y-4 pt-2 font-medium text-xs text-gray-700">
                    <div>₹{item.price.toLocaleString('en-IN')}</div>
                    <div>{item.category}</div>
                    <div>{item.fabric}</div>
                    <div>{item.zari || 'Pure Zari'}</div>
                    <div>{item.color || 'Traditional'}</div>
                    <div>{item.motif || 'Peacock'}</div>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-maroon text-white text-[10px] py-2 rounded-full hover:bg-gold hover:text-maroon transition font-bold uppercase tracking-wider"
                  >
                    Add To Cart
                  </button>
                </div>
              ))}

              {/* Blank spots if less than 3 */}
              {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                <div key={idx} className="border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 text-xs py-20">
                  Select Saree to Compare
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
