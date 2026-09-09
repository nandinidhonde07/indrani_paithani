import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const AccessibilityStatement = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-6 animate-fade-in">
      <div className="container mx-auto max-w-[900px]">
        <div className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-12">
          <Link to="/" className="hover:text-maroon transition">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-black">Accessibility Statement</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-black mb-12">ACCESSIBILITY STATEMENT</h1>
        
        <div className="space-y-8 text-black font-body text-base leading-loose font-normal">
          <p>
            Indrani Paithani is committed to providing a welcoming and inclusive digital experience for all visitors.
          </p>
          <p className="mt-4">
            We continuously strive to improve the accessibility and usability of our website so that everyone can comfortably explore our collections and services.
          </p>
          <p className="mt-4">
            If you experience any difficulty accessing content, viewing products, or completing a purchase, we encourage you to contact our support team.
          </p>
          <p className="mt-4">
            Email: <a href="mailto:indranipaithani.yeola@gmail.com" className="text-maroon font-semibold hover:underline">indranipaithani.yeola@gmail.com</a>
          </p>
          <p className="mt-4">
            We are dedicated to providing assistance and ensuring a seamless shopping experience for every customer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityStatement;
