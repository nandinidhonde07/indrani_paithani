import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-6 animate-fade-in">
      <div className="container mx-auto max-w-[900px]">
        <div className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-12">
          <Link to="/" className="hover:text-maroon transition">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-black">Privacy Policy</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-black mb-12">PRIVACY POLICY</h1>
        
        <div className="space-y-8 text-black font-body text-base leading-loose font-normal">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">A legal disclaimer</h2>
            <p>
              All products offered by Indrani Paithani are authentic handcrafted creations. Minor variations in colour, weave, zari, and design are natural characteristics of handloom artistry and are not considered defects.
            </p>
            <p className="mt-4">
              Product images are for representation purposes only and may vary slightly due to lighting and screen settings.
            </p>
            <p className="mt-4">
              All website content, images, logos, and designs are the exclusive property of Indrani Paithani and may not be reproduced without prior written permission.
            </p>
            <p className="mt-4">
              By using this website, you agree to our policies and terms. Indrani Paithani reserves all rights.
            </p>
          </div>
          
          <div className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-heading font-bold mb-6">Privacy Policy</h2>
            <p>
              At Indrani Paithani, your privacy is valued as much as the timeless craftsmanship of our Paithanis. We collect only the information necessary to process orders, provide customer support, and enhance your shopping experience.
            </p>
            <p className="mt-4">
              Your personal details, including name, contact information, and delivery address, are securely stored and never sold, rented, or shared with third parties for marketing purposes.
            </p>
            <p className="mt-4">
              All payment transactions are processed through secure and trusted payment gateways. We implement appropriate security measures to safeguard your information against unauthorized access.
            </p>
            <p className="mt-4">
              By using our website, you consent to the collection and use of information in accordance with this Privacy Policy.
            </p>
            <p className="mt-4">
              For any privacy-related concerns, please contact us directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
