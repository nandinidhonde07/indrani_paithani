import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService.js';
import OrderService from '../services/OrderService.js';
import HomepageCMS from './admin/HomepageCMS';
import FounderCMS from './admin/FounderCMS';
import PolicyCMS from './admin/PolicyCMS';
import ProductCMS from './admin/ProductCMS';
import ContactCMS from './admin/ContactCMS';
import OrderManagementCMS from './admin/OrderManagementCMS';

const DEFAULT_CATEGORIES = [
  "Pure Silk Paithani", "Bridal Paithani", "Wedding Collection",
  "Traditional Collection", "Heritage Collection", "Luxury Collection",
  "Paithani Dupattas", "Dress Materials", "Blouse Pieces",
  "Paithani Bags", "Potli Bags", "Wallets", "Shawls",
  "Stoles", "Gift Boxes"
];

const DEFAULT_TESTIMONIALS = [
  { id: '1', author: "Ananya Deshmukh", location: "Mumbai", rating: 5, quote: "The Yeola Pure Silk Paithani I ordered for my wedding was breathtaking. Authentic zari and exquisite peacock pallu!", saree: "Pure Silk Peacock Paithani" },
  { id: '2', author: "Sunita Joshi", location: "Pune", rating: 5, quote: "Prompt insured delivery and magnificent craftsmanship. Indrani Paithani is our family's trusted heritage store.", saree: "Bridal Maharani Kath Saree" },
  { id: '3', author: "Radhika Patil", location: "Nashik", rating: 5, quote: "The silk quality and rich zari borders exceeded my expectations. Truly heirloom quality!", saree: "Heritage Lotus Swan Paithani" }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Category State
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatIndex, setEditingCatIndex] = useState(null);
  const [editingCatValue, setEditingCatValue] = useState('');

  // Testimonials State (Add / Edit / Delete)
  const [testimonials, setTestimonials] = useState([]);
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [newTestimonial, setNewTestimonial] = useState({ author: '', location: '', rating: 5, quote: '', saree: '' });

  // Selected Customer Modal State
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Load Data
  const loadDashboardData = async () => {
    // Load Products
    const isCleared = localStorage.getItem('indrani_catalog_cleared_v1');
    if (!isCleared) {
      localStorage.setItem('products', JSON.stringify([]));
      localStorage.setItem('indrani_products', JSON.stringify([]));
      localStorage.setItem('indrani_catalog_cleared_v1', 'true');
      setProducts([]);
    } else {
      const localProds = localStorage.getItem('products');
      setProducts(localProds ? JSON.parse(localProds) : []);
    }

    // Load Orders
    const allOrders = await OrderService.getAllOrders();
    setOrders(allOrders);

    // Load Categories
    const localCats = localStorage.getItem('indrani_categories');
    if (localCats) setCategories(JSON.parse(localCats));
    else {
      localStorage.setItem('indrani_categories', JSON.stringify(DEFAULT_CATEGORIES));
      setCategories(DEFAULT_CATEGORIES);
    }

    // Load Testimonials
    const localTests = localStorage.getItem('indrani_testimonials');
    if (localTests) setTestimonials(JSON.parse(localTests));
    else {
      localStorage.setItem('indrani_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS));
      setTestimonials(DEFAULT_TESTIMONIALS);
    }
  };

  useEffect(() => {
    loadDashboardData();
    window.addEventListener('indrani_order_created', loadDashboardData);
    window.addEventListener('storage', loadDashboardData);
    return () => {
      window.removeEventListener('indrani_order_created', loadDashboardData);
      window.removeEventListener('storage', loadDashboardData);
    };
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/owner-login');
  };

  // Restock Handler
  const handleRestockProduct = (productId) => {
    const updated = products.map(p => p.id === productId ? { ...p, stock: p.stock + 5 } : p);
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    localStorage.setItem('indrani_products', JSON.stringify(updated));
  };

  // Category Handlers
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    if (categories.includes(newCatName.trim())) {
      alert('Category already exists!');
      return;
    }
    const updated = [...categories, newCatName.trim()];
    setCategories(updated);
    localStorage.setItem('indrani_categories', JSON.stringify(updated));
    setNewCatName('');
  };

  const handleSaveEditCategory = (index) => {
    if (!editingCatValue.trim()) return;
    const updated = [...categories];
    updated[index] = editingCatValue.trim();
    setCategories(updated);
    localStorage.setItem('indrani_categories', JSON.stringify(updated));
    setEditingCatIndex(null);
    setEditingCatValue('');
  };

  const handleDeleteCategory = (index) => {
    if (confirm('Delete this category?')) {
      const updated = categories.filter((_, i) => i !== index);
      setCategories(updated);
      localStorage.setItem('indrani_categories', JSON.stringify(updated));
    }
  };

  // Testimonials Handlers (ADD / EDIT / DELETE)
  const handleSaveTestimonialSubmit = (e) => {
    e.preventDefault();
    let updated;
    if (editingTestimonial) {
      updated = testimonials.map(t => t.id === editingTestimonial.id ? { ...t, ...newTestimonial } : t);
    } else {
      const item = { id: String(Date.now()), ...newTestimonial };
      updated = [item, ...testimonials];
    }
    setTestimonials(updated);
    localStorage.setItem('indrani_testimonials', JSON.stringify(updated));
    setShowAddTestimonial(false);
    setEditingTestimonial(null);
    setNewTestimonial({ author: '', location: '', rating: 5, quote: '', saree: '' });
  };

  const handleEditTestimonial = (t) => {
    setEditingTestimonial(t);
    setNewTestimonial({
      author: t.author || '',
      location: t.location || '',
      rating: t.rating || 5,
      quote: t.quote || '',
      saree: t.saree || ''
    });
    setShowAddTestimonial(true);
  };

  const handleDeleteTestimonial = (id) => {
    if (confirm('Delete this testimonial permanently?')) {
      const updated = testimonials.filter(t => t.id !== id);
      setTestimonials(updated);
      localStorage.setItem('indrani_testimonials', JSON.stringify(updated));
    }
  };

  // Calculate Overview Stats (REAL DATA ONLY - NO DEMO DATA)
  const realOrders = orders;
  const totalRevenue = realOrders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);
  const totalOrdersCount = realOrders.length;
  const productsInStockCount = products.reduce((acc, p) => acc + (parseInt(p.stock) || 0), 0);
  const registeredUsers = JSON.parse(localStorage.getItem('buyer_users') || '[]');
  const activeCustomersCount = registeredUsers.length;
  const lowStockProducts = products.filter(p => p.stock <= 3);

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row text-black items-start">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-maroon text-white p-6 flex flex-col justify-between shrink-0 md:h-screen md:sticky md:top-0 shadow-xl overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          <div className="border-b border-gold/30 pb-4">
            <h2 className="text-xl font-heading text-gold tracking-widest text-center font-bold">INDRANI OWNER</h2>
            <p className="text-xs text-cream/70 font-light mt-1 text-center">Luxury Heritage Suite</p>
          </div>

          <nav className="space-y-1.5 pr-1">
            {[
              { id: 'dashboard', label: '📊 Dashboard Overview' },
              { id: 'products', label: '👗 Products Catalog' },
              { id: 'categories', label: '🏷️ Categories & Collections' },
              { id: 'orders', label: '📦 Orders Management' },
              { id: 'customers', label: '👥 Customers Database' },
              { id: 'homepage_cms', label: '🏠 Homepage CMS' },
              { id: 'founder_cms', label: '👑 Founder CMS' },
              { id: 'testimonials', label: '⭐ Patron Testimonials' },
              { id: 'contact', label: '📞 Contact Info CMS' },
              { id: 'policy', label: '📜 Policy Pages' },
              { id: 'analytics', label: '📈 Revenue Analytics' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left py-2.5 px-3.5 rounded-xl font-medium text-[13px] transition flex items-center justify-between ${
                  activeTab === tab.id ? 'bg-gold text-maroon font-bold shadow-md' : 'hover:bg-gold/15 text-cream/90'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button onClick={handleLogout} className="mt-8 bg-black/40 hover:bg-black/70 text-white text-xs py-3 rounded-xl transition font-bold uppercase tracking-wider">
          Logout Console
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 min-w-0 overflow-y-auto bg-cream min-h-screen">
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-gold/20 pb-4">
              <div>
                <h2 className="text-3xl font-heading text-maroon font-bold">Console Overview</h2>
                <p className="text-xs text-gray-500 font-light mt-1">Real-time metrics, live order statuses, and low stock inventory alerts.</p>
              </div>
              <button onClick={() => setActiveTab('products')} className="bg-maroon hover:bg-gold text-white font-bold py-2.5 px-5 rounded-full text-xs shadow-md transition">
                + Add New Product
              </button>
            </div>

            {/* Quick Metrics Grid (PURE REAL WEBSITE DATA ONLY) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/15 space-y-1">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Revenue</span>
                <p className="text-3xl font-bold font-heading text-maroon">₹{totalRevenue.toLocaleString('en-IN')}</p>
                <span className="text-[10px] text-green-600 font-bold block">✓ {totalOrdersCount} Real Placed Orders</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/15 space-y-1">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Orders</span>
                <p className="text-3xl font-bold font-heading text-maroon">{totalOrdersCount}</p>
                <span className="text-[10px] text-blue-600 font-bold block">{realOrders.filter(o => o.status === 'Order Confirmed' || o.status === 'Preparing Your Paithani').length} Pending Dispatch</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/15 space-y-1">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Products In Stock</span>
                <p className="text-3xl font-bold font-heading text-maroon">{productsInStockCount}</p>
                <span className="text-[10px] text-purple-600 font-bold block">{products.length} Products in Catalog</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/15 space-y-1">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Customers</span>
                <p className="text-3xl font-bold font-heading text-maroon">{activeCustomersCount}</p>
                <span className="text-[10px] text-green-600 font-bold block">{activeCustomersCount > 0 ? '✓ Registered Patrons' : 'No Registrations Yet'}</span>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button onClick={() => setActiveTab('products')} className="p-4 bg-white hover:bg-gold/10 rounded-2xl border border-gold/20 text-center transition space-y-1 shadow-sm">
                <span className="text-2xl block">👗</span>
                <span className="text-xs font-bold text-maroon block">Manage Catalog</span>
              </button>
              <button onClick={() => setActiveTab('orders')} className="p-4 bg-white hover:bg-gold/10 rounded-2xl border border-gold/20 text-center transition space-y-1 shadow-sm">
                <span className="text-2xl block">📦</span>
                <span className="text-xs font-bold text-maroon block">Process Orders</span>
              </button>
              <button onClick={() => setActiveTab('customers')} className="p-4 bg-white hover:bg-gold/10 rounded-2xl border border-gold/20 text-center transition space-y-1 shadow-sm">
                <span className="text-2xl block">👥</span>
                <span className="text-xs font-bold text-maroon block">Customer CRM</span>
              </button>
              <button onClick={() => setActiveTab('testimonials')} className="p-4 bg-white hover:bg-gold/10 rounded-2xl border border-gold/20 text-center transition space-y-1 shadow-sm">
                <span className="text-2xl block">⭐</span>
                <span className="text-xs font-bold text-maroon block">Patron Testimonials</span>
              </button>
            </div>

            {/* Low Stock Inventory Alert Table */}
            {lowStockProducts.length > 0 && (
              <div className="bg-red-50/60 rounded-2xl p-6 border border-red-200 space-y-4">
                <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider flex items-center space-x-2">
                  <span>⚠️ Low Stock Items Needing Restock</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-red-200 text-red-700">
                        <th className="py-2">Item Name</th>
                        <th className="py-2">Category</th>
                        <th className="py-2">Current Stock</th>
                        <th className="py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.map(p => (
                        <tr key={p.id} className="border-b border-red-100 last:border-0">
                          <td className="py-2.5 font-bold text-black">{p.name}</td>
                          <td className="py-2.5 text-gray-600">{p.category}</td>
                          <td className="py-2.5 font-bold text-red-600">{p.stock} left</td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => handleRestockProduct(p.id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] transition shadow-xs"
                            >
                              +5 Quick Restock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/15 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-heading text-maroon font-bold">Recent Customer Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs text-maroon font-bold hover:underline">
                  View All Orders ({orders.length}) →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="py-2">Order ID</th>
                      <th className="py-2">Date</th>
                      <th className="py-2">Customer Name</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(ord => (
                      <tr key={ord.orderId} className="border-b border-gray-100 last:border-0 hover:bg-cream/10 transition">
                        <td className="py-3 font-bold text-maroon font-mono">{ord.orderId}</td>
                        <td className="py-3 text-gray-500">{new Date(ord.orderDate).toLocaleDateString()}</td>
                        <td className="py-3 font-semibold">{ord.buyerName}</td>
                        <td className="py-3">
                          <span className="bg-gold/20 text-maroon text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 font-bold">₹{ord.grandTotal.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CMS */}
        {activeTab === 'products' && <ProductCMS />}

        {/* TAB 3: CATEGORIES & COLLECTIONS CMS */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div className="border-b border-gold/20 pb-4">
              <h2 className="text-3xl font-heading text-maroon font-bold">Categories & Collections Management</h2>
              <p className="text-xs text-gray-500 font-light mt-1">Add, edit, or delete store categories. Changes dynamically sync across the website.</p>
            </div>

            {/* Add New Category Form */}
            <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-2xl shadow-premium border border-gold/15 flex gap-3 items-end max-w-xl">
              <div className="flex-grow">
                <label className="block text-xs font-bold text-maroon uppercase tracking-wider mb-1">New Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharani Paithani / Silk Dupattas"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-xs"
                />
              </div>
              <button type="submit" className="bg-maroon hover:bg-gold text-white font-bold px-6 py-2 rounded-xl text-xs uppercase tracking-wider shadow-md transition shrink-0">
                + Add Category
              </button>
            </form>

            {/* Categories Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/15 space-y-4">
              <h3 className="text-base font-heading text-maroon font-bold border-b pb-2">Active Categories ({categories.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-gold/20 bg-cream/20 flex items-center justify-between space-x-2">
                    {editingCatIndex === idx ? (
                      <div className="flex gap-2 w-full">
                        <input
                          type="text"
                          value={editingCatValue}
                          onChange={(e) => setEditingCatValue(e.target.value)}
                          className="flex-grow px-2 py-1 border rounded text-xs"
                        />
                        <button onClick={() => handleSaveEditCategory(idx)} className="bg-green-600 text-white px-2 py-1 rounded text-[10px] font-bold">Save</button>
                        <button onClick={() => setEditingCatIndex(null)} className="bg-gray-300 text-black px-2 py-1 rounded text-[10px]">Cancel</button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="font-bold text-xs text-maroon block">{cat}</span>
                          <span className="text-[10px] text-gray-500 font-medium">✨ Active Collection</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => { setEditingCatIndex(idx); setEditingCatValue(cat); }}
                            className="text-xs bg-gold/20 hover:bg-gold text-maroon font-bold py-1 px-2.5 rounded-lg transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(idx)}
                            className="text-xs bg-red-100 hover:bg-red-600 hover:text-white text-red-600 font-bold py-1 px-2.5 rounded-lg transition"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && <OrderManagementCMS />}

        {/* TAB 5: CUSTOMERS DATABASE (CRM) */}
        {activeTab === 'customers' && (
          <div className="space-y-8">
            <div className="border-b border-gold/20 pb-4">
              <h2 className="text-3xl font-heading text-maroon font-bold">Customers Database (CRM)</h2>
              <p className="text-xs text-gray-500 font-light mt-1">Full profile records of registered patrons and ordering buyers.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/15 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider">
                    <th className="py-3">Customer Name & Email</th>
                    <th className="py-3">Contact Numbers</th>
                    <th className="py-3">Gender & DOB</th>
                    <th className="py-3">Shipping Location</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const registeredUsers = JSON.parse(localStorage.getItem('buyer_users') || '[]');

                    if (registeredUsers.length === 0) {
                      return (
                        <tr>
                          <td colSpan="5" className="py-10 text-center text-gray-500">
                            No registered customers yet. New buyers will automatically appear here upon registration.
                          </td>
                        </tr>
                      );
                    }

                    return registeredUsers.map((cust, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-cream/20 transition">
                        <td className="py-3 font-semibold text-maroon">
                          <div className="font-bold text-sm text-black">{cust.name || `${cust.firstName || ''} ${cust.lastName || ''}`.trim() || 'Valued Patron'}</div>
                          <div className="text-[11px] text-gray-500 font-normal">{cust.email}</div>
                        </td>
                        <td className="py-3">
                          <div><span className="font-bold text-gray-600">Ph:</span> <span className="font-semibold text-green-700">{cust.phone || 'N/A'}</span></div>
                          {cust.altPhone && <div className="text-[10px] text-gray-500"><span className="font-semibold">Alt:</span> {cust.altPhone}</div>}
                        </td>
                        <td className="py-3 text-gray-600">
                          <div>{cust.gender || 'Female'}</div>
                          {cust.dob && <div className="text-[10px] text-gray-400">DOB: {cust.dob}</div>}
                        </td>
                        <td className="py-3 text-gray-600 max-w-xs truncate">
                          {cust.address || (cust.addresses && cust.addresses[0] ? `${cust.addresses[0].street}, ${cust.addresses[0].city}` : 'No address saved')}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="bg-gold hover:bg-maroon hover:text-white text-maroon font-bold py-1.5 px-3 rounded-lg text-xs transition"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CUSTOMER DETAILS MODAL */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gold/30">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-heading text-xl text-maroon font-bold">Patron Profile Record</h3>
                <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-black font-bold text-lg">✕</button>
              </div>

              <div className="space-y-3 text-xs text-gray-700">
                <div className="bg-cream/20 p-3 rounded-xl border border-gold/15">
                  <p><span className="font-bold uppercase text-gray-500">Name:</span> <span className="font-bold text-black text-sm ml-2">{selectedCustomer.name}</span></p>
                  <p><span className="font-bold uppercase text-gray-500">Email:</span> <span className="font-mono ml-2">{selectedCustomer.email}</span></p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-gray-200">
                  <p><span className="font-bold text-gray-500">Primary Phone:</span> <span className="font-bold text-green-700 block">{selectedCustomer.phone}</span></p>
                  <p><span className="font-bold text-gray-500">Alternate Phone:</span> <span className="font-medium text-gray-800 block">{selectedCustomer.altPhone || 'None'}</span></p>
                  <p><span className="font-bold text-gray-500">Gender:</span> <span className="block">{selectedCustomer.gender}</span></p>
                  <p><span className="font-bold text-gray-500">Date of Birth:</span> <span className="block">{selectedCustomer.dob || 'Not set'}</span></p>
                  <p><span className="font-bold text-gray-500">Anniversary:</span> <span className="block">{selectedCustomer.anniversaryDate || 'Not set'}</span></p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                  <span className="font-bold text-gray-500 uppercase block">Default Shipping Address:</span>
                  <p className="font-medium text-black">{selectedCustomer.address}</p>
                  {selectedCustomer.deliveryInstructions && (
                    <p className="text-maroon italic pt-1 border-t mt-1">
                      <span className="font-bold">Instructions:</span> {selectedCustomer.deliveryInstructions}
                    </p>
                  )}
                </div>
              </div>

              <button onClick={() => setSelectedCustomer(null)} className="w-full bg-maroon text-white font-bold py-2.5 rounded-xl uppercase text-xs">
                Close Record
              </button>
            </div>
          </div>
        )}

        {/* TAB: TESTIMONIALS CMS (ADD, EDIT, DELETE SUPPORT) */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center border-b border-gold/20 pb-4">
              <div>
                <h2 className="text-3xl font-heading text-maroon font-bold">Patron Testimonials & Stories</h2>
                <p className="text-xs text-gray-500 font-light mt-1">Add, edit, or delete customer reviews and royal patron feedback displayed on the home page.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingTestimonial(null);
                  setNewTestimonial({ author: '', location: '', rating: 5, quote: '', saree: '' });
                  setShowAddTestimonial(true);
                }} 
                className="bg-maroon hover:bg-gold text-white font-bold py-2.5 px-5 rounded-full text-xs shadow-md transition"
              >
                + Add Testimonial
              </button>
            </div>

            {/* Add / Edit Testimonial Modal Form */}
            {showAddTestimonial && (
              <form onSubmit={handleSaveTestimonialSubmit} className="bg-white p-6 rounded-2xl shadow-premium border border-gold/20 space-y-4 max-w-xl animate-fade-in">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-heading text-lg text-maroon font-bold">
                    {editingTestimonial ? '✏️ Edit Patron Testimonial' : '➕ Add Patron Testimonial'}
                  </h3>
                  <button type="button" onClick={() => { setShowAddTestimonial(false); setEditingTestimonial(null); }} className="text-gray-400 hover:text-black text-sm">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-600 uppercase mb-1">Author Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Radhika Deshmukh" 
                      value={newTestimonial.author} 
                      onChange={e => setNewTestimonial({ ...newTestimonial, author: e.target.value })} 
                      className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-gold outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 uppercase mb-1">City / Location *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Mumbai / Pune" 
                      value={newTestimonial.location} 
                      onChange={e => setNewTestimonial({ ...newTestimonial, location: e.target.value })} 
                      className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-gold outline-none" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-bold text-gray-600 uppercase mb-1">Saree / Product Purchased</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Royal Maharani Kath Silk Paithani" 
                      value={newTestimonial.saree} 
                      onChange={e => setNewTestimonial({ ...newTestimonial, saree: e.target.value })} 
                      className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-gold outline-none" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-bold text-gray-600 uppercase mb-1">Review Quote *</label>
                    <textarea 
                      rows={3} 
                      required 
                      placeholder="Write the patron review quote here..." 
                      value={newTestimonial.quote} 
                      onChange={e => setNewTestimonial({ ...newTestimonial, quote: e.target.value })} 
                      className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-gold outline-none" 
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2 border-t">
                  <button type="button" onClick={() => { setShowAddTestimonial(false); setEditingTestimonial(null); }} className="px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="bg-maroon hover:bg-gold text-white font-bold px-6 py-2 rounded-xl text-xs shadow-md transition">
                    {editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
                  </button>
                </div>
              </form>
            )}

            {/* Testimonials Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map(t => (
                <div key={t.id} className="bg-white p-6 rounded-2xl shadow-premium border border-gold/15 space-y-3 relative group">
                  <div className="flex justify-between items-start pr-20">
                    <div>
                      <h4 className="font-bold text-maroon text-sm">{t.author}</h4>
                      <span className="text-xs text-gray-400">{t.location}</span>
                    </div>
                    <div className="flex text-gold text-xs">{"★".repeat(t.rating || 5)}</div>
                  </div>
                  <p className="text-xs text-gray-700 italic font-medium">"{t.quote}"</p>
                  {t.saree && <span className="text-[10px] bg-cream/40 text-maroon font-bold px-2 py-1 rounded border border-gold/20 inline-block">{t.saree}</span>}
                  
                  {/* Action Buttons: EDIT and DELETE */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button 
                      onClick={() => handleEditTestimonial(t)} 
                      className="text-xs bg-gold/20 hover:bg-gold text-maroon font-bold py-1 px-2.5 rounded-lg transition"
                      title="Edit Testimonial"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteTestimonial(t.id)} 
                      className="text-xs bg-red-100 hover:bg-red-600 hover:text-white text-red-600 font-bold py-1 px-2.5 rounded-lg transition"
                      title="Delete Testimonial"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVENUE ANALYTICS CMS MODULE */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-heading text-maroon font-bold">Revenue Analytics</h2>
            <div className="bg-white p-8 rounded-2xl shadow-premium border border-gold/10 space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-cream/30 rounded-xl border border-gold/20">
                  <span className="text-xs text-gray-500 uppercase font-bold block">Gross Revenue</span>
                  <span className="text-2xl font-bold text-maroon">₹{totalRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-4 bg-cream/30 rounded-xl border border-gold/20">
                  <span className="text-xs text-gray-500 uppercase font-bold block">Average Order Value</span>
                  <span className="text-2xl font-bold text-maroon">₹{orders.length > 0 ? Math.round(totalRevenue / orders.length).toLocaleString('en-IN') : 0}</span>
                </div>
                <div className="p-4 bg-cream/30 rounded-xl border border-gold/20">
                  <span className="text-xs text-gray-500 uppercase font-bold block">Fulfilled Orders</span>
                  <span className="text-2xl font-bold text-green-700">{orders.filter(o => o.status === 'Delivered' || o.status === 'Shipped').length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTHER CMS MODULES */}
        {activeTab === 'homepage_cms' && <HomepageCMS />}
        {activeTab === 'founder_cms' && <FounderCMS />}
        {activeTab === 'policy' && <PolicyCMS />}
        {activeTab === 'contact' && <ContactCMS />}

      </main>
    </div>
  );
};

export default AdminDashboard;
