import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaYoutube, FaPinterestP, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-gold/30">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="space-y-4">
          <Link to="/" className="text-2xl font-heading text-gold tracking-widest">
            INDRANI PAITHANI
          </Link>
          <p className="text-gray-400 text-sm font-light">
            Where Heritage Meets Luxury. Authentic handwoven Paithani sarees crafted for eternity.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition"><FaInstagram size={18} /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition"><FaFacebookF size={18} /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition"><FaYoutube size={18} /></a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition"><FaPinterestP size={18} /></a>
            <a href="https://wa.me/917507755836" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition"><FaWhatsapp size={18} /></a>
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
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="text-gold font-heading text-lg mb-4">Customer Support</h4>
          <ul className="space-y-2 text-sm text-gray-400 font-light">
            <li><Link to="/buyer-dashboard/orders" className="hover:text-gold transition">Track Order</Link></li>
            <li><a href="#" className="hover:text-gold transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-gold transition">Accessibility Statement</a></li>
            <li><a href="#" className="hover:text-gold transition">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-gold transition">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-gold transition">Refund Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-sm text-gray-400 font-light">
          <h4 className="text-gold font-heading text-lg mb-4">Contact Info</h4>
          <div className="flex items-center space-x-2">
            <FaPhoneAlt className="text-gold" />
            <span>+91 7507755836</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaEnvelope className="text-gold" />
            <a href="mailto:indranipaithani.yeola@gmail.com" className="hover:underline">indranipaithani.yeola@gmail.com</a>
          </div>
          <div className="flex items-start space-x-2">
            <FaMapMarkerAlt className="text-gold mt-1" />
            <span>Yeola, Nashik, Maharashtra, India – 423401</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-xs text-gray-500">
        © 2026 INDRANI PAITHANI. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
