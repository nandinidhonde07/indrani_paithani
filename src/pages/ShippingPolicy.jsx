import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ShippingPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-6 animate-fade-in">
      <div className="container mx-auto max-w-[900px]">
        <div className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-12">
          <Link to="/" className="hover:text-maroon transition">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-black">Shipping Policy</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-black mb-12">SHIPPING POLICY</h1>
        
        <div className="space-y-8 text-black font-body text-base leading-loose font-normal">
          <p>
            At Indrani Paithani, every saree is handled with utmost care and delivered with premium packaging.
          </p>
          <p className="mt-4">
            We offer delivery across India and selected international destinations.
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Ready-to-ship products are typically dispatched within 2–5 business days.</li>
            <li>Made-to-order and customized Paithanis may require additional production time, which will be communicated at the time of purchase.</li>
          </ul>
          <p className="mt-4">
            Once dispatched, tracking details will be shared via WhatsApp, email, or SMS. Delivery timelines may vary depending on location, courier operations, and unforeseen circumstances.
          </p>
          <p className="mt-4">
            We are committed to ensuring that every Indrani Paithani creation reaches you safely and beautifully.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
