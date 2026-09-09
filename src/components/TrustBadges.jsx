import React from 'react';
import { FiCheckCircle, FiShield, FiTruck, FiAward, FiLock } from 'react-icons/fi';

const TrustBadges = ({ layout = "grid", className = "" }) => {
  const badges = [
    {
      id: "silk-mark",
      icon: <FiAward className="w-6 h-6 text-gold" />,
      title: "100% Silk Mark Certified",
      description: "Guaranteed authentic pure silk woven with pure mulberry silk threads."
    },
    {
      id: "handloom",
      icon: <FiShield className="w-6 h-6 text-gold" />,
      title: "Handloom Guarantee",
      description: "Crafted by master weavers of Yeola using traditional handloom looms."
    },
    {
      id: "shipping",
      icon: <FiTruck className="w-6 h-6 text-gold" />,
      title: "Free Shipping Across India",
      description: "Fully insured high-priority delivery right to your doorstep."
    },
    {
      id: "secure",
      icon: <FiLock className="w-6 h-6 text-gold" />,
      title: "Secure Direct Checkout",
      description: "100% encrypted direct payment via Instant UPI, Cards, and Net Banking."
    }
  ];

  if (layout === "compact") {
    return (
      <div className={`grid grid-cols-2 gap-3 p-4 bg-cream/30 border border-gold/20 rounded-2xl ${className}`}>
        {badges.map((b) => (
          <div key={b.id} className="flex items-center space-x-2.5">
            <div className="p-2 bg-maroon/10 rounded-full text-maroon shrink-0">
              {b.icon}
            </div>
            <div>
              <h5 className="text-xs font-bold text-maroon leading-tight">{b.title}</h5>
              <p className="text-[10px] text-gray-500 font-light truncate">{b.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8 ${className}`}>
      {badges.map((badge) => (
        <div 
          key={badge.id} 
          className="bg-white p-6 rounded-2xl border border-gold/20 shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center text-center space-y-3"
        >
          <div className="w-12 h-12 rounded-full bg-maroon/10 flex items-center justify-center text-maroon border border-gold/30">
            {badge.icon}
          </div>
          <h4 className="font-heading font-bold text-sm text-maroon tracking-wide">
            {badge.title}
          </h4>
          <p className="text-xs text-gray-600 font-light leading-relaxed">
            {badge.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
