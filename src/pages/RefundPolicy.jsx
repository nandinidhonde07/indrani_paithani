import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-6 animate-fade-in">
      <div className="container mx-auto max-w-[900px]">
        <div className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-12">
          <Link to="/" className="hover:text-maroon transition">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-black">Refund Policy</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-black mb-12">REFUND POLICY</h1>
        
        <div className="space-y-8 text-black font-body text-base leading-loose font-normal">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">A legal disclaimer</h2>
            <p>
              At Indrani Paithani, every saree represents exceptional craftsmanship and attention to detail.
            </p>
            <p className="mt-4">
              Due to the exclusive and handcrafted nature of our products, we do not offer refunds or returns for change of mind, color preference, or personal choice.
            </p>
            <p className="mt-4">
              Returns or replacements will be considered only if:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>The product received is damaged during transit.</li>
              <li>An incorrect product has been delivered.</li>
            </ul>
            <p className="mt-4">
              Any concern must be reported within 24 hours of delivery with clear photographs and an unboxing video. Approved replacements will be processed after verification by our team.
            </p>
            <p className="mt-4">
              Customized, made-to-order, and specially commissioned Paithanis are non-refundable and non-returnable.
            </p>
            <p className="mt-4">
              Our commitment is to ensure every customer receives an authentic and premium Indrani Paithani experience.
            </p>
          </div>
          
          <div className="pt-8 border-t border-gray-200 mt-12">
            <p className="italic">With Gratitude,</p>
            <p className="font-bold mt-2">TEAM INDRANI PAITHANI</p>
            <p className="font-bold mt-4">NIHARIKA WADE</p>
            <p className="text-sm text-gray-500">Founder & CEO, INDRANI PAITHANI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
