import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productsData from '../data/products.json';

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

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard Overview' },
              { id: 'products', label: 'Products & Multi-Upload' },
              { id: 'orders', label: 'Orders & Shipping' },
              { id: 'customers', label: 'Customers DB' },
              { id: 'analytics', label: 'Revenue Analytics' },
              { id: 'coupons', label: 'Active Coupons' },
              { id: 'sections', label: 'Homepage Sections' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left py-2 px-4 rounded-lg font-light text-sm transition ${
                  activeTab === tab.id ? 'bg-gold text-maroon font-semibold' : 'hover:bg-gold/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <button onClick={handleLogout} className="mt-8 bg-black/30 hover:bg-black/50 text-white text-sm py-2 rounded-lg transition">
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

        {activeTab === 'products' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Product Upload (Multi-Image Support)</h2>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <h3 className="col-span-full text-lg font-heading text-maroon font-semibold border-b pb-2">
                {editingProduct ? 'Edit Saree Design' : 'Upload New Design'}
              </h3>
              <div>
                <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-white font-medium"
                >
                  {categories.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">Sale Price (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">Original Price (₹)</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">Stock Level</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">Saree Color</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  placeholder="e.g. Purple, Red-Orange"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">Motif Border</label>
                <input
                  type="text"
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  placeholder="e.g. Peacock, Swan"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">Zari details</label>
                <input
                  type="text"
                  value={formData.zari}
                  onChange={(e) => setFormData({ ...formData, zari: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">Saree Length</label>
                <input
                  type="text"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              {/* Multi-Image upload inputs */}
              <div className="col-span-full border-t pt-4">
                <h4 className="text-xs text-gray-500 font-semibold uppercase mb-3">Multi-Image Views (Up to 6 perspectives)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['Flat Saree', 'Woman Wearing Saree', 'Zoom View', 'Back Side', 'Pallu Close-up', 'Border Close-up'].map((label, idx) => (
                    <div key={idx}>
                      <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">{label} URL</label>
                      <input
                        type="text"
                        value={formData.images[idx] || ''}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[idx] = e.target.value;
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-none"
                        placeholder="https://example.com/image.png"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-full">
                <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                ></textarea>
              </div>

              <div className="col-span-full flex gap-4">
                <button type="submit" className="bg-maroon hover:bg-gold text-white font-semibold py-2 px-6 rounded-full transition">
                  {editingProduct ? 'Update Saree' : 'Publish Saree Design'}
                </button>
                <button type="button" onClick={resetForm} className="border border-gray-400 py-2 px-6 rounded-full transition">
                  Reset Form
                </button>
              </div>
            </form>

            {/* List */}
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/10 overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-semibold">
                    <th className="py-2">Name</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Price</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-cream/10">
                      <td className="py-3 font-medium text-maroon">{p.name}</td>
                      <td className="py-3">{p.category}</td>
                      <td className="py-3">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="py-3 text-right space-x-2">
                        <button onClick={() => handleEditInit(p)} className="text-gold hover:underline text-xs">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

        {activeTab === 'coupons' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Coupons</h2>
            <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { code: 'FESTIVE10', desc: '10% discount on entire cart', active: true },
                { code: 'ROYAL20', desc: '20% off on Luxury Collection items', active: true },
                { code: 'WELCOME5000', desc: '₹5,000 flat discount for first purchase', active: false }
              ].map((c, idx) => (
                <div key={idx} className={`p-4 border rounded-xl flex flex-col justify-between ${c.active ? 'border-gold bg-cream/10' : 'border-gray-200 bg-gray-50'}`}>
                  <div>
                    <span className="font-heading font-semibold text-lg text-maroon block">{c.code}</span>
                    <p className="text-xs text-gray-500 mt-1">{c.desc}</p>
                  </div>
                  <span className={`text-xs font-semibold mt-4 block ${c.active ? 'text-green-600' : 'text-gray-400'}`}>
                    {c.active ? '● Active' : '○ Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Homepage Sections Management</h2>
            <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10 space-y-4">
              {[
                { name: 'Hero Background Video Banner', active: true },
                { name: 'Featured Categories Circle List', active: true },
                { name: 'Paithani Collection Saree Cards Grid', active: true },
                { name: 'Animated Heritage Statistics Section', active: true },
                { name: 'Flipkart Variant Color swatches Selector', active: true },
                { name: 'Instagram Masonry Grid Lookbook', active: true }
              ].map((sec, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="font-medium text-sm text-maroon">{sec.name}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Active on Live Page
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
