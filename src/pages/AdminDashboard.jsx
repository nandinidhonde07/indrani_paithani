import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiGrid, 
  FiPackage, 
  FiLayers, 
  FiShoppingBag, 
  FiUsers, 
  FiMonitor, 
  FiUser, 
  FiMessageSquare, 
  FiPhone, 
  FiFileText, 
  FiTrendingUp, 
  FiSearch, 
  FiBell, 
  FiLogOut, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiX, 
  FiCheck, 
  FiStar, 
  FiAlertTriangle, 
  FiArrowRight, 
  FiMenu, 
  FiShield,
  FiEye,
  FiAward
} from 'react-icons/fi';
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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/products')) setActiveTab('products');
    else if (path.includes('/categories')) setActiveTab('categories');
    else if (path.includes('/orders')) setActiveTab('orders');
    else if (path.includes('/customers')) setActiveTab('customers');
    else if (path.includes('/homepage')) setActiveTab('homepage_cms');
    else if (path.includes('/founder')) setActiveTab('founder_cms');
    else if (path.includes('/testimonials')) setActiveTab('testimonials');
    else if (path.includes('/contact')) setActiveTab('contact');
    else if (path.includes('/policy')) setActiveTab('policy');
    else if (path.includes('/analytics')) setActiveTab('analytics');
    else setActiveTab('dashboard');
  }, [location.pathname]);

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
  const profilesDb = JSON.parse(localStorage.getItem('indrani_profiles_db') || '{}');
  const registeredUsersFromProfiles = Object.values(profilesDb);
  const registeredUsersFromLegacy = JSON.parse(localStorage.getItem('buyer_users') || '[]');
  const registeredUsers = [...registeredUsersFromProfiles];
  registeredUsersFromLegacy.forEach(u => {
    if (!registeredUsers.some(p => (p.email && p.email.toLowerCase() === u.email?.toLowerCase()))) {
      registeredUsers.push(u);
    }
  });
  const activeCustomersCount = registeredUsers.length;
  const lowStockProducts = products.filter(p => p.stock <= 3);

  // Navigation Items with Icons
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: FiGrid },
    { id: 'products', label: 'Products Catalog', icon: FiPackage },
    { id: 'categories', label: 'Categories & Collections', icon: FiLayers },
    { id: 'orders', label: 'Orders Management', icon: FiShoppingBag },
    { id: 'customers', label: 'Customers Database', icon: FiUsers },
    { id: 'homepage_cms', label: 'Homepage CMS', icon: FiMonitor },
    { id: 'founder_cms', label: 'Founder CMS', icon: FiUser },
    { id: 'testimonials', label: 'Patron Testimonials', icon: FiMessageSquare },
    { id: 'contact', label: 'Contact Info CMS', icon: FiPhone },
    { id: 'policy', label: 'Policy Pages', icon: FiFileText },
    { id: 'analytics', label: 'Revenue Analytics', icon: FiTrendingUp }
  ];

  // Helper for rendering section header info
  const getTabHeader = () => {
    switch (activeTab) {
      case 'products':
        return { title: "Products Catalog CMS", subtitle: "Manage store products, inventory levels, pricing, and saree variants." };
      case 'categories':
        return { title: "Categories & Collections", subtitle: "Organize saree categories, collections, and catalog tags." };
      case 'orders':
        return { title: "Orders Management CMS", subtitle: "View, update, track, and process customer orders in real-time." };
      case 'customers':
        return { title: "Customers Database (CRM)", subtitle: "View registered patrons, contact records, and order history." };
      case 'homepage_cms':
        return { title: "Homepage CMS & Banners", subtitle: "Update home page carousel slides, announcement bars, and highlighted collections." };
      case 'founder_cms':
        return { title: "Founder & Brand Legacy CMS", subtitle: "Edit the founder story, Yeola heritage timeline, and brand values." };
      case 'testimonials':
        return { title: "Patron Testimonials CMS", subtitle: "Moderate customer reviews, luxury stories, and patron feedback." };
      case 'contact':
        return { title: "Contact Info & Showroom CMS", subtitle: "Update Yeola store address, phone numbers, email, and showroom timing." };
      case 'policy':
        return { title: "Policy Pages CMS", subtitle: "Manage Privacy Policy, Refund Policy, Terms, and Shipping guidelines." };
      case 'analytics':
        return { title: "Revenue & Sales Analytics", subtitle: "Track total revenue, average order value, and store performance." };
      default:
        return { title: "Dashboard Overview", subtitle: "Real-time metrics, live order statuses, inventory alerts, and customer activity." };
    }
  };

  const currentTabHeader = getTabHeader();

  return (
    <div className="min-h-screen bg-cream text-black pt-20 md:pt-24 flex flex-col font-body">
      
      {/* Top Luxury Owner Header Bar (Matching Buyer Dashboard Style) */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gold/20 px-6 py-4 shadow-xs sticky top-[80px] z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Title & Brand Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/official_logo.jpg" 
                alt="Indrani Paithani Logo" 
                className="w-10 h-10 rounded-full object-cover border-2 border-gold shadow-sm hidden sm:block" 
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-maroon bg-gold/20 border border-gold/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <FiShield className="w-3 h-3 text-maroon" /> Owner Console
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">v1.0.7</span>
                </div>
                <h1 className="text-xl md:text-2xl font-heading text-maroon font-bold mt-0.5">
                  {currentTabHeader.title}
                </h1>
              </div>
            </div>

            {/* Mobile Menu Drawer Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-maroon text-white hover:bg-red-950 transition shadow-sm"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <FiX className="w-5 h-5 text-gold" /> : <FiMenu className="w-5 h-5 text-gold" />}
            </button>
          </div>

          {/* Right Header Actions & Owner Identity */}
          <div className="flex items-center space-x-3 self-end md:self-auto">
            {/* Search Input */}
            <div className="relative hidden lg:block w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Search orders, catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-cream/30 border border-gold/30 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-maroon text-black"
              />
            </div>

            {/* Notifications Button */}
            <button 
              className="relative p-2.5 rounded-full border border-gold/30 bg-white hover:bg-cream/40 text-maroon transition shadow-xs"
              title="Notifications"
            >
              <FiBell className="w-4 h-4" />
              {lowStockProducts.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
              )}
            </button>

            {/* Owner Profile Avatar & Identity */}
            <div className="flex items-center space-x-2.5 pl-3 border-l border-gold/20">
              <img 
                src="/assets/official_logo.jpg" 
                alt="Owner Avatar" 
                className="w-9 h-9 rounded-full object-cover border-2 border-gold shadow-xs" 
              />
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-maroon block leading-tight">Nandini Dhonde</span>
                <span className="text-[10px] text-gray-500 block leading-tight font-mono">nandini.dhonde1@gmail.com</span>
              </div>
            </div>

            {/* Logout Console Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1.5 bg-maroon hover:bg-red-950 text-white text-xs font-bold py-2.5 px-4 rounded-full transition shadow-md border border-gold/30 uppercase tracking-wider"
              title="Logout Console"
            >
              <FiLogOut className="w-3.5 h-3.5 text-gold" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Container: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row items-start max-w-7xl w-full mx-auto px-2 sm:px-4">
        
        {/* Luxury Deep Burgundy Sidebar Navigation */}
        <aside className={`
          w-full md:w-64 bg-maroon text-white p-5 flex flex-col justify-between shrink-0 
          md:sticky md:top-[150px] md:h-[calc(100vh-150px)] shadow-xl overflow-y-auto custom-scrollbar border-r border-gold/20 rounded-b-3xl md:rounded-3xl my-2 md:my-6
          ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}
        `}>
          <div className="space-y-6">
            {/* Brand Logo & Header */}
            <div className="border-b border-gold/30 pb-4 text-center">
              <img 
                src="/assets/official_logo.jpg" 
                alt="Indrani Paithani Logo" 
                className="h-14 w-14 mx-auto mb-2 rounded-full border-2 border-gold shadow-md object-contain" 
              />
              <h2 className="text-lg font-heading text-gold tracking-widest font-bold">INDRANI PAITHANI</h2>
              <p className="text-[11px] text-cream/70 font-light mt-0.5">Luxury Heritage Console</p>
            </div>

            {/* Navigation Menu List */}
            <nav className="space-y-1.5 pr-1">
              {navItems.map(tab => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-3 px-4 rounded-xl font-medium text-xs transition flex items-center space-x-3 ${
                      isActive 
                        ? 'bg-gold text-maroon font-bold shadow-md' 
                        : 'hover:bg-gold/15 text-cream/90 hover:text-white'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-maroon' : 'text-gold'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Footer Session Note */}
          <div className="pt-6 mt-6 border-t border-gold/20 text-center">
            <span className="text-[10px] text-cream/50 font-mono block">Owner Session Authenticated</span>
            <span className="text-[10px] text-gold font-semibold block mt-0.5">Indrani Paithani Platform</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0 bg-cream min-h-[calc(100vh-150px)] overflow-y-auto">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-6xl mx-auto pb-8">
              
              {/* Luxury Header Card (Matching Buyer Profile Gradient Banner) */}
              <div className="relative bg-gradient-to-r from-maroon/95 via-maroon to-[#4B123F] rounded-3xl p-6 md:p-8 text-white shadow-xl overflow-hidden border border-gold/30">
                <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-gold text-xs font-semibold uppercase tracking-widest mb-1">
                      <span>⚜ Royal Paithani Owner Console</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-wide">Dashboard Overview</h1>
                    <p className="text-xs md:text-sm text-cream/80 font-light mt-1 max-w-xl">
                      Real-time metrics, live order statuses, inventory alerts, and customer activity.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-gold text-maroon font-bold text-xs px-6 py-3 rounded-full hover:bg-white hover:text-maroon transition-all shadow-md flex items-center space-x-2 shrink-0 self-start md:self-auto uppercase tracking-wider"
                  >
                    <FiPlus className="text-base text-maroon" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Summary Analytics Cards Grid (Matching Buyer Profile Card System) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Metric Card 1: Revenue */}
                <div className="bg-white rounded-3xl p-6 shadow-premium border border-gold/20 text-center space-y-4 relative overflow-hidden group hover:border-gold transition">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-maroon via-gold to-maroon"></div>
                  <div className="w-12 h-12 rounded-full bg-gold/20 text-maroon mx-auto flex items-center justify-center shadow-xs border border-gold/30">
                    <FiTrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Total Revenue</span>
                    <p className="text-3xl font-bold font-heading text-maroon mt-1">
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[11px] text-green-700 font-semibold block mt-1">
                      <FiCheck className="w-3.5 h-3.5 inline mr-1" /> {totalOrdersCount} Placed Orders
                    </span>
                  </div>
                </div>

                {/* Metric Card 2: Total Orders */}
                <div className="bg-white rounded-3xl p-6 shadow-premium border border-gold/20 text-center space-y-4 relative overflow-hidden group hover:border-gold transition">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-maroon via-gold to-maroon"></div>
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-800 mx-auto flex items-center justify-center shadow-xs border border-blue-200">
                    <FiShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Total Orders</span>
                    <p className="text-3xl font-bold font-heading text-maroon mt-1">{totalOrdersCount}</p>
                    <span className="text-[11px] text-blue-700 font-semibold block mt-1">
                      {realOrders.filter(o => o.status === 'Order Confirmed' || o.status === 'Preparing Your Paithani').length} Pending Dispatch
                    </span>
                  </div>
                </div>

                {/* Metric Card 3: Products in Stock */}
                <div className="bg-white rounded-3xl p-6 shadow-premium border border-gold/20 text-center space-y-4 relative overflow-hidden group hover:border-gold transition">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-maroon via-gold to-maroon"></div>
                  <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-800 mx-auto flex items-center justify-center shadow-xs border border-purple-200">
                    <FiPackage className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Products In Stock</span>
                    <p className="text-3xl font-bold font-heading text-maroon mt-1">{productsInStockCount}</p>
                    <span className="text-[11px] text-purple-700 font-semibold block mt-1">
                      {products.length} Listed Products
                    </span>
                  </div>
                </div>

                {/* Metric Card 4: Active Customers */}
                <div className="bg-white rounded-3xl p-6 shadow-premium border border-gold/20 text-center space-y-4 relative overflow-hidden group hover:border-gold transition">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-maroon via-gold to-maroon"></div>
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 mx-auto flex items-center justify-center shadow-xs border border-amber-200">
                    <FiUsers className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Active Customers</span>
                    <p className="text-3xl font-bold font-heading text-maroon mt-1">{activeCustomersCount}</p>
                    <span className="text-[11px] text-green-700 font-semibold block mt-1">
                      {activeCustomersCount > 0 ? 'Registered Patrons' : 'No Registrations Yet'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Action Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                <button 
                  onClick={() => setActiveTab('products')} 
                  className="p-5 bg-white hover:bg-cream/40 rounded-3xl border border-gold/20 hover:border-maroon transition text-left space-y-3 shadow-premium group relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/20 text-maroon flex items-center justify-center font-bold">
                    <FiPackage className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-maroon block font-heading text-sm">Manage Catalog</span>
                    <span className="text-[11px] text-gray-500 mt-1 flex items-center gap-1 group-hover:text-maroon transition font-medium">
                      View all products <FiArrowRight className="w-3 h-3 text-gold" />
                    </span>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('orders')} 
                  className="p-5 bg-white hover:bg-cream/40 rounded-3xl border border-gold/20 hover:border-maroon transition text-left space-y-3 shadow-premium group relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/20 text-maroon flex items-center justify-center font-bold">
                    <FiShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-maroon block font-heading text-sm">Process Orders</span>
                    <span className="text-[11px] text-gray-500 mt-1 flex items-center gap-1 group-hover:text-maroon transition font-medium">
                      Manage order pipeline <FiArrowRight className="w-3 h-3 text-gold" />
                    </span>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('customers')} 
                  className="p-5 bg-white hover:bg-cream/40 rounded-3xl border border-gold/20 hover:border-maroon transition text-left space-y-3 shadow-premium group relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/20 text-maroon flex items-center justify-center font-bold">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-maroon block font-heading text-sm">Customer CRM</span>
                    <span className="text-[11px] text-gray-500 mt-1 flex items-center gap-1 group-hover:text-maroon transition font-medium">
                      Patron database <FiArrowRight className="w-3 h-3 text-gold" />
                    </span>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('testimonials')} 
                  className="p-5 bg-white hover:bg-cream/40 rounded-3xl border border-gold/20 hover:border-maroon transition text-left space-y-3 shadow-premium group relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/20 text-maroon flex items-center justify-center font-bold">
                    <FiMessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-maroon block font-heading text-sm">Patron Testimonials</span>
                    <span className="text-[11px] text-gray-500 mt-1 flex items-center gap-1 group-hover:text-maroon transition font-medium">
                      Moderate reviews <FiArrowRight className="w-3 h-3 text-gold" />
                    </span>
                  </div>
                </button>
              </div>

              {/* Low Stock Inventory Alert Banner */}
              {lowStockProducts.length > 0 && (
                <div className="bg-red-50/80 rounded-3xl p-6 border border-red-200 space-y-4 shadow-sm">
                  <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center space-x-2">
                    <FiAlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Low Stock Items Needing Restock</span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-red-200 text-red-700 font-bold">
                          <th className="py-2.5">Item Name</th>
                          <th className="py-2.5">Category</th>
                          <th className="py-2.5">Current Stock</th>
                          <th className="py-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowStockProducts.map(p => (
                          <tr key={p.id} className="border-b border-red-100 last:border-0">
                            <td className="py-3 font-bold text-black">{p.name}</td>
                            <td className="py-3 text-gray-600">{p.category}</td>
                            <td className="py-3 font-bold text-red-600">{p.stock} left</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleRestockProduct(p.id)}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded-full text-[11px] transition shadow-xs inline-flex items-center space-x-1"
                              >
                                <FiPlus className="w-3 h-3" />
                                <span>Restock +5</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recent Customer Orders Overview Table */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-premium border border-gold/20 space-y-5">
                <div className="flex justify-between items-center border-b border-gold/20 pb-4">
                  <h3 className="text-xl font-heading text-maroon font-bold">Recent Customer Orders</h3>
                  <button 
                    onClick={() => setActiveTab('orders')} 
                    className="text-xs text-maroon font-bold hover:underline inline-flex items-center space-x-1"
                  >
                    <span>View All Orders ({orders.length})</span>
                    <FiArrowRight className="w-3.5 h-3.5 text-gold" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gold/20 text-maroon font-heading font-bold uppercase tracking-wider">
                        <th className="py-3 px-3">Order ID</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Customer Name</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-10 text-center text-gray-500">
                            No customer orders placed yet. Real orders will display here automatically.
                          </td>
                        </tr>
                      ) : (
                        orders.slice(0, 5).map(ord => (
                          <tr key={ord.orderId} className="border-b border-gold/10 last:border-0 hover:bg-cream/20 transition">
                            <td className="py-3.5 px-3 font-bold text-maroon font-mono">{ord.orderId}</td>
                            <td className="py-3.5 px-3 text-gray-500">{new Date(ord.orderDate).toLocaleDateString()}</td>
                            <td className="py-3.5 px-3 font-semibold text-black">{ord.buyerName}</td>
                            <td className="py-3.5 px-3">
                              <span className="bg-gold/20 text-maroon text-[11px] font-bold px-3 py-1 rounded-full border border-gold/30 uppercase">
                                {ord.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-right font-bold text-black text-sm">₹{ord.grandTotal?.toLocaleString('en-IN')}</td>
                          </tr>
                        ))
                      )}
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
            <div className="space-y-8 max-w-6xl mx-auto pb-8">
              <div className="border-b border-gold/20 pb-4">
                <h2 className="text-3xl font-heading text-maroon font-bold">Categories & Collections Management</h2>
                <p className="text-xs text-gray-500 font-light mt-1">Add, edit, or delete store categories. Changes dynamically sync across the website.</p>
              </div>

              {/* Add New Category Form */}
              <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-3xl shadow-premium border border-gold/20 flex flex-col sm:flex-row gap-4 items-end max-w-xl">
                <div className="flex-grow w-full">
                  <label className="block text-xs font-bold text-maroon uppercase tracking-wider mb-2">New Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharani Paithani / Silk Dupattas"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon text-xs"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto bg-maroon hover:bg-gold hover:text-maroon text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-md transition shrink-0 inline-flex items-center justify-center space-x-1"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </form>

              {/* Categories Grid */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-premium border border-gold/20 space-y-6">
                <h3 className="text-lg font-heading text-maroon font-bold border-b border-gold/20 pb-3">Active Store Categories ({categories.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-gold/20 bg-cream/30 flex items-center justify-between space-x-2">
                      {editingCatIndex === idx ? (
                        <div className="flex gap-2 w-full">
                          <input
                            type="text"
                            value={editingCatValue}
                            onChange={(e) => setEditingCatValue(e.target.value)}
                            className="flex-grow px-3 py-1.5 border rounded-xl text-xs focus:ring-2 focus:ring-maroon"
                          />
                          <button onClick={() => handleSaveEditCategory(idx)} className="bg-green-700 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold">Save</button>
                          <button onClick={() => setEditingCatIndex(null)} className="bg-gray-200 text-black px-3 py-1.5 rounded-xl text-[11px]">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="font-bold text-xs text-maroon block">{cat}</span>
                            <span className="text-[10px] text-gray-500 font-medium block mt-0.5">Active Collection</span>
                          </div>
                          <div className="flex space-x-1.5">
                            <button
                              onClick={() => { setEditingCatIndex(idx); setEditingCatValue(cat); }}
                              className="p-2 bg-gold/20 hover:bg-gold text-maroon font-bold rounded-lg transition"
                              title="Edit Category"
                            >
                              <FiEdit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(idx)}
                              className="p-2 bg-red-100 hover:bg-red-600 hover:text-white text-red-600 font-bold rounded-lg transition"
                              title="Delete Category"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
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
            <div className="space-y-8 max-w-6xl mx-auto pb-8">
              <div className="border-b border-gold/20 pb-4">
                <h2 className="text-3xl font-heading text-maroon font-bold">Customers Database (CRM)</h2>
                <p className="text-xs text-gray-500 font-light mt-1">Full profile records of registered patrons and ordering buyers.</p>
              </div>

              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-premium border border-gold/20 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gold/20 text-maroon font-heading font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Customer Name & Email</th>
                      <th className="py-3 px-3">Contact Numbers</th>
                      <th className="py-3 px-3">Gender & DOB</th>
                      <th className="py-3 px-3">Shipping Location</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const profilesDb = JSON.parse(localStorage.getItem('indrani_profiles_db') || '{}');
                      const registeredUsersFromProfiles = Object.values(profilesDb);
                      const registeredUsersFromLegacy = JSON.parse(localStorage.getItem('buyer_users') || '[]');
                      const registeredUsers = [...registeredUsersFromProfiles];
                      registeredUsersFromLegacy.forEach(u => {
                        if (!registeredUsers.some(p => (p.email && p.email.toLowerCase() === u.email?.toLowerCase()))) {
                          registeredUsers.push(u);
                        }
                      });

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
                        <tr key={idx} className="border-b border-gold/10 last:border-0 hover:bg-cream/20 transition">
                          <td className="py-3.5 px-3 font-semibold text-maroon">
                            <div className="font-bold text-sm text-black">{cust.name || `${cust.firstName || ''} ${cust.lastName || ''}`.trim() || 'Valued Patron'}</div>
                            <div className="text-[11px] text-gray-500 font-mono mt-0.5">{cust.email}</div>
                          </td>
                          <td className="py-3.5 px-3">
                            <div><span className="font-bold text-gray-500">Ph:</span> <span className="font-semibold text-green-700">{cust.phone || 'N/A'}</span></div>
                            {cust.altPhone && <div className="text-[10px] text-gray-500"><span className="font-semibold">Alt:</span> {cust.altPhone}</div>}
                          </td>
                          <td className="py-3.5 px-3 text-gray-600">
                            <div>{cust.gender || 'Female'}</div>
                            {cust.dob && <div className="text-[10px] text-gray-400">DOB: {cust.dob}</div>}
                          </td>
                          <td className="py-3.5 px-3 text-gray-600 max-w-xs truncate">
                            {cust.address || (cust.addresses && cust.addresses[0] ? `${cust.addresses[0].street}, ${cust.addresses[0].city}` : 'No address saved')}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => setSelectedCustomer(cust)}
                              className="bg-gold hover:bg-maroon hover:text-white text-maroon font-bold py-1.5 px-4 rounded-full text-xs transition inline-flex items-center space-x-1 shadow-xs"
                            >
                              <FiEye className="w-3.5 h-3.5" />
                              <span>View Details</span>
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

          {/* CUSTOMER DETAILS MODAL (Matching Buyer Dashboard Modal Style) */}
          {selectedCustomer && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-5 border border-gold/30 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-gold/20 pb-3">
                  <h3 className="font-heading text-xl text-maroon font-bold">Patron Profile Record</h3>
                  <button 
                    onClick={() => setSelectedCustomer(null)} 
                    className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs text-gray-700">
                  <div className="bg-cream/40 p-4 rounded-2xl border border-gold/20">
                    <p><span className="font-bold uppercase text-gray-500">Name:</span> <span className="font-bold text-black text-sm ml-2">{selectedCustomer.name}</span></p>
                    <p className="mt-1"><span className="font-bold uppercase text-gray-500">Email:</span> <span className="font-mono ml-2 text-black">{selectedCustomer.email}</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-gray-200">
                    <div><span className="font-bold text-gray-500 block">Primary Phone</span> <span className="font-bold text-green-700 block mt-0.5">{selectedCustomer.phone}</span></div>
                    <div><span className="font-bold text-gray-500 block">Alternate Phone</span> <span className="font-medium text-gray-800 block mt-0.5">{selectedCustomer.altPhone || 'None'}</span></div>
                    <div><span className="font-bold text-gray-500 block">Gender</span> <span className="block mt-0.5">{selectedCustomer.gender}</span></div>
                    <div><span className="font-bold text-gray-500 block">Date of Birth</span> <span className="block mt-0.5">{selectedCustomer.dob || 'Not set'}</span></div>
                    <div><span className="font-bold text-gray-500 block">Anniversary</span> <span className="block mt-0.5">{selectedCustomer.anniversaryDate || 'Not set'}</span></div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-1">
                    <span className="font-bold text-gray-500 uppercase block">Default Shipping Address</span>
                    <p className="font-medium text-black mt-1">{selectedCustomer.address}</p>
                    {selectedCustomer.deliveryInstructions && (
                      <p className="text-maroon italic pt-2 border-t border-gray-100 mt-2 text-[11px]">
                        <span className="font-bold">Instructions:</span> {selectedCustomer.deliveryInstructions}
                      </p>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedCustomer(null)} 
                  className="w-full bg-maroon hover:bg-gold hover:text-maroon text-white font-bold py-3 rounded-full uppercase text-xs transition shadow-md"
                >
                  Close Record
                </button>
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS CMS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-8 max-w-6xl mx-auto pb-8">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gold/20 pb-4">
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
                  className="bg-maroon hover:bg-gold hover:text-maroon text-white font-bold py-2.5 px-6 rounded-full text-xs shadow-md transition inline-flex items-center space-x-1 uppercase tracking-wider"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              {/* Add / Edit Testimonial Modal Form */}
              {showAddTestimonial && (
                <form onSubmit={handleSaveTestimonialSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-premium border border-gold/20 space-y-5 max-w-xl">
                  <div className="flex justify-between items-center border-b border-gold/20 pb-3">
                    <h3 className="font-heading text-xl text-maroon font-bold">
                      {editingTestimonial ? 'Edit Patron Testimonial' : 'Add Patron Testimonial'}
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => { setShowAddTestimonial(false); setEditingTestimonial(null); }} 
                      className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
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
                        className="w-full px-4 py-2.5 border border-gold/30 rounded-xl focus:ring-2 focus:ring-maroon outline-none" 
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
                        className="w-full px-4 py-2.5 border border-gold/30 rounded-xl focus:ring-2 focus:ring-maroon outline-none" 
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-bold text-gray-600 uppercase mb-1">Saree / Product Purchased</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Royal Maharani Kath Silk Paithani" 
                        value={newTestimonial.saree} 
                        onChange={e => setNewTestimonial({ ...newTestimonial, saree: e.target.value })} 
                        className="w-full px-4 py-2.5 border border-gold/30 rounded-xl focus:ring-2 focus:ring-maroon outline-none" 
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
                        className="w-full px-4 py-2.5 border border-gold/30 rounded-xl focus:ring-2 focus:ring-maroon outline-none" 
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end pt-4 border-t border-gold/20">
                    <button 
                      type="button" 
                      onClick={() => { setShowAddTestimonial(false); setEditingTestimonial(null); }} 
                      className="px-5 py-2.5 border border-gray-300 rounded-full text-xs font-semibold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-maroon hover:bg-gold hover:text-maroon text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md transition"
                    >
                      {editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
                    </button>
                  </div>
                </form>
              )}

              {/* Testimonials Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-white p-6 rounded-3xl shadow-premium border border-gold/20 space-y-3 relative group">
                    <div className="flex justify-between items-start pr-20">
                      <div>
                        <h4 className="font-bold text-maroon font-heading text-base">{t.author}</h4>
                        <span className="text-xs text-gray-400">{t.location}</span>
                      </div>
                      <div className="flex text-gold space-x-0.5">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <FiStar key={i} className="w-4 h-4 fill-gold text-gold" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 italic font-medium leading-relaxed">"{t.quote}"</p>
                    {t.saree && (
                      <span className="text-[10px] bg-cream/50 text-maroon font-bold px-3 py-1 rounded-full border border-gold/30 inline-block">
                        {t.saree}
                      </span>
                    )}
                    
                    {/* Action Buttons: EDIT and DELETE */}
                    <div className="absolute top-6 right-6 flex space-x-2">
                      <button 
                        onClick={() => handleEditTestimonial(t)} 
                        className="p-2 bg-gold/20 hover:bg-gold text-maroon font-bold rounded-lg transition"
                        title="Edit Testimonial"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTestimonial(t.id)} 
                        className="p-2 bg-red-100 hover:bg-red-600 hover:text-white text-red-600 font-bold rounded-lg transition"
                        title="Delete Testimonial"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVENUE ANALYTICS CMS MODULE */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 max-w-6xl mx-auto pb-8">
              <h2 className="text-3xl font-heading text-maroon font-bold">Revenue Analytics</h2>
              <div className="bg-white p-8 rounded-3xl shadow-premium border border-gold/20 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div className="p-6 bg-cream/30 rounded-2xl border border-gold/20">
                    <span className="text-xs text-gray-500 uppercase font-bold block">Gross Revenue</span>
                    <span className="text-3xl font-bold font-heading text-maroon mt-2 block">₹{totalRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-6 bg-cream/30 rounded-2xl border border-gold/20">
                    <span className="text-xs text-gray-500 uppercase font-bold block">Average Order Value</span>
                    <span className="text-3xl font-bold font-heading text-maroon mt-2 block">
                      ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length).toLocaleString('en-IN') : 0}
                    </span>
                  </div>
                  <div className="p-6 bg-cream/30 rounded-2xl border border-gold/20">
                    <span className="text-xs text-gray-500 uppercase font-bold block">Fulfilled Orders</span>
                    <span className="text-3xl font-bold font-heading text-green-700 mt-2 block">
                      {orders.filter(o => o.status === 'Delivered' || o.status === 'Shipped').length}
                    </span>
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
    </div>
  );
};

export default AdminDashboard;
