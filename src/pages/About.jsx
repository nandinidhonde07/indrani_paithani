import React from 'react';
import { motion } from 'framer-motion';
import useAppStore from '../store/useAppStore.js';

const About = () => {
  const { cmsContent, isCMSLoading } = useAppStore();
  const aboutData = cmsContent?.about;
  const homeData = cmsContent?.home; // Reusing founder text from home for consistency if needed, or using about text. Wait, defaultSiteContent.json has founderImage in about, but founderText is from home usually. Actually let's just use homeData for founder text since it was updated there.

  if (isCMSLoading || !aboutData) return <div className="min-h-screen bg-cream flex items-center justify-center">Loading...</div>;
  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Hero Banner */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-maroon/70 z-10"></div>
        <img
          src={aboutData.heroImage}
          alt={aboutData.heroTitle}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 text-center text-white px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading tracking-widest text-gold mb-2"
          >
            {aboutData.heroTitle}
          </motion.h1>
          <p className="text-sm md:text-lg font-light tracking-wide text-cream">
            {aboutData.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Main Story Content */}
      <section className="container mx-auto px-6 py-16 max-w-4xl text-center space-y-8">
        <p className="text-lg md:text-xl font-heading text-maroon leading-relaxed">
          {aboutData.storyText1}
        </p>
        <p className="text-gray-700 font-light leading-relaxed">
          {aboutData.storyText2}
        </p>
        <p className="text-gray-700 font-light leading-relaxed">
          {aboutData.storyText3}
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
                {aboutData.missionText}
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
        <div className="border border-[#E5E5E5] rounded-3xl p-8 md:p-12 bg-white grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          <div className="space-y-6 relative z-10">
            <h2 className="text-xs tracking-[0.25em] text-[#111111] uppercase font-bold font-heading">About The Founder</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-[#111111]">{homeData?.founderName}</h3>
            <h4 className="text-[#666666] font-body tracking-wide font-medium text-lg">{homeData?.founderTitle}</h4>
            <div className="w-16 h-px bg-[#111111] my-2"></div>
            <p className="text-[#2B2B2B] font-body text-sm leading-[1.8] mt-4">
              {homeData?.founderText1}
            </p>
            <p className="text-[#2B2B2B] font-body text-sm leading-[1.8] mt-4">
              {homeData?.founderText2}
            </p>
          </div>
          <div className="relative">
            <img
              src={aboutData.founderImage}
              alt={homeData?.founderName}
              className="w-full rounded-xl object-cover aspect-[4/5] shadow-md relative z-10"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
