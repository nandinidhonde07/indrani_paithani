import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaYoutube, FaPinterestP, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import useAppStore from '../store/useAppStore.js';
import ContactService from '../services/ContactService.js';

const Footer = () => {
  const { cmsContent, isCMSLoading } = useAppStore();
  const footerData = cmsContent?.footer;
  const generalData = cmsContent?.general;
  const contactData = cmsContent?.contact;

  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      await ContactService.submitInquiry({
        name: 'Newsletter Subscriber',
        email: email,
        message: 'I would like to subscribe to the newsletter.'
      });
      setSubscribed(true);
      setEmail('');
    }
  };

  if (isCMSLoading || !footerData) return <footer className="bg-maroon text-cream py-12"><div className="container mx-auto text-center">Loading...</div></footer>;
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-gold/30">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="space-y-4">
          <img src="/assets/official_logo.jpg" alt="Indrani Paithani Logo" className="h-16 w-auto mb-4 object-contain" />
          <h3 className="font-heading tracking-[0.2em] text-2xl mb-4 text-gold">{generalData?.storeName?.toUpperCase() || 'INDRANI PAITHANI'}</h3>
          <p className="text-sm font-light leading-relaxed mb-6 opacity-90">
            {footerData.description}
          </p>
          <h4 className="text-gold font-heading text-sm mb-3 uppercase tracking-widest">Stay Connected With Us</h4>
          <div className="flex space-x-4">
            <a href={footerData.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-maroon transition shadow-sm"><FaFacebookF /></a>
            <a href="https://www.instagram.com/indranipaitani.yeola?utm_source=q" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-maroon transition shadow-sm"><FaInstagram /></a>
            <a href={footerData.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-maroon transition shadow-sm"><FaYoutube /></a>
          </div>
          
          {/* Newsletter */}
          <div className="pt-4">
            <h4 className="text-gold font-heading text-sm mb-3 uppercase tracking-widest">Newsletter</h4>
            {subscribed ? (
              <p className="text-green-400 text-xs font-semibold">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                  className="bg-white/10 text-white placeholder-gray-400 px-4 py-2 text-xs rounded border border-gray-700 focus:outline-none focus:border-gold"
                />
                <button type="submit" className="bg-gold hover:bg-maroon hover:text-white text-maroon font-semibold py-2 rounded text-xs transition uppercase tracking-wider">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-gold font-heading text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400 font-light">
            <li><Link to="/" className="hover:text-gold transition">Home</Link></li>
            <li><Link to="/shop" className="hover:text-gold transition">Shop</Link></li>
            <li><Link to="/shop?category=Luxury%20Collection" className="hover:text-gold transition">Collections</Link></li>
            <li><Link to="/about" className="hover:text-gold transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition">Contact Us</Link></li>
            <li><Link to="/buyer-dashboard/orders" className="hover:text-gold transition">Track Order</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="text-gold font-heading text-lg mb-4">Policies</h4>
          <ul className="space-y-2 text-sm text-gray-400 font-light">
            <li><Link to="/privacy-policy" className="hover:text-gold transition">Privacy Policy</Link></li>
            <li><Link to="/accessibility" className="hover:text-gold transition">Accessibility Statement</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-gold transition">Shipping Policy</Link></li>
            <li><Link to="/terms-conditions" className="hover:text-gold transition">Terms & Conditions</Link></li>
            <li><Link to="/refund-policy" className="hover:text-gold transition">Refund Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-sm text-gray-400 font-light">
          <h4 className="font-heading text-lg mb-4 text-gold">Contact Boutique</h4>
          <ul className="space-y-4 text-sm font-light opacity-90">
            <li className="flex items-start space-x-3">
              <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-gold" />
              <span>{contactData?.address || 'Yeola, Maharashtra, India'}</span>
            </li>
            <li className="flex items-center space-x-3">
              <FaPhoneAlt className="text-gold" />
              <span>{contactData?.phone || '+91 7507755836'}</span>
            </li>
            <li className="flex items-center space-x-3">
              <FaEnvelope className="text-gold" />
              <span>{contactData?.email || 'support@indranipaithani.com'}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} {generalData?.storeName}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
