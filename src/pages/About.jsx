import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Hero Banner */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-maroon/70 z-10"></div>
        <img
          src="https://picsum.photos/seed/royal_about/1920/600"
          alt="Royal Paithani"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 text-center text-white px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading tracking-widest text-gold mb-2"
          >
            OUR STORY
          </motion.h1>
          <p className="text-sm md:text-lg font-light tracking-wide text-cream">
            A Royal Legacy, Now Yours.
          </p>
        </div>
      </section>

      {/* Main Story Content */}
      <section className="container mx-auto px-6 py-16 max-w-4xl text-center space-y-8">
        <p className="text-lg md:text-xl font-heading text-maroon leading-relaxed">
          Indrani Paithani is a celebration of heritage, artistry, and timeless luxury.
        </p>
        <p className="text-gray-700 font-light leading-relaxed">
          Rooted in a weaving legacy that spans three generations, our journey began with a passion to preserve the royal tradition of authentic Paithani craftsmanship. From the skilled hands of our artisans to the elegance of your wardrobe, every saree is a masterpiece woven with dedication, purity, and grace.
        </p>
        <p className="text-gray-700 font-light leading-relaxed">
          Inspired by Maharashtra's rich cultural heritage and crafted with meticulous attention to detail, each Paithani carries a story of legacy, pride, and timeless beauty. At Indrani Paithani, we do not simply create sarees—we curate heirlooms destined to be cherished for generations.
        </p>
        <div className="border-y border-gold/30 py-6 my-8 grid grid-cols-2 md:grid-cols-4 gap-4 font-heading text-maroon text-lg font-semibold tracking-wider">
          <div>Authentic</div>
          <div>Timeless</div>
          <div>Royal</div>
          <div>Direct From Weaver</div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-white py-16 border-y border-gold/20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-heading text-maroon mb-4">Our Mission</h2>
              <p className="text-gray-700 font-light leading-relaxed">
                To preserve the royal art of Paithani weaving and deliver authentic handwoven masterpieces directly from the weaver to customers who appreciate timeless luxury.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-heading text-maroon mb-4">Our Values</h2>
              <div className="grid grid-cols-2 gap-4">
                {["Heritage", "Authenticity", "Trust", "Luxury", "Craftsmanship", "Excellence"].map((val, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-gray-700 font-light">
                    <span className="text-gold">✨</span>
                    <span>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION (ABOUT PAGE - USING 2ND IMAGE) */}
      <section className="container mx-auto px-6 py-20 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-sm tracking-[0.2em] text-maroon/60 uppercase">About The Founder</h2>
            <h3 className="text-3xl md:text-5xl font-heading text-maroon">Niharika Wade</h3>
            <h4 className="text-gold font-body tracking-wide font-medium text-lg">Founder & CEO, Indrani Paithani</h4>
            <blockquote className="italic text-gray-600 border-l-4 border-gold pl-4 text-base">
              "Luxury begins with trust."
            </blockquote>
            <p className="text-gray-700 font-light leading-relaxed">
              At Indrani Paithani, we are dedicated to preserving and celebrating the timeless heritage of Paithani craftsmanship, proudly carrying forward a legacy that has been cherished for over 64 years.
            </p>
            <p className="text-gray-700 font-light leading-relaxed">
              Every creation reflects authenticity, elegance, and uncompromising quality. Our commitment extends beyond beautiful sarees. We strive to build lasting relationships founded on customer satisfaction, transparency, and unwavering trust.
            </p>
            <p className="text-gray-700 font-light leading-relaxed">
              These values remain at the heart of everything we do, ensuring every patron experiences the true essence of heritage and luxury.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 border-2 border-gold rounded-3xl -m-3 pointer-events-none"></div>
            <img
              src="/assets/founder_about.jpg"
              alt="Niharika Wade"
              className="w-full rounded-2xl object-cover aspect-[4/5] shadow-premium"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
