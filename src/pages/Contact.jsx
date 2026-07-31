import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Your message has been received. We will connect with you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-cream min-h-screen py-16 px-6">
      <div className="container mx-auto max-w-5xl space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-heading text-maroon">Contact Us</h1>
          <p className="text-sm md:text-lg font-light text-gray-600">INDRANI PAITHANI — Where Heritage Meets Luxury</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-gold/10">
          {/* Contact details & buttons */}
          <div className="space-y-8">
            <h2 className="text-2xl font-heading text-maroon">Get In Touch</h2>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-center space-x-4">
                <div className="bg-cream p-3 rounded-full text-maroon"><FaPhoneAlt /></div>
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <p>+91 7507755836</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-cream p-3 rounded-full text-maroon"><FaEnvelope /></div>
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p>indranipaithani.yeola@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-cream p-3 rounded-full text-maroon mt-1"><FaMapMarkerAlt /></div>
                <div>
                  <h4 className="font-semibold">Address</h4>
                  <p>Yeola, Nashik, Maharashtra, India – 423401</p>
                </div>
              </div>
            </div>

            {/* Premium CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/917507755836"
                target="_blank"
                rel="noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center space-x-2 py-3 px-6 rounded-full transition shadow-md"
              >
                <FaWhatsapp size={18} />
                <span>WhatsApp Us</span>
              </a>
              <a
                href="tel:7507755836"
                className="bg-maroon hover:bg-gold text-white font-semibold flex items-center justify-center space-x-2 py-3 px-6 rounded-full transition shadow-md"
              >
                <FaPhoneAlt size={16} />
                <span>Call Us Direct</span>
              </a>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-heading text-maroon">Send Message</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Message</label>
              <textarea
                required
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-gold hover:bg-maroon hover:text-white text-maroon font-semibold py-3 rounded-full transition shadow-md"
            >
              Submit Inquiry
            </button>
          </form>
        </div>

        {/* Map */}
        <div className="rounded-3xl overflow-hidden shadow-premium border border-gold/10 aspect-video md:aspect-[21/9]">
          <iframe
            title="Indrani Paithani Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14959.043694084534!2d74.4764835!3d20.0395371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddc4e20798be19%3A0xe21f4ea8a04cd154!2sYeola%2C%20Maharashtra%20423401!5e0!3m2!1sen!2sin!4v1785475000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
