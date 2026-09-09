import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const variantsData = [
  {
    color: 'Red-Orange (Parrot Pallu)',
    colorCode: '#D35400',
    price: '₹34,999.00',
    sareeImage: '/assets/products/muniya_1.png',
    drapedImage: '/assets/founder_home.jpg', // Women showing view
    features: ['100% Handwoven Mulberry Silk', 'Traditional Parrot Pallu Artistry', 'Trusted Since 64 Years']
  },
  {
    color: 'Saffron Orange (Striped Pallu)',
    colorCode: '#E67E22',
    price: '₹34,999.00',
    sareeImage: '/assets/products/muniya_2.png',
    drapedImage: '/assets/founder_about.jpg', // Another view
    features: ['Premium Saffron Brocade Threadwork', 'Classic Horizontal Strips Pattern', 'Yeola Craftsmanship']
  },
  {
    color: 'Royal Purple (Peacock Border)',
    colorCode: '#8E44AD',
    price: '₹65,000.00',
    sareeImage: '/assets/products/purple_parrot.png',
    drapedImage: '/assets/founder_home.jpg', // Another view
    features: ['Opulent Purple & Gold Contrast', 'Detailed Peacock Motifs', 'Collector\'s Heritage Piece']
  }
];

const FlipkartVariantSection = () => {
  const [selectedVariant, setSelectedVariant] = useState(variantsData[0]);
  const [activeView, setActiveView] = useState('flat'); // 'flat' or 'draped'

  return (
    <section className="py-20 bg-white border-y border-gold/20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-sm tracking-[0.2em] text-maroon/60 uppercase">Flipkart Style Custom Choice</h2>
          <h3 className="text-3xl md:text-5xl font-heading text-maroon">Muniya Paithani Colorways</h3>
          <p className="text-gray-500 font-light text-sm max-w-lg mx-auto">
            Choose your preferred shade of our signature Muniya Paithani and toggle between flat-lay weave details and draped model presentation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: COLOR AND VARIANT PICKER (1/3 width) */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-heading text-xl text-maroon">Select Colorway</h4>
            <div className="flex gap-4">
              {variantsData.map((v, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVariant(v)}
                  className={`w-12 h-12 rounded-full border-4 transition transform hover:scale-110 ${
                    selectedVariant.color === v.color ? 'border-gold scale-105 shadow-lg' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: v.colorCode }}
                  title={v.color}
                />
              ))}
            </div>

            <div className="bg-cream/40 p-6 rounded-2xl border border-gold/10 space-y-4">
              <div>
                <span className="text-xs text-gray-500 block">Selected Shade</span>
                <span className="font-medium text-maroon text-lg">{selectedVariant.color}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Price</span>
                <span className="font-heading text-2xl font-bold text-black">{selectedVariant.price}</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 font-light">
                {selectedVariant.features.map((f, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="text-gold">✨</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* VIEW TOGGLE */}
            <div className="flex bg-cream p-1 rounded-full border border-gold/20">
              <button
                onClick={() => setActiveView('flat')}
                className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition ${
                  activeView === 'flat' ? 'bg-maroon text-white shadow-md' : 'text-maroon hover:text-gold'
                }`}
              >
                Flat-Lay Weave View
              </button>
              <button
                onClick={() => setActiveView('draped')}
                className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition ${
                  activeView === 'draped' ? 'bg-maroon text-white shadow-md' : 'text-maroon hover:text-gold'
                }`}
              >
                Women Draped View
              </button>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE VIEWER (2/3 width) */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-lg aspect-[3/4] rounded-3xl overflow-hidden shadow-premium border border-gold/20 bg-cream/20">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedVariant.color + activeView}
                  src={activeView === 'flat' ? selectedVariant.sareeImage : selectedVariant.drapedImage}
                  alt={selectedVariant.color}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs tracking-wider uppercase font-medium">
                {activeView === 'flat' ? '🔍 Authentic Detail View' : '✨ Model Drape Look'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlipkartVariantSection;
