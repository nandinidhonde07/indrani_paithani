import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService.js';
import productsData from '../data/products.json';
import HomepageCMS from './admin/HomepageCMS';
import MediaLibraryCMS from './admin/MediaLibraryCMS';
import FounderCMS from './admin/FounderCMS';
import PolicyCMS from './admin/PolicyCMS';
import ProductCMS from './admin/ProductCMS';
import ContactCMS from './admin/ContactCMS';
import OrderManagementCMS from './admin/OrderManagementCMS';
import InquiriesCMS from './admin/InquiriesCMS';
import ReviewModerationCMS from './admin/ReviewModerationCMS';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state for adding/editing products with multiple images support
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Pure Silk Paithani',
    price: '',
    originalPrice: '',
    image: '',
    images: ['', '', '', '', '', ''], // Supports 6 images
    description: '',
    fabric: 'Pure Silk',
    zari: 'Gold',
    length: '6.5m',
    color: '',
    motif: '',
    stock: 5,
    rating: 4.8,
    reviewsCount: 10
  });

  useEffect(() => {
    const localProds = localStorage.getItem('products');
    if (localProds) {
      setProducts(JSON.parse(localProds));
    } else {
      localStorage.setItem('products', JSON.stringify(productsData));
      setProducts(productsData);
    }
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/owner-login');
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    let updatedProducts = [...products];

    // Filter out blank image URLs in arrays
    const validImages = formData.images.filter(img => img.trim() !== '');

    const productPayload = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stock: parseInt(formData.stock),
      image: formData.image || validImages[0] || 'https://picsum.photos/seed/new/500/700',
      images: validImages.length > 0 ? validImages : [formData.image]
    };

    if (editingProduct) {
      // Update
      updatedProducts = updatedProducts.map(p => p.id === formData.id ? productPayload : p);
      setEditingProduct(null);
    } else {
      // Create new
      productPayload.id = String(Date.now());
      updatedProducts.push(productPayload);
    }

    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    resetForm();
  };

  const handleEditInit = (product) => {
    setEditingProduct(product);
    // Fill up empty spots in images array if less than 6
    const filledImages = [...(product.images || [])];
    while (filledImages.length < 6) filledImages.push('');
    
    setFormData({
      ...product,
      images: filledImages
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(updated));
      setProducts(updated);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      category: 'Pure Silk Paithani',
      price: '',
      originalPrice: '',
      image: '',
      images: ['', '', '', '', '', ''],
      description: '',
      fabric: 'Pure Silk',
      zari: 'Gold',
      length: '6.5m',
      color: '',
      motif: '',
      stock: 5,
      rating: 4.8,
      reviewsCount: 10
    });
    setEditingProduct(null);
  };

  const categories = [
    "Pure Silk Paithani", "Bridal Paithani", "Wedding Collection",
    "Traditional Collection", "Heritage Collection", "Luxury Collection",
    "Paithani Dupattas", "Dress Materials", "Blouse Pieces",
    "Paithani Bags", "Potli Bags", "Wallets", "Shawls",
    "Stoles", "Gift Boxes"
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-maroon text-white p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="border-b border-gold/30 pb-4">
            <h2 className="text-xl font-heading text-gold tracking-widest text-center">INDRANI OWNER</h2>
            <p className="text-xs text-cream/70 font-light mt-1 text-center">Luxury Heritage Suite</p>
          </div>

          <nav className="space-y-1 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'products', label: 'Products' },
              { id: 'categories', label: 'Categories' },
              { id: 'orders', label: 'Orders' },
              { id: 'customers', label: 'Customers' },
              { id: 'homepage_cms', label: 'Homepage CMS' },
              { id: 'founder_cms', label: 'Founder CMS' },
              { id: 'testimonials', label: 'Testimonials' },
              { id: 'instagram', label: 'Instagram Gallery' },
              { id: 'contact', label: 'Contact Info' },
              { id: 'inquiries', label: 'Inquiries' },
              { id: 'reviews', label: 'Review Moderation' },
              { id: 'policy', label: 'Policy Pages' },
              { id: 'media', label: 'Media Library' },
              { id: 'banners', label: 'Banner Management' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'settings', label: 'Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left py-2 px-3 rounded-lg font-light text-[13px] transition ${
                  activeTab === tab.id ? 'bg-gold text-maroon font-semibold shadow-sm' : 'hover:bg-gold/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <button onClick={handleLogout} className="mt-6 bg-black/30 hover:bg-black/50 text-white text-sm py-3 rounded-xl transition font-semibold tracking-wider">
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Console Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10">
                <span className="text-xs text-gray-500 font-semibold uppercase">Total Revenue</span>
                <p className="text-2xl font-bold font-heading text-maroon mt-2">₹18,45,000</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10">
                <span className="text-xs text-gray-500 font-semibold uppercase">Total Orders</span>
                <p className="text-2xl font-bold font-heading text-maroon mt-2">32</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10">
                <span className="text-xs text-gray-500 font-semibold uppercase">Products In Stock</span>
                <p className="text-2xl font-bold font-heading text-maroon mt-2">{products.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10">
                <span className="text-xs text-gray-500 font-semibold uppercase">Active Customers</span>
                <p className="text-2xl font-bold font-heading text-maroon mt-2">18</p>
              </div>
            </div>

            {/* Inventory Levels */}
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/10">
              <h3 className="text-lg font-heading text-maroon mb-4">Stock Levels & Catalog Inventory</h3>
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-2">Item Name</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Stock status</th>
                    <th className="py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map(p => (
                    <tr key={p.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 font-medium text-maroon">{p.name}</td>
                      <td className="py-2">{p.category}</td>
                      <td className="py-2 font-semibold">
                        {p.stock <= 2 ? (
                          <span className="text-red-500">Low Stock ({p.stock})</span>
                        ) : (
                          <span className="text-green-600">Healthy ({p.stock})</span>
                        )}
                      </td>
                      <td className="py-2">₹{p.price.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && <ProductCMS />}

        {activeTab === 'orders' && <OrderManagementCMS />}

        {activeTab === 'customers' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Customers Database</h2>
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/10 overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-2">Name</th>
                    <th className="py-2">Contact Details</th>
                    <th className="py-2">Gender & DOB</th>
                    <th className="py-2">Default Address</th>
                    <th className="py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const registeredUsers = JSON.parse(localStorage.getItem('buyer_users') || '[]');
                    const demoFallbackUsers = [
                      { name: 'Priya Deshmukh', email: 'priya@gmail.com', phone: '+91 9876543210', altPhone: '+91 9123456789', gender: 'Female', dob: '1995-08-15', address: 'Flat 402, Royal Palms Apartment, MG Road, Pune, Maharashtra - 411001', mobileVerified: true },
                      { name: 'Aditi Kulkarni', email: 'aditi@gmail.com', phone: '+91 9822012345', altPhone: 'Not provided', gender: 'Female', dob: '1992-04-20', address: 'Plot 12, Baner Highway, Pune, Maharashtra - 411045', mobileVerified: true },
                      { name: 'Sneha Patil', email: 'sneha@gmail.com', phone: '+91 9765432109', altPhone: '+91 9890123456', gender: 'Female', dob: '1998-11-05', address: 'Yeola Handloom Hub, Nashik, Maharashtra - 422401', mobileVerified: true }
                    ];

                    const displayList = registeredUsers.length > 0 ? registeredUsers : demoFallbackUsers;

                    return displayList.map((cust, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-cream/10 transition">
                        <td className="py-3 font-semibold text-maroon">
                          <div>{cust.name || `${cust.firstName || ''} ${cust.lastName || ''}`.trim() || 'Valued Patron'}</div>
                          <div className="text-[11px] text-gray-400 font-normal">{cust.email}</div>
                        </td>
                        <td className="py-3 text-xs">
                          <div><span className="font-semibold text-gray-700">Primary:</span> {cust.phone || 'N/A'}</div>
                          {cust.altPhone && <div className="text-[11px] text-gray-500"><span className="font-semibold">Alt:</span> {cust.altPhone}</div>}
                        </td>
                        <td className="py-3 text-xs text-gray-600">
                          <div>{cust.gender || 'Not specified'}</div>
                          {cust.dob && <div className="text-[11px] text-gray-400">DOB: {cust.dob}</div>}
                        </td>
                        <td className="py-3 text-xs text-gray-600 max-w-xs truncate">
                          {cust.address || (cust.addresses && cust.addresses[0] ? `${cust.addresses[0].street}, ${cust.addresses[0].city}` : 'No address saved')}
                        </td>
                        <td className="py-3 text-center">
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            ✓ Verified Patron
                          </span>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Categories & Collections Management</h2>
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/10 space-y-4">
              <h3 className="text-lg font-heading text-maroon font-bold border-b pb-2">Active Store Categories ({categories.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gold/20 bg-cream/20 flex justify-between items-center text-xs font-bold text-maroon">
                    <span>{cat}</span>
                    <span className="text-[10px] bg-maroon text-gold px-2 py-0.5 rounded-full uppercase">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Patron Testimonials & Stories</h2>
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/10 space-y-4">
              <p className="text-sm text-gray-600">Curate luxury reviews and royal patron stories displayed on the homepage.</p>
              <div className="space-y-3">
                {[
                  { author: "Ananya Deshmukh", location: "Mumbai", quote: "The Yeola Pure Silk Paithani I ordered for my wedding was breathtaking. Authentic zari and exquisite peacock pallu!" },
                  { author: "Sunita Joshi", location: "Pune", quote: "Prompt insured delivery and magnificent craftsmanship. Indrani Paithani is our family's trusted heritage store." }
                ].map((t, i) => (
                  <div key={i} className="p-4 bg-cream/20 rounded-xl border border-gold/15 space-y-1 text-xs">
                    <p className="font-bold text-maroon">"{t.quote}"</p>
                    <p className="text-gray-500 font-semibold">— {t.author}, {t.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'instagram' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Instagram Social Gallery</h2>
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/10 space-y-4 text-xs">
              <p className="text-gray-600">Manage live Instagram feed handles and tagged royal patron posts.</p>
              <div className="p-4 bg-cream/30 rounded-xl border border-gold/20 font-mono text-maroon">
                Handle: @indranipaithani_official | Tag: #IndraniPaithaniBride
              </div>
            </div>
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Hero Banners & Announcement Bars</h2>
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/10 space-y-4 text-xs">
              <div className="p-4 bg-gold/10 rounded-xl border border-gold/30 text-maroon space-y-1">
                <span className="font-bold block uppercase text-[10px]">Active Top Announcement Bar:</span>
                <span className="font-semibold text-sm">✨ 100% Silk Mark Certified Handloom Yeola Paithani Sarees | Free Insured Shipping Across India</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Store Settings & Owner Credentials</h2>
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/10 space-y-4 text-xs max-w-xl">
              <div>
                <label className="block font-bold text-gray-600 uppercase mb-1">Owner Email</label>
                <input type="text" readOnly value="nandini.dhonde1@gmail.com" className="w-full px-4 py-2 border rounded-xl bg-gray-50 font-mono" />
              </div>
              <div>
                <label className="block font-bold text-gray-600 uppercase mb-1">Store Helpline / WhatsApp</label>
                <input type="text" readOnly value="+91 7507755836" className="w-full px-4 py-2 border rounded-xl bg-gray-50 font-mono" />
              </div>
              <div>
                <label className="block font-bold text-gray-600 uppercase mb-1">Default GST Percentage</label>
                <input type="text" readOnly value="5% (Saree & Textiles)" className="w-full px-4 py-2 border rounded-xl bg-gray-50 font-semibold" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Revenue Trends</h2>
            <div className="bg-white p-8 rounded-2xl shadow-premium border border-gold/10 text-center text-gray-500">
              <div className="w-full h-64 bg-cream/30 rounded-xl mt-6 flex items-center justify-center border border-gold/10">
                <span>[Revenue Charts Interactive View]</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && <MediaLibraryCMS />}
        {activeTab === 'homepage_cms' && <HomepageCMS />}
        {activeTab === 'founder_cms' && <FounderCMS />}
        {activeTab === 'policy' && <PolicyCMS />}
        {activeTab === 'contact' && <ContactCMS />}
        {activeTab === 'inquiries' && <InquiriesCMS />}
        {activeTab === 'reviews' && <ReviewModerationCMS />}

      </main>
    </div>
  );
};

export default AdminDashboard;
