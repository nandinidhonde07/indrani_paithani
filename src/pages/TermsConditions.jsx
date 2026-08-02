import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-6 animate-fade-in">
      <div className="container mx-auto max-w-[900px]">
        <div className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-12">
          <Link to="/" className="hover:text-maroon transition">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-black">Terms & Conditions</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-black mb-12">TERMS & CONDITIONS</h1>
        
        <div className="space-y-8 text-black font-body text-base leading-loose font-normal">
          <p className="font-semibold">Welcome to Indrani Paithani.</p>
          <p>
            By accessing our website and placing an order, you agree to the following terms:
          </p>
          <ul className="list-disc pl-6 space-y-4 mt-4">
            <li>Product colors may vary slightly due to photography, lighting, and screen settings.</li>
            <li>All prices displayed are subject to change without prior notice.</li>
            <li>Orders are confirmed only after successful payment verification.</li>
            <li>Custom, personalized, or made-to-order products cannot be modified once production has commenced.</li>
            <li>We reserve the right to cancel or refuse any order due to pricing errors, product unavailability, or unforeseen circumstances.</li>
            <li>All website content, including images, designs, logos, and text, is the intellectual property of Indrani Paithani and may not be used without permission.</li>
          </ul>
          <p className="mt-4">
            Continued use of our website constitutes acceptance of these terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
