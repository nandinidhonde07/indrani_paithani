import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiHeart, FiEye, FiShoppingCart, FiChevronDown } from 'react-icons/fi';
import productsData from '../data/products.json';
import FlipkartVariantSection from '../components/FlipkartVariantSection.jsx';

const Home = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Animated counters state simulation
  const [years, setYears] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [designs, setDesigns] = useState(0);

  useEffect(() => {
    setBestSellers(productsData.filter(p => p.bestSeller));
    setNewArrivals(productsData.filter(p => p.newArrival));

    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setYears(Math.min(64, Math.floor((64 / steps) * currentStep)));
      setCustomers(Math.min(5000, Math.floor((5000 / steps) * currentStep)));
      setDesigns(Math.min(1500, Math.floor((1500 / steps) * currentStep)));

      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const categories = [
    { name: "Pure Silk Paithani", image: "https://picsum.photos/seed/puresilk/500/600", path: "/shop?category=Pure%20Silk%20Paithani" },
    { name: "Bridal Paithani", image: "https://picsum.photos/seed/bridal/500/600", path: "/shop?category=Bridal%20Paithani" },
    { name: "Wedding Collection", image: "https://picsum.photos/seed/wedding/500/600", path: "/shop?category=Wedding%20Collection" },
    { name: "Heritage Collection", image: "https://picsum.photos/seed/heritage/500/600", path: "/shop?category=Heritage%20Collection" },
    { name: "Luxury Collection", image: "https://picsum.photos/seed/luxury/500/600", path: "/shop?category=Luxury%20Collection" },
    { name: "Paithani Dupattas", image: "https://picsum.photos/seed/dupattas/500/600", path: "/shop?category=Paithani%20Dupattas" }
  ];

  const testimonials = [
    {
      name: "Priya Deshmukh",
      photo: "https://picsum.photos/seed/user_priya/100/100",
      quote: "The saree is absolutely breathtaking. The pure gold zari work is incredibly fine and authentic. Highly recommended!",
      rating: 5,
      location: "Pune, Maharashtra"
    },
    {
      name: "Aditi Kulkarni",
      photo: "https://picsum.photos/seed/user_aditi/100/100",
      quote: "Pure royal feels! Wore it for my daughter's wedding and got endless compliments. Customer support was wonderful.",
      rating: 5,
      location: "Mumbai, Maharashtra"
    },
    {
      name: "Sneha Patil",
      photo: "https://picsum.photos/seed/user_sneha/100/100",
      quote: "Authentic weave direct from Yeola weavers. Uncompromising check, trust, and beautiful packing box.",
      rating: 5,
      location: "Nashik, Maharashtra"
    }
  ];

  return (
    <div className="overflow-hidden bg-cream">
      
      {/* 1. HERO BACKGROUND IMAGE SECTION WITH LUXURY SHIMMER & ZOOM */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 6, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('/assets/homepage_bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-maroon/60 z-10"></div>

        {/* Shimmer title and centered info */}
        <div className="relative z-20 text-center text-white px-6 max-w-4xl space-y-6">
          <motion.img
            src="/assets/logo.jpg"
            alt="Indrani Paithani Logo"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="w-24 h-24 mx-auto mb-2 rounded-full border-2 border-gold/40 shadow-premium object-cover"
          />
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="text-5xl md:text-8xl font-heading tracking-[0.25em] text-gold mb-2 relative overflow-hidden"
          >
            <span className="bg-gradient-to-r from-gold via-cream to-gold bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
              INDRANI PAITHANI
            </span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="space-y-2 font-heading text-lg md:text-2xl font-light tracking-widest text-cream"
          >
            <p>Woven With Heritage.</p>
            <p>Crafted For Eternity.</p>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 1.2 }}
            className="text-xs md:text-sm tracking-[0.3em] uppercase text-gold/80"
          >
            "Every thread reflects generations of heritage."
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="flex justify-center space-x-6 pt-4"
          >
            <Link
              to="/shop"
              className="bg-gold text-maroon font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-maroon transition duration-300 shadow-lg text-xs uppercase tracking-widest"
            >
              Explore Collection
            </Link>
            <Link
              to="/shop"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-maroon transition duration-300 shadow-lg text-xs uppercase tracking-widest"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>

        {/* Scroll-down indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center space-y-1 text-gold/60 text-xs tracking-wider uppercase font-semibold">
          <span>Scroll Down</span>
          <FiChevronDown className="animate-bounce" size={16} />
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="py-24 px-6 bg-white border-b border-gold/15">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-center text-3xl md:text-5xl font-heading text-maroon mb-16 tracking-widest">Featured Collections</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {categories.map((cat, idx) => (
              <Link to={cat.path} key={idx} className="group flex flex-col items-center space-y-4">
                <div className="relative w-full aspect-square rounded-full overflow-hidden border-2 border-gold/20 hover:border-gold transition duration-700 shadow-premium bg-cream/15 p-1">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full transition-transform group-hover:scale-110 duration-700" />
                </div>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-maroon text-center group-hover:text-gold transition">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTRODUCING OUR FINEST CREATION */}
      <section className="py-24 px-6 container mx-auto text-center max-w-3xl space-y-6">
        <h2 className="text-xs tracking-[0.35em] text-gold uppercase font-semibold">Introducing Our Finest Creation</h2>
        <h3 className="text-4xl md:text-6xl font-heading text-maroon tracking-wider">PAITHANI COLLECTION</h3>
        <div className="w-24 h-0.5 bg-gold mx-auto my-4"></div>
        <p className="text-gray-700 leading-relaxed font-light text-base md:text-lg">
          Discover exquisite Paithani sarees inspired by centuries of Maharashtrian heritage.
          Handcrafted with intricate artistry, luxurious fabrics, and timeless elegance, every drape is designed to become a treasured heirloom for generations.
        </p>
        <p className="text-gold/80 italic text-xs tracking-widest uppercase">
          "Crafted over months by skilled artisans."
        </p>
      </section>

      {/* 4. PAITHANI COLLECTION GRID */}
      <section className="py-20 px-6 bg-white border-y border-gold/15">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productsData.slice(0, 3).map(p => (
              <div key={p.id} className="group bg-cream/10 rounded-2xl overflow-hidden shadow-premium border border-gold/15 hover:shadow-2xl transition duration-500 relative flex flex-col justify-between">
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-maroon text-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-gold/30">
                    Handwoven
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h4 className="font-heading text-2xl text-maroon">{p.name}</h4>
                  <p className="text-xs text-gray-500 font-light truncate">{p.description}</p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg text-maroon">₹{p.price.toLocaleString('en-IN')}</span>
                    <Link to={`/product/${p.id}`} className="text-xs text-gold font-bold border-b border-gold hover:text-maroon pb-1 transition uppercase tracking-widest">
                      View Saree
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-center text-3xl md:text-4xl font-heading text-maroon mb-16 tracking-widest">Our Best Sellers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map(p => (
              <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-premium border border-gold/10 p-4 space-y-3">
                <img src={p.image} alt={p.name} className="w-full aspect-[3/4] object-cover rounded-lg" />
                <h4 className="font-heading text-maroon font-semibold truncate text-sm">{p.name}</h4>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">₹{p.price.toLocaleString('en-IN')}</span>
                  <Link to={`/product/${p.id}`} className="text-gold hover:underline font-bold uppercase tracking-wider text-[10px]">Buy Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="py-24 px-6 bg-white border-y border-gold/15">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-center text-3xl md:text-4xl font-heading text-maroon mb-16 tracking-widest">New Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map(p => (
              <div key={p.id} className="bg-cream/20 rounded-xl overflow-hidden border border-gold/10 p-4 space-y-3">
                <img src={p.image} alt={p.name} className="w-full aspect-[3/4] object-cover rounded-lg" />
                <h4 className="font-heading text-maroon font-semibold truncate text-sm">{p.name}</h4>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">₹{p.price.toLocaleString('en-IN')}</span>
                  <Link to={`/product/${p.id}`} className="text-gold hover:underline font-bold uppercase tracking-wider text-[10px]">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LUXURY BANNER */}
      <div className="bg-maroon py-4 overflow-x-auto whitespace-nowrap scrollbar-none border-y border-gold/30">
        <div className="inline-flex space-x-12 px-6 text-gold font-medium tracking-widest text-sm animate-pulse">
          <span>✨ Pure Silk</span>
          <span>✨ Handwoven</span>
          <span>✨ Authentic Zari</span>
          <span>✨ Direct From Weaver</span>
          <span>✨ Trusted Since 64 Years</span>
          <span>✨ Pure Silk</span>
          <span>✨ Handwoven</span>
          <span>✨ Authentic Zari</span>
          <span>✨ Direct From Weaver</span>
          <span>✨ Trusted Since 64 Years</span>
        </div>
      </div>

      {/* 8. WHY CHOOSE US & STATISTICS SECTION */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-6 max-w-6xl space-y-16">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-5xl font-heading text-maroon tracking-wider">Our Quality & Heritage</h2>
            <p className="text-gold/80 italic text-xs tracking-widest uppercase">"Authentic Paithani woven in Yeola."</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
            {[
              { title: "100% Handwoven", desc: "Traditional Looms" },
              { title: "Pure Silk", desc: "Mulberry Quality" },
              { title: "Authentic Zari", desc: "Gold & Silver Thread" },
              { title: "Trusted Since 64 Years", desc: "A Legacy of Trust" },
              { title: "Direct From Weaver", desc: "Fair Trade & Authentic" },
              { title: "Premium Quality", desc: "Uncompromising Check" }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white border border-gold/15 rounded-2xl hover:shadow-premium transition">
                <div className="text-3xl mb-2 text-gold">✨</div>
                <h4 className="font-heading font-semibold text-maroon text-sm mb-1">{item.title}</h4>
                <p className="text-[10px] text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Animated counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gold/25 text-center">
            <div>
              <p className="text-4xl md:text-6xl font-heading font-bold text-maroon">{years}+</p>
              <p className="text-xs text-gray-500 mt-2 font-semibold uppercase tracking-wider">Years of Heritage</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-heading font-bold text-maroon">{customers}+</p>
              <p className="text-xs text-gray-500 mt-2 font-semibold uppercase tracking-wider">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-heading font-bold text-maroon">{designs}+</p>
              <p className="text-xs text-gray-500 mt-2 font-semibold uppercase tracking-wider">Luxury Designs</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-heading font-bold text-maroon">100%</p>
              <p className="text-xs text-gray-500 mt-2 font-semibold uppercase tracking-wider">Authentic Handwoven</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INTERACTIVE VARIANT SECTION */}
      <FlipkartVariantSection />

      {/* 10. FOUNDER SECTION (PREMIUM EDITORIAL FRAME WITH SIGNATURE PLACEHOLDER) */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="border-4 border-gold rounded-3xl p-8 md:p-12 bg-white grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative shadow-premium">
            <div className="absolute top-4 left-4 right-4 bottom-4 border border-gold/30 rounded-2xl pointer-events-none"></div>
            <div>
              <div className="relative p-2 border border-gold rounded-2xl">
                <img
                  src="/assets/founder_home.jpg"
                  alt="Niharika Wade"
                  className="w-full rounded-xl object-cover aspect-[4/5] shadow-premium relative z-10"
                />
              </div>
            </div>
            <div className="space-y-6 relative z-10">
              <h2 className="text-xs tracking-[0.25em] text-gold uppercase font-bold">About The Founder</h2>
              <h3 className="text-3xl md:text-5xl font-heading text-maroon">Niharika Wade</h3>
              <h4 className="text-gold font-body tracking-wide font-medium text-lg">Founder & CEO, Indrani Paithani</h4>
              
              <div className="w-16 h-0.5 bg-gold my-2"></div>
              
              <blockquote className="italic text-gray-600 border-l-4 border-gold pl-4 text-sm leading-relaxed">
                "Luxury is not created overnight—it is woven through generations of trust, artistry, and timeless craftsmanship."
              </blockquote>
              
              <p className="text-gray-700 font-light text-sm leading-relaxed">
                At Indrani Paithani, we are dedicated to preserving and celebrating the timeless heritage of Paithani craftsmanship, proudly carrying forward a legacy that has been cherished for over 64 years. Every creation reflects authenticity, elegance, and uncompromising quality.
              </p>
              
              <div className="pt-4 text-gold/70 font-heading text-lg tracking-widest">
                Niharika Wade
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. TESTIMONIALS SLIDER */}
      <section className="py-24 bg-white border-y border-gold/15">
        <div className="container mx-auto px-6 max-w-3xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-heading text-maroon tracking-wider">Patron Testimonials</h2>
          
          <div className="relative min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="text-gold text-lg">{"★".repeat(testimonials[activeTestimonial].rating)}</div>
                <p className="text-gray-700 italic text-lg leading-relaxed">"{testimonials[activeTestimonial].quote}"</p>
                <div className="flex items-center justify-center space-x-3 pt-4">
                  <img src={testimonials[activeTestimonial].photo} alt={testimonials[activeTestimonial].name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="text-left">
                    <h4 className="font-heading font-semibold text-maroon text-sm">{testimonials[activeTestimonial].name}</h4>
                    <span className="text-[10px] text-gray-400 block">{testimonials[activeTestimonial].location}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center space-x-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2.5 h-2.5 rounded-full transition ${activeTestimonial === idx ? 'bg-maroon' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 12. INSTAGRAM LOOKBOOK */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-center text-3xl font-heading text-maroon mb-16 tracking-widest">Instagram Lookbook</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://picsum.photos/seed/insta1/500/500",
              "https://picsum.photos/seed/insta2/500/600",
              "https://picsum.photos/seed/insta3/500/400",
              "https://picsum.photos/seed/insta4/500/550"
            ].map((img, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-premium aspect-square bg-white border border-gold/15">
                <img src={img} alt="Insta" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-maroon/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <span className="text-white text-xs tracking-wider uppercase font-semibold">View On Instagram</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. NEWSLETTER */}
      <section className="py-20 bg-maroon text-white text-center border-t border-gold/30">
        <div className="container mx-auto px-6 max-w-2xl space-y-4">
          <h2 className="text-3xl font-heading text-gold tracking-widest">Subscribe to Our Royal Updates</h2>
          <p className="text-sm font-light text-cream/80">
            Be the first to hear about new collections, designer previews, and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-gold flex-grow max-w-md text-xs"
              required
            />
            <button className="bg-gold text-maroon font-semibold px-8 py-3 rounded-full hover:bg-white transition duration-300 text-xs uppercase tracking-widest">
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;
