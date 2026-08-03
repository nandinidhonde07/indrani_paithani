import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import productsData from '../data/products.json';
import useAppStore from '../store/useAppStore.js';

const Home = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const [years, setYears] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [designs, setDesigns] = useState(0);

  const { cmsContent, isCMSLoading } = useAppStore();
  const homeData = cmsContent?.home;

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

  if (isCMSLoading || !homeData) return <div className="min-h-screen bg-cream flex items-center justify-center">Loading...</div>;

  const renderHero = () => (
    <section key="hero" className="relative h-screen w-full bg-[#FAF7F2] flex items-center pt-20 pb-12 px-8 lg:px-16 overflow-hidden">
      
      {/* LEFT CONTENT (40%) */}
      <div className="w-full lg:w-[45%] h-full flex flex-col justify-center pr-0 lg:pr-16 z-20 relative">
        
        {/* Luxury Detail Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="flex items-center space-x-3 mb-10 text-[9px] uppercase tracking-[0.3em] font-semibold text-[#888888]"
        >
          <span>Since 1961</span>
          <span className="w-1 h-1 rounded-full bg-[#C8A45A]"></span>
          <span>Authentic Handloom</span>
          <span className="w-1 h-1 rounded-full bg-[#C8A45A]"></span>
          <span>Direct From Weaver</span>
        </motion.div>

        {/* Small Label */}
        <motion.h4
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-[#C8A45A] uppercase tracking-[0.4em] text-[11px] font-body mb-6 font-semibold"
        >
          AUTHENTIC YEOLA PAITHANI
        </motion.h4>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="text-[#111111] font-heading text-[52px] lg:text-[72px] leading-[1.05] mb-8"
        >
          Woven with <span className="font-bold">Heritage.</span><br/>
          Crafted for <span className="font-bold">Eternity.</span>
        </motion.h1>
        
        {/* Description Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-[#444444] font-body text-[16px] lg:text-[18px] max-w-[500px] leading-relaxed mb-12 font-light"
        >
          Timeless handwoven masterpieces crafted by skilled artisans in Yeola.
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5"
        >
          <Link
            to="/shop"
            className="w-full sm:w-auto text-center bg-[#C8A45A] text-white font-semibold px-9 py-4 rounded-full hover:bg-[#111111] hover:text-[#C8A45A] transition-all duration-500 text-[11px] uppercase tracking-[0.2em]"
          >
            Explore Collection
          </Link>
          <Link
            to="/about"
            className="w-full sm:w-auto text-center border border-[#C8A45A] text-[#111111] font-semibold px-9 py-4 rounded-full hover:bg-[#C8A45A] hover:text-[#111111] transition-all duration-500 text-[11px] uppercase tracking-[0.2em]"
          >
            Our Story
          </Link>
        </motion.div>
      </div>

      {/* RIGHT IMAGE (60%) */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="hidden lg:block w-[55%] h-full relative rounded-tl-[120px] rounded-br-[120px] overflow-hidden shadow-2xl"
      >
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('${homeData.heroImage}')`,
            filter: 'brightness(1.05) contrast(1.05)'
          }}
        />
        {/* Subtle dark overlay on image only */}
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-[22.5%] transform -translate-x-1/2 z-20 flex flex-col items-center space-y-2 text-[#888888] text-[9px] tracking-widest uppercase font-medium"
      >
        <span>Scroll</span>
        <FiChevronDown className="animate-bounce text-[#111111]" size={14} />
      </motion.div>
    </section>
  );

  const renderCollections = () => (
    <section key="collections" className="py-24 px-6 bg-white border-b border-gold/15">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-center text-3xl md:text-5xl font-heading text-maroon mb-16 tracking-widest">Our Collection</h2>
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
  );

  const renderBanner = () => (
    <div key="banner" className="bg-maroon py-4 overflow-x-auto whitespace-nowrap scrollbar-none border-y border-gold/30">
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
  );

  const renderQuality = () => (
    <section key="quality" className="py-24 bg-cream">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-heading text-maroon tracking-wider">Our Quality & Heritage</h2>
              <p className="text-gold/80 italic text-sm tracking-widest uppercase">"Authentic Paithani woven in Yeola."</p>
              <p className="text-gray-600 font-light leading-relaxed">
                Every thread of our Paithani sarees tells a story of centuries-old craftsmanship. Woven with pure silk and authentic zari, our creations are a testament to the enduring legacy of Maharashtra's royal heritage.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-left">
              {[
                { title: "100% Handwoven", desc: "Traditional Looms" },
                { title: "Pure Silk", desc: "Mulberry Quality" },
                { title: "Authentic Zari", desc: "Gold & Silver Thread" },
                { title: "Trusted Legacy", desc: "Since 64 Years" }
              ].map((item, idx) => (
                <div key={idx} className="p-5 bg-white border border-gold/15 rounded-2xl shadow-sm hover:shadow-md transition">
                  <div className="text-2xl mb-2 text-gold">✨</div>
                  <h4 className="font-heading font-semibold text-maroon text-base mb-1">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gold/25">
              <div>
                <p className="text-4xl font-heading font-bold text-maroon">{years}+</p>
                <p className="text-[10px] text-gray-500 mt-2 font-semibold uppercase tracking-wider">Years Legacy</p>
              </div>
              <div>
                <p className="text-4xl font-heading font-bold text-maroon">{customers}+</p>
                <p className="text-[10px] text-gray-500 mt-2 font-semibold uppercase tracking-wider">Happy Patrons</p>
              </div>
              <div>
                <p className="text-4xl font-heading font-bold text-maroon">{designs}+</p>
                <p className="text-[10px] text-gray-500 mt-2 font-semibold uppercase tracking-wider">Unique Designs</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gold/20 translate-x-4 translate-y-4 rounded-3xl"></div>
            <img src="/assets/home_image_1.jpg" alt="Heritage Paithani Culture" className="relative z-10 w-full h-[700px] object-cover rounded-3xl shadow-premium" />
          </div>
        </div>
      </div>
    </section>
  );

  const renderFounder = () => (
    <section key="founder" className="py-24 bg-white border-y border-[#E5E5E5]">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="border border-[#E5E5E5] rounded-3xl p-8 md:p-12 bg-white grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          <div>
            <div className="relative">
              <img
                src={homeData.founderImage}
                alt={homeData.founderName}
                className="w-full rounded-xl object-cover aspect-[4/5] shadow-md relative z-10"
              />
            </div>
          </div>
          <div className="space-y-6 relative z-10">
            <h2 className="text-xs tracking-[0.25em] text-[#111111] uppercase font-bold font-heading">About The Founder</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-[#111111]">{homeData.founderName}</h3>
            <h4 className="text-[#666666] font-body tracking-wide font-medium text-lg">{homeData.founderTitle}</h4>
            <div className="w-16 h-px bg-[#111111] my-2"></div>
            <p className="text-[#2B2B2B] font-body text-sm leading-[1.8] mt-4">{homeData.founderText1}</p>
            <p className="text-[#2B2B2B] font-body text-sm leading-[1.8] mt-4">{homeData.founderText2}</p>
          </div>
        </div>
      </div>
    </section>
  );

  const renderBridal = () => (
    <section key="bridal" className="py-24 bg-white border-t border-gold/15">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-maroon/10 -translate-x-4 translate-y-4 rounded-3xl"></div>
            <img src="/assets/home_image_2.jpg" alt="Bridal Paithani" className="relative z-10 w-full h-[700px] object-cover rounded-3xl shadow-premium" />
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-xs tracking-[0.25em] text-gold uppercase font-bold">The Bridal Collection</h2>
            <h3 className="text-4xl md:text-6xl font-heading text-maroon">Elegance Personified</h3>
            <div className="w-16 h-0.5 bg-gold"></div>
            <p className="text-gray-700 font-light text-lg leading-relaxed">
              Your wedding day deserves nothing less than perfection. Our exclusive Bridal Paithani collection features meticulously hand-crafted sarees with intricate motifs, rich vibrant colors, and heavy gold zari work that ensures you radiate royal elegance on your special day.
            </p>
            <p className="text-gray-700 font-light text-lg leading-relaxed">
              Pass down a legacy of beauty to the next generation with a saree that transcends time.
            </p>
            <div className="pt-6">
              <Link to="/shop?category=Bridal" className="inline-block border-2 border-maroon text-maroon font-semibold px-10 py-4 rounded-full hover:bg-maroon hover:text-white transition duration-300 shadow-sm text-sm uppercase tracking-widest">
                View Bridal Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderTestimonials = () => (
    <section key="testimonials" className="py-24 bg-white border-y border-gold/15">
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
  );

  const renderLookbook = () => (
    <section key="lookbook" className="py-24 bg-cream">
      <div className="container mx-auto px-6 max-w-6xl text-center">
        <h2 className="text-3xl font-heading text-maroon mb-16 tracking-widest">Instagram Lookbook</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "https://picsum.photos/seed/insta1/500/500",
            "https://picsum.photos/seed/insta2/500/600",
            "https://picsum.photos/seed/insta3/500/400",
            "https://picsum.photos/seed/insta4/500/550"
          ].map((img, idx) => (
            <a 
              href="https://www.instagram.com/indranipaitani.yeola?utm_source=q"
              target="_blank"
              rel="noopener noreferrer"
              key={idx} 
              className="group relative rounded-2xl overflow-hidden shadow-premium aspect-square bg-white border border-gold/15 block"
            >
              <img src={img} alt="Insta" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-maroon/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <span className="text-white text-xs tracking-wider uppercase font-semibold">View On Instagram</span>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-12">
          <a 
            href="https://www.instagram.com/indranipaitani.yeola?utm_source=q"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-maroon text-maroon font-semibold px-10 py-3 rounded-full hover:bg-maroon hover:text-white transition duration-300 shadow-sm text-xs uppercase tracking-widest"
          >
            View on Instagram
          </a>
        </div>
      </div>
    </section>
  );

  const sectionMap = {
    hero: renderHero,
    collections: renderCollections,
    banner: renderBanner,
    quality: renderQuality,
    founder: renderFounder,
    bridal: renderBridal,
    testimonials: renderTestimonials,
    lookbook: renderLookbook
  };

  return (
    <div className="overflow-hidden bg-cream">
      {homeData.sectionOrder && homeData.sectionOrder.map(section => {
        if (!section.enabled) return null;
        const renderFunc = sectionMap[section.id];
        return renderFunc ? renderFunc() : null;
      })}
      {/* Fallback if sectionOrder is completely missing */}
      {(!homeData.sectionOrder || homeData.sectionOrder.length === 0) && (
        <>
          {renderHero()}
          {renderCollections()}
          {renderBanner()}
          {renderQuality()}
          {renderFounder()}
          {renderBridal()}
          {renderTestimonials()}
          {renderLookbook()}
        </>
      )}
    </div>
  );
};

export default Home;
