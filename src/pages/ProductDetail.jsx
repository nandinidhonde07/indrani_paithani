import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productsData from '../data/products.json';
import { FiHeart, FiShare2, FiShoppingCart, FiTruck, FiRotateCcw, FiStar, FiChevronDown, FiChevronUp, FiMaximize } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [related, setRelated] = useState([]);
  
  // Zoom & Full-screen states
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showFullscreen, setShowFullscreen] = useState(false);

  // FAQ Accordion states
  const [faqOpen, setFaqOpen] = useState([false, false, false]);

  useEffect(() => {
    const stored = localStorage.getItem('products');
    const catalog = stored ? JSON.parse(stored) : productsData;
    const found = catalog.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setActiveImageIndex(0);
      const filtered = catalog.filter(p => p.category === found.category && p.id !== found.id).slice(0, 4);
      setRelated(filtered);
    } else {
      navigate('/shop');
    }
  }, [id, navigate]);

  if (!product) return <div className="text-center py-20 bg-cream">Loading Saree...</div>;

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];
  const galleryLabels = ['Flat Saree', 'Woman Wearing Saree', 'Zoom View', 'Back Side', 'Pallu Close-up', 'Border Close-up'];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${imagesList[activeImageIndex]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const addToCart = () => {
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

  const addToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.find(item => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert(`${product.name} added to wishlist!`);
    } else {
      alert(`${product.name} is already in wishlist!`);
    }
  };

  const buyNow = () => {
    addToCart();
    navigate('/checkout');
  };

  const shareProduct = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Product link copied to clipboard!');
  };

  const toggleFaq = (index) => {
    const updated = [...faqOpen];
    updated[index] = !updated[index];
    setFaqOpen(updated);
  };

  return (
    <div className="bg-cream min-h-screen pt-32 pb-12 px-6 relative">
      <div className="container mx-auto max-w-6xl bg-white rounded-3xl p-6 md:p-12 shadow-premium border border-gold/10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Gallery View */}
          <div className="space-y-4">
            <div className="relative border border-gold/10 rounded-2xl overflow-hidden aspect-[3/4] cursor-zoom-in group">
              <img
                src={imagesList[activeImageIndex]}
                alt={product.name}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none border border-gold/30 rounded-2xl"
                style={zoomStyle}
              />
              {/* Maximize Icon */}
              <button
                onClick={() => setShowFullscreen(true)}
                className="absolute bottom-4 right-4 bg-black/60 text-white p-2.5 rounded-full hover:bg-gold transition"
                title="Fullscreen view"
              >
                <FiMaximize size={16} />
              </button>
            </div>

            {/* Thumbnails selector */}
            <div className="grid grid-cols-6 gap-2">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative rounded-lg overflow-hidden border-2 aspect-square ${
                    activeImageIndex === idx ? 'border-maroon' : 'border-gray-200'
                  }`}
                  title={galleryLabels[idx] || `View ${idx + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[6px] text-white text-center uppercase tracking-wide truncate">
                    {galleryLabels[idx] || `View ${idx + 1}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Product purchase specs */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center text-sm font-semibold tracking-wider text-gold uppercase">
                <span>{product.category}</span>
                <div className="flex items-center space-x-1 text-orange-500 font-bold">
                  <FiStar className="fill-orange-500" />
                  <span>{product.rating || 4.9} ({product.reviewsCount || 12} reviews)</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-heading text-maroon mt-2">{product.name}</h1>
              
              <div className="flex items-baseline space-x-3 mt-4">
                <span className="text-3xl font-heading font-semibold text-black">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 font-light leading-relaxed">{product.description}</p>
            
            <div className="bg-cream/10 p-4 border border-gold/15 rounded-xl text-xs space-y-1 font-light italic text-gray-600">
              <p><strong>Artisanal Weave Process:</strong> Woven on handlooms using mulberry silk with pure gold thread borders. This saree takes up to 4 weeks of handloom craftsmanship by skilled artisans in Yeola.</p>
              <p className="mt-2"><strong>Motif Narrative:</strong> The pallu highlights traditional twin peacock and parrot designs representing romance, royalty, and timeless heritage elegance.</p>
            </div>

            {/* Specifications */}
            <div className="border-t border-b border-gold/20 py-4 grid grid-cols-2 gap-4 text-sm">
              <div><strong>Fabric Details:</strong> {product.fabric}</div>
              {product.silkType && <div><strong>Silk Quality:</strong> {product.silkType}</div>}
              <div><strong>Zari details:</strong> {product.zari}</div>
              {product.weight && <div><strong>Weight:</strong> {product.weight}</div>}
              {product.length && <div><strong>Length:</strong> {product.length}</div>}
              {product.color && <div><strong>Saree Color:</strong> {product.color}</div>}
              {product.motif && <div><strong>Motif border:</strong> {product.motif}</div>}
            </div>

            {/* Care instructions */}
            <div className="text-xs text-gray-500 font-light space-y-1 border-b pb-4">
              <strong>Care Instructions:</strong> Dry clean only. Store wrapped in soft muslin cloth to protect the gold zari borders. Avoid direct perfume spray.
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={buyNow}
                className="bg-maroon hover:bg-gold text-white font-semibold flex-1 py-4 rounded-full transition shadow-lg text-center"
              >
                Buy Now
              </button>
              <button
                onClick={addToCart}
                className="border-2 border-maroon hover:bg-cream text-maroon font-semibold flex-1 py-4 rounded-full transition text-center"
              >
                Add To Cart
              </button>
            </div>

            <div className="flex space-x-6 text-sm text-gray-500 pt-2 justify-center sm:justify-start">
              <button onClick={addToWishlist} className="flex items-center space-x-2 hover:text-maroon transition">
                <FiHeart />
                <span>Save to Wishlist</span>
              </button>
              <button onClick={shareProduct} className="flex items-center space-x-2 hover:text-maroon transition">
                <FiShare2 />
                <span>Share Design</span>
              </button>
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div className="mt-20 border-t border-gold/20 pt-12 max-w-3xl mx-auto space-y-4">
          <h3 className="font-heading text-2xl text-maroon text-center mb-8">Purchase FAQs & Shipping Guarantees</h3>
          
          {[
            { q: "Is shipping really free and insured?", a: "Yes, we ship all sarees using high-priority, fully insured delivery partners. Shipping is completely complimentary across India." },
            { q: "How can I verify the authenticity?", a: "Every saree comes with an official weaver guarantee card verifying pure silk threads and traditional Yeola craftsmanship." },
            { q: "What is your return policy?", a: "We accept returns within 7 days in original, unworn condition with tags attached. Please contact support to initiate a return request." }
          ].map((item, idx) => (
            <div key={idx} className="border border-gold/15 rounded-xl overflow-hidden bg-cream/5">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-sm text-maroon hover:bg-cream/20 transition"
              >
                <span>{item.q}</span>
                {faqOpen[idx] ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {faqOpen[idx] && (
                <div className="p-4 text-xs text-gray-600 border-t border-gold/10 bg-white leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-gold/20 pt-12">
            <h2 className="text-2xl md:text-3xl font-heading text-maroon mb-8 text-center">Related Masterpieces</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(p => (
                <div key={p.id} className="group bg-cream/30 border border-gold/10 p-3 rounded-2xl hover:shadow-lg transition">
                  <div className="aspect-[3/4] overflow-hidden rounded-xl">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <h3 className="font-heading text-maroon mt-3 font-semibold text-sm truncate">
                    <Link to={`/product/${p.id}`}>{p.name}</Link>
                  </h3>
                  <p className="text-gray-700 text-xs font-bold mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN IMAGE VIEWER MODAL */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center p-6">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-6 right-6 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center font-bold hover:bg-gold transition shadow-lg text-lg z-50"
          >
            ✕
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-white/5 border border-gold/10 p-1 flex items-center justify-center">
            <img src={imagesList[activeImageIndex]} alt="" className="max-w-full max-h-full object-contain rounded-xl" />
          </div>
          <p className="text-gold text-xs uppercase tracking-widest mt-4">
            {galleryLabels[activeImageIndex] || `Saree View ${activeImageIndex + 1}`}
          </p>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
