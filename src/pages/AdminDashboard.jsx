import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productsData from '../data/products.json';
import HomepageCMS from './admin/HomepageCMS';
import MediaLibraryCMS from './admin/MediaLibraryCMS';
import FounderCMS from './admin/FounderCMS';
import PolicyCMS from './admin/PolicyCMS';
import ProductCMS from './admin/ProductCMS';
import ContactCMS from './admin/ContactCMS';

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

  const handleLogout = () => {
    localStorage.removeItem('role');
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

        {activeTab === 'orders' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Orders & Dispatch</h2>
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/10 overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-2">Order ID</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'ORD1024', date: '2026-07-28', customer: 'Priya Deshmukh', status: 'Delivered', total: 28000 },
                    { id: 'ORD1025', date: '2026-07-29', customer: 'Aditi Kulkarni', status: 'In Transit', total: 42500 },
                    { id: 'ORD1026', date: '2026-07-30', customer: 'Sneha Patil', status: 'Processing', total: 115000 }
                  ].map(ord => (
                    <tr key={ord.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 font-semibold">{ord.id}</td>
                      <td className="py-3">{ord.date}</td>
                      <td className="py-3">{ord.customer}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          ord.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          ord.status === 'In Transit' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 font-medium">₹{ord.total.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Customers Database</h2>
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/10 overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Orders Count</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Priya Deshmukh', email: 'priya@gmail.com', count: 2 },
                    { name: 'Aditi Kulkarni', email: 'aditi@gmail.com', count: 1 },
                    { name: 'Sneha Patil', email: 'sneha@gmail.com', count: 3 }
                  ].map((cust, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 font-medium">{cust.name}</td>
                      <td className="py-3">{cust.email}</td>
                      <td className="py-3">{cust.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      </main>
    </div>
  );
};

export default AdminDashboard;
