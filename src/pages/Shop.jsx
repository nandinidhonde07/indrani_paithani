import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import productsData from '../data/products.json';
import { FiHeart, FiEye, FiShoppingCart, FiStar, FiX } from 'react-icons/fi';

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
  const [maxPrice, setMaxPrice] = useState(400000);
  const [selectedFabric, setSelectedFabric] = useState('');
  const [selectedMotif, setSelectedMotif] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  
  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Compare products state
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(productsData);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
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

    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
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
  }, [searchQuery, selectedCategory, selectedFabric, selectedMotif, selectedColor, maxPrice, sortBy, products]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  const addToWishlist = (product) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.find(item => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert(`${product.name} added to wishlist!`);
    } else {
      alert(`${product.name} is already in wishlist!`);
    }
  };

  const buyNow = (product) => {
    addToCart(product);
    navigate('/checkout');
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

  return (
    <div className="bg-cream min-h-screen py-10 px-6 relative">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-5xl font-heading text-maroon text-center mb-10 tracking-widest">
          The Luxury Saree Boutique
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Advanced Filter Sidebar */}
          <aside className="bg-white p-6 rounded-2xl shadow-premium border border-gold/15 h-fit space-y-6">
            <h2 className="text-xl font-heading text-maroon border-b border-gold/20 pb-2">Filter Boutique</h2>

            {/* Price Slider */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                Max Budget: ₹{maxPrice.toLocaleString('en-IN')}
              </label>
              <input
                type="range"
                min="10000"
                max="400000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-maroon"
              />
            </div>

            {/* Collection Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Collection</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gold bg-white"
              >
                <option value="">All Collections</option>
                <option value="Pure Silk Paithani">Pure Silk Paithani</option>
                <option value="Bridal Paithani">Bridal Paithani</option>
                <option value="Wedding Collection">Wedding Collection</option>
                <option value="Traditional Collection">Traditional Collection</option>
                <option value="Heritage Collection">Heritage Collection</option>
                <option value="Luxury Collection">Luxury Collection</option>
              </select>
            </div>

            {/* Color Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Color</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gold bg-white"
              >
                <option value="">All Colors</option>
                <option value="Red-Orange">Red-Orange</option>
                <option value="Saffron Orange">Saffron Orange</option>
                <option value="Purple">Purple</option>
                <option value="Pink">Pink</option>
                <option value="Multicolor">Multicolor</option>
                <option value="Cream">Cream</option>
              </select>
            </div>

            {/* Motif Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Motif Pattern</label>
              <select
                value={selectedMotif}
                onChange={(e) => setSelectedMotif(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gold bg-white"
              >
                <option value="">All Motifs</option>
                <option value="Parrot / Bird">Parrot / Bird</option>
                <option value="Peacock / Parrot">Peacock / Parrot</option>
                <option value="Swan / Lotus">Swan / Lotus</option>
                <option value="Peacock">Peacock</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gold bg-white"
              >
                <option value="popularity">Popularity</option>
                <option value="newest">Newest Arrivals</option>
                <option value="best-selling">Best Selling (Rating)</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedFabric('');
                setSelectedMotif('');
                setSelectedColor('');
                setMaxPrice(400000);
                setSearchQuery('');
              }}
              className="w-full bg-cream text-maroon border border-gold/30 text-xs py-2 rounded-lg font-semibold hover:bg-maroon hover:text-white transition"
            >
              Reset Filters
            </button>
          </aside>

          {/* MAIN PRODUCT GRID */}
          <main className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Showing {filteredProducts.length} masterpiece designs</span>
              {compareList.length > 0 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="bg-gold text-maroon font-bold px-4 py-1.5 rounded-full text-xs hover:bg-maroon hover:text-white transition"
                >
                  Compare ({compareList.length}) Selected
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(s => (
                  <div key={s} className="bg-white rounded-2xl p-4 space-y-4 animate-pulse border">
                    <div className="w-full aspect-[3/4] bg-gray-200 rounded-xl"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map(p => {
                  const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                  const hasSecondary = p.images && p.images.length > 1;

                  return (
                    <div
                      key={p.id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-premium border border-gold/10 hover:shadow-2xl hover:-translate-y-1.5 transition duration-500 relative flex flex-col justify-between"
                    >
                      {/* Card Image */}
                      <div className="relative overflow-hidden aspect-[3/4]">
                        <img
                          src={p.image}
                          alt={p.name}
                          className={`w-full h-full object-cover transition-transform duration-700 ${
                            hasSecondary ? 'group-hover:opacity-0' : 'group-hover:scale-105'
                          }`}
                        />
                        {hasSecondary && (
                          <img
                            src={p.images[1]}
                            alt={p.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                          />
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col space-y-1">
                          {discount > 0 && (
                            <span className="bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              -{discount}% Off
                            </span>
                          )}
                          <span className="bg-maroon text-gold text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-gold/30">
                            Handwoven
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 flex flex-col space-y-1">
                          <span className="bg-green-100 text-green-700 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Authentic
                          </span>
                          {p.price > 50000 && (
                            <span className="bg-gold text-maroon text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Limited Edition
                            </span>
                          )}
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-maroon/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center space-x-4">
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
                      <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center text-[10px] text-gold font-medium uppercase tracking-wider">
                            <span>{p.category}</span>
                            <div className="flex items-center space-x-0.5 text-orange-500 font-bold">
                              <FiStar size={10} className="fill-orange-500" />
                              <span>{p.rating || 4.8} ({p.reviewsCount || 10})</span>
                            </div>
                          </div>
                          
                          <h3 className="font-heading text-base text-maroon font-bold hover:text-gold transition mt-1">
                            <Link to={`/product/${p.id}`}>{p.name}</Link>
                          </h3>
                        </div>
                        
                        <div className="space-y-3 pt-2">
                          <div className="flex justify-between items-baseline">
                            <div className="flex items-baseline space-x-2">
                              <span className="font-heading text-base text-black font-bold">
                                ₹{p.price.toLocaleString('en-IN')}
                              </span>
                              {p.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  ₹{p.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                            
                            {/* Compare Checkbox */}
                            <label className="flex items-center space-x-1 cursor-pointer text-[10px] font-semibold text-gray-500 uppercase hover:text-maroon">
                              <input
                                type="checkbox"
                                checked={!!compareList.find(c => c.id === p.id)}
                                onChange={() => handleCompareToggle(p)}
                                className="rounded text-gold focus:ring-gold"
                              />
                              <span>Compare</span>
                            </label>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => buyNow(p)}
                              className="bg-maroon hover:bg-gold text-white text-xs py-2 rounded-full flex-1 transition font-semibold"
                            >
                              Buy Now
                            </button>
                            <button
                              onClick={() => addToCart(p)}
                              className="border border-maroon hover:bg-cream text-maroon text-xs py-2 rounded-full flex-1 transition font-semibold"
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
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 relative shadow-2xl">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 bg-maroon text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-gold transition"
            >
              ✕
            </button>
            <div className="aspect-[3/4]">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 space-y-6 flex flex-col justify-between">
              <div>
                <span className="text-xs tracking-wider text-gold font-medium uppercase">{quickViewProduct.category}</span>
                <h2 className="text-2xl font-heading text-maroon">{quickViewProduct.name}</h2>
                <div className="flex items-center space-x-2 text-xs text-orange-500 font-bold mt-1">
                  <FiStar className="fill-orange-500" />
                  <span>{quickViewProduct.rating || 4.8} ({quickViewProduct.reviewsCount || 10} reviews)</span>
                </div>
                <p className="text-2xl font-bold font-heading text-black mt-2">
                  ₹{quickViewProduct.price.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-gray-600 font-light mt-4 leading-relaxed">{quickViewProduct.description}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="bg-maroon hover:bg-gold text-white font-semibold flex-1 py-3 rounded-full transition shadow-md"
                >
                  Add To Cart
                </button>
                <Link
                  to={`/product/${quickViewProduct.id}`}
                  className="border border-maroon text-maroon font-semibold flex-1 py-3 rounded-full text-center hover:bg-cream transition"
                >
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPARE DRAWER MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full space-y-6 relative shadow-2xl text-black">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-4 right-4 bg-maroon text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-gold transition"
            >
              ✕
            </button>
            <h3 className="font-heading text-2xl text-maroon text-center mb-6">Compare Saree Masterpieces</h3>
            
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
                <div key={item.id} className="border p-4 rounded-2xl bg-cream/10 text-center space-y-4 flex flex-col justify-between">
                  <div className="flex flex-col items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md mb-2 shadow" />
                    <h5 className="font-heading text-xs font-bold text-maroon truncate w-full">{item.name}</h5>
                  </div>
                  <div className="space-y-4 pt-2 font-medium text-xs">
                    <div>₹{item.price.toLocaleString('en-IN')}</div>
                    <div>{item.category}</div>
                    <div>{item.fabric}</div>
                    <div>{item.zari}</div>
                    <div>{item.color || 'Traditional'}</div>
                    <div>{item.motif || 'Peacock'}</div>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-maroon text-white text-[10px] py-1.5 rounded-full hover:bg-gold transition font-bold"
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
