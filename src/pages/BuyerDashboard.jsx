import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OrderService from '../services/OrderService.js';
import UserService from '../services/UserService.js';
import useCartStore from '../store/useCartStore.js';
import AuthService from '../services/AuthService.js';
import useAuthStore from '../store/useAuthStore.js';
import { generateInvoice } from '../utils/InvoiceGenerator.js';
import { FiCheckCircle, FiEdit3, FiUser, FiMapPin, FiLock, FiShield, FiPlus, FiTrash2, FiStar, FiPhoneCall, FiGift, FiX, FiCheck } from 'react-icons/fi';

const AVATAR_PRESETS = [
  { id: 'logo', name: 'Royal Monogram', url: '/assets/official_logo.jpg' },
  { id: 'peacock', name: 'Silk Peacock', url: '/assets/products/purple_parrot.png' },
  { id: 'golden', name: 'Gold Pallu', url: '/assets/products/muniya_1.png' },
  { id: 'lotus', name: 'Lotus Weave', url: '/assets/products/lotus_swan_flat.png' }
];

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const cart = useCartStore(state => state.cart);
  const wishlist = useCartStore(state => state.wishlist);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const removeFromWishlist = useCartStore(state => state.toggleWishlist);

  const [userProfile, setUserProfile] = useState(null);
  
  // Edit Profile Modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    altPhone: '',
    email: '',
    gender: 'Female',
    dob: '',
    anniversaryDate: '',
    emergencyContact: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Avatar Selector Modal
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  // Address Modal
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    label: 'Home',
    street: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India',
    isDefault: false
  });

  // Password Security Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState(null);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [viewingOrderDetails, setViewingOrderDetails] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Help & Support State
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('Order Tracking');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const fetchUserData = async () => {
    const user = await UserService.getCurrentUser();
    if (user) {
      setUserProfile(user);
      setEditProfileForm({
        firstName: user.firstName || (user.name ? user.name.split(' ')[0] : ''),
        lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ''),
        phone: user.phone || '',
        altPhone: user.altPhone || '',
        email: user.email || '',
        gender: user.gender || 'Female',
        dob: user.dob || '',
        anniversaryDate: user.anniversaryDate || '',
        emergencyContact: user.emergencyContact || ''
      });
    }
  };

  const fetchOrders = async () => {
    const user = await UserService.getCurrentUser();
    const email = user ? user.email : 'guest@example.com';
    const fetchedOrders = await OrderService.getBuyerOrders(email);
    setOrders(fetchedOrders);
  };

  useEffect(() => {
    fetchUserData();
    fetchOrders();

    window.addEventListener('indrani_order_created', fetchOrders);
    window.addEventListener('storage', fetchOrders);
    return () => {
      window.removeEventListener('indrani_order_created', fetchOrders);
      window.removeEventListener('storage', fetchOrders);
    };
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/buyer-login');
  };

  // Profile Update Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const updated = await UserService.updateCurrentUser(editProfileForm);
    setUserProfile(updated);
    setIsSavingProfile(false);
    setShowEditProfileModal(false);
    alert('✓ Profile details updated successfully!');
  };

  // Avatar Selection Handler
  const handleSelectAvatar = async (url) => {
    const updated = await UserService.updateCurrentUser({ avatarUrl: url });
    setUserProfile(updated);
    setShowAvatarModal(false);
  };

  // Pincode auto-fill in Add Address modal
  const handleAddressPincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    let autoCity = newAddressForm.city;
    let autoState = newAddressForm.state;

    if (val.length === 6) {
      if (val.startsWith('400')) { autoCity = 'Mumbai'; autoState = 'Maharashtra'; }
      else if (val.startsWith('411')) { autoCity = 'Pune'; autoState = 'Maharashtra'; }
      else if (val.startsWith('422')) { autoCity = 'Nashik'; autoState = 'Maharashtra'; }
      else if (val.startsWith('423')) { autoCity = 'Yeola'; autoState = 'Maharashtra'; }
      else if (val.startsWith('110')) { autoCity = 'New Delhi'; autoState = 'Delhi'; }
      else if (val.startsWith('560')) { autoCity = 'Bengaluru'; autoState = 'Karnataka'; }
      else if (val.startsWith('600')) { autoCity = 'Chennai'; autoState = 'Tamil Nadu'; }
      else if (val.startsWith('700')) { autoCity = 'Kolkata'; autoState = 'West Bengal'; }
    }

    setNewAddressForm({
      ...newAddressForm,
      pincode: val,
      city: autoCity,
      state: autoState
    });
  };

  // Add Address Handler
  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddressForm.street || !newAddressForm.pincode) {
      alert("Please fill out street address and pincode.");
      return;
    }
    const updatedUser = await UserService.addAddress(newAddressForm);
    setUserProfile(updatedUser);
    setShowAddAddressModal(false);
    setNewAddressForm({
      label: 'Home',
      street: '',
      landmark: '',
      pincode: '',
      city: '',
      state: '',
      country: 'India',
      isDefault: false
    });
    alert("✓ Saved address added successfully!");
  };

  // Set Default Address Handler
  const handleSetDefaultAddress = async (id) => {
    const updated = await UserService.setDefaultAddress(id);
    setUserProfile(updated);
  };

  // Delete Address Handler
  const handleDeleteAddress = async (id) => {
    if (confirm("Are you sure you want to remove this address?")) {
      const updated = await UserService.deleteAddress(id);
      setUserProfile(updated);
    }
  };

  // Change Password Handler
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    try {
      await UserService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.message || 'Failed to update password.' });
    }
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row relative text-black">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-maroon text-white p-6 flex flex-col justify-between shadow-xl">
        <div className="space-y-6">
          
          {/* User Brief Card */}
          <div className="border-b border-gold/30 pb-4 flex items-center space-x-3">
            <div className="relative cursor-pointer group" onClick={() => setShowAvatarModal(true)}>
              <img 
                src={userProfile?.avatarUrl || '/assets/official_logo.jpg'} 
                alt="Avatar" 
                className="w-12 h-12 rounded-full object-cover border-2 border-gold shadow-md"
              />
              <span className="absolute bottom-0 right-0 bg-gold text-maroon p-1 rounded-full text-[8px] font-bold">📷</span>
            </div>
            <div className="overflow-hidden">
              <h2 className="text-base font-heading font-bold text-gold tracking-wide truncate">
                {userProfile?.name || 'Valued Client'}
              </h2>
              <p className="text-[10px] text-cream/80 truncate">{userProfile?.email}</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'profile', label: 'My Profile', icon: <FiUser /> },
              { id: 'orders', label: `My Orders (${orders.length})`, icon: <FiGift /> },
              { id: 'cart', label: `Shopping Bag (${cart.length})`, icon: <FiGift /> },
              { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: <FiStar /> },
              { id: 'address', label: 'Saved Addresses', icon: <FiMapPin /> },
              { id: 'security', label: 'Password & Security', icon: <FiLock /> },
              { id: 'support', label: 'Help & Support', icon: <FiPhoneCall /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl text-xs font-semibold transition ${
                  activeTab === tab.id 
                    ? 'bg-gold text-maroon shadow-md' 
                    : 'text-white/80 hover:bg-gold/15 hover:text-white'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button 
          onClick={handleLogout} 
          className="mt-8 bg-black/40 hover:bg-red-950 text-white text-xs py-3 rounded-xl transition font-bold uppercase tracking-wider border border-white/10"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto relative">

        {/* 1. MY PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-8 max-w-5xl">
            <div className="flex justify-between items-center border-b border-gold/20 pb-4">
              <div>
                <h1 className="text-3xl font-heading text-maroon font-bold">Personal Profile Dashboard</h1>
                <p className="text-xs text-gray-500 font-light mt-1">Manage your verified customer details and preferences.</p>
              </div>
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="bg-maroon hover:bg-gold text-white font-bold text-xs px-5 py-2.5 rounded-full transition shadow flex items-center space-x-2"
              >
                <FiEdit3 />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Personal Details Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Identity & Verified Badges */}
              <div className="bg-white p-8 rounded-3xl shadow-premium border border-gold/15 space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="relative cursor-pointer group" onClick={() => setShowAvatarModal(true)}>
                      <img
                        src={userProfile?.avatarUrl || '/assets/official_logo.jpg'}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gold shadow-md"
                      />
                      <span className="absolute bottom-0 right-0 bg-maroon text-gold p-1.5 rounded-full text-xs shadow-md">📷</span>
                    </div>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-green-200 flex items-center space-x-1">
                      <FiCheckCircle />
                      <span>Verified Client</span>
                    </span>
                  </div>

                  <h3 className="text-2xl font-heading text-maroon font-bold">{userProfile?.name || 'Valued Client'}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{userProfile?.email}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100 text-xs">
                  <div className="flex justify-between items-center bg-green-50/60 p-3 rounded-xl border border-green-200">
                    <span className="font-bold text-green-900">Verified Mobile</span>
                    <span className="font-semibold text-black flex items-center space-x-1">
                      <span>{userProfile?.phone || 'Not verified'}</span>
                      <span className="text-[9px] bg-green-600 text-white font-bold px-1.5 py-0.5 rounded-full">✓ Verified</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-blue-50/60 p-3 rounded-xl border border-blue-200">
                    <span className="font-bold text-blue-900">Verified Email</span>
                    <span className="font-semibold text-black flex items-center space-x-1">
                      <span>{userProfile?.email}</span>
                      <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded-full">✓ Verified</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Comprehensive Details Card */}
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-premium border border-gold/15 space-y-6">
                <h3 className="text-xl font-heading text-maroon font-bold border-b border-gold/20 pb-3">Personal & Contact Info</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-cream/20 p-4 rounded-2xl border border-gold/10 space-y-1">
                    <span className="font-bold text-gray-400 block text-[10px] uppercase">Full Name</span>
                    <span className="font-bold text-maroon text-sm">{userProfile?.name || 'N/A'}</span>
                  </div>

                  <div className="bg-cream/20 p-4 rounded-2xl border border-gold/10 space-y-1">
                    <span className="font-bold text-gray-400 block text-[10px] uppercase">Primary Mobile Number</span>
                    <span className="font-bold text-black text-sm">{userProfile?.phone || 'N/A'}</span>
                  </div>

                  <div className="bg-cream/20 p-4 rounded-2xl border border-gold/10 space-y-1">
                    <span className="font-bold text-gray-400 block text-[10px] uppercase">Alternate Contact Number</span>
                    <span className="font-semibold text-gray-700 text-xs">{userProfile?.altPhone || 'Not provided'}</span>
                  </div>

                  <div className="bg-cream/20 p-4 rounded-2xl border border-gold/10 space-y-1">
                    <span className="font-bold text-gray-400 block text-[10px] uppercase">Gender / Pronoun</span>
                    <span className="font-semibold text-gray-700 text-xs">{userProfile?.gender || 'Female'}</span>
                  </div>

                  <div className="bg-cream/20 p-4 rounded-2xl border border-gold/10 space-y-1">
                    <span className="font-bold text-gray-400 block text-[10px] uppercase">Date of Birth</span>
                    <span className="font-semibold text-gray-700 text-xs">{userProfile?.dob ? new Date(userProfile.dob).toLocaleDateString() : 'Not provided'}</span>
                  </div>

                  <div className="bg-cream/20 p-4 rounded-2xl border border-gold/10 space-y-1">
                    <span className="font-bold text-gray-400 block text-[10px] uppercase">Anniversary Date</span>
                    <span className="font-semibold text-gray-700 text-xs">{userProfile?.anniversaryDate ? new Date(userProfile.anniversaryDate).toLocaleDateString() : 'Not provided'}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-1">
                  <span className="font-bold text-gray-500 block text-[10px] uppercase">Primary Shipping Address</span>
                  <p className="text-gray-800 font-medium leading-relaxed">
                    {userProfile?.address || 'No primary delivery address saved.'}
                  </p>
                </div>
              </div>
            </div>

            {/* PREVIOUS ORDERS BREAKDOWN */}
            <div className="bg-white p-8 rounded-3xl shadow-premium border border-gold/15 space-y-6">
              <div className="flex justify-between items-center border-b border-gold/20 pb-4">
                <div>
                  <h3 className="text-xl font-heading text-maroon font-bold">Previous Orders Breakdown</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Comprehensive history of past saree purchases and status logs.</p>
                </div>
                <span className="text-xs font-bold text-maroon bg-cream px-3 py-1 rounded-full border border-gold/30">
                  Total Orders: {orders.length}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">
                  No orders placed yet. <Link to="/shop" className="text-maroon font-bold underline">Explore Saree Boutique</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 uppercase font-bold tracking-wider">
                        <th className="py-3 px-2">Order ID</th>
                        <th className="py-3 px-2">Order Date</th>
                        <th className="py-3 px-2">Est. Delivery</th>
                        <th className="py-3 px-2">Payment Method</th>
                        <th className="py-3 px-2">Grand Total</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(ord => (
                        <tr key={ord.orderId} className="border-b border-gray-100 hover:bg-cream/20 transition">
                          <td className="py-3 px-2 font-mono font-bold text-maroon">{ord.orderId}</td>
                          <td className="py-3 px-2 font-medium">{new Date(ord.orderDate).toLocaleDateString('en-IN')}</td>
                          <td className="py-3 px-2 text-gray-700 font-semibold">{new Date(ord.estimatedDelivery).toLocaleDateString('en-IN')}</td>
                          <td className="py-3 px-2 font-semibold text-purple-900">{ord.paymentMethod}</td>
                          <td className="py-3 px-2 font-bold text-maroon">₹{ord.grandTotal.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              ord.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              ord.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-cream text-maroon border border-gold/30'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right space-x-2">
                            <button
                              onClick={() => generateInvoice(ord)}
                              className="text-[10px] border border-maroon text-maroon hover:bg-maroon hover:text-white font-bold py-1 px-3 rounded-full transition"
                            >
                              PDF Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. MY ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-8 max-w-5xl">
            <h1 className="text-3xl font-heading text-maroon font-bold">My Orders ({orders.length})</h1>
            
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-premium border border-gold/10 text-gray-500">
                You haven't placed any orders yet. <Link to="/shop" className="text-maroon font-semibold underline">Explore our saree collections</Link>.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.orderId} className="bg-white rounded-2xl shadow-premium border border-gold/10 overflow-hidden flex flex-col md:flex-row relative">
                    <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100 flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Order Date</span>
                          <span className="font-medium text-black">{new Date(order.orderDate).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="text-right mr-28">
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Total Amount</span>
                          <span className="font-bold text-maroon text-lg">₹{order.grandTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <img src={item.image} alt={item.name} className="w-14 h-16 object-cover rounded shadow-sm border border-gold/20" />
                            <div>
                              <h4 className="font-heading font-semibold text-maroon text-sm">{item.name}</h4>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} &nbsp;|&nbsp; ₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 md:w-64 bg-gray-50 flex flex-col justify-center space-y-2.5">
                      <button
                        onClick={() => generateInvoice(order)}
                        className="w-full bg-maroon text-white hover:bg-gold font-bold py-2 rounded-full text-xs transition"
                      >
                        Download PDF Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. CART TAB */}
        {activeTab === 'cart' && (
          <div className="space-y-8 max-w-5xl">
            <h1 className="text-3xl font-heading text-maroon font-bold">Shopping Cart ({cart.length})</h1>
            {cart.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-premium border border-gold/10 flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg" />
                      <div className="flex-grow">
                        <h4 className="font-heading font-semibold text-maroon">{item.name}</h4>
                        <span className="text-xs text-gray-400 block mb-2">{item.category}</span>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="border px-2 rounded">-</button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="border px-2 rounded">+</button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-maroon">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline mt-2">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10 h-fit space-y-6">
                  <h3 className="text-lg font-heading text-maroon border-b border-gold/20 pb-2">Order Summary</h3>
                  <div className="flex justify-between font-bold text-lg text-maroon">
                    <span>Total Amount:</span>
                    <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <button onClick={() => navigate('/checkout')} className="w-full bg-maroon hover:bg-gold text-white font-semibold py-3 rounded-full transition shadow-md">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gold/10 text-gray-500">
                Your cart is empty. <Link to="/shop" className="text-maroon font-semibold underline">Browse Shop</Link>.
              </div>
            )}
          </div>
        )}

        {/* 4. WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="space-y-8 max-w-5xl">
            <h1 className="text-3xl font-heading text-maroon font-bold">Saved Wishlist ({wishlist.length})</h1>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {wishlist.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl shadow-premium border border-gold/10 flex flex-col justify-between">
                    <img src={item.image} alt={item.name} className="w-full aspect-[3/4] object-cover rounded-xl" />
                    <h4 className="font-heading font-semibold text-maroon mt-3">{item.name}</h4>
                    <p className="font-bold text-maroon text-sm mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                    <div className="flex justify-between items-center mt-4">
                      <button onClick={() => removeFromWishlist(item.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                      <Link to={`/product/${item.id}`} className="text-xs bg-gold text-maroon font-semibold py-1 px-3 rounded-full hover:bg-maroon hover:text-white transition">View Item</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gold/10 text-gray-500">
                Your wishlist is empty. Explore items in our <Link to="/shop" className="text-maroon font-semibold underline">Shop</Link>.
              </div>
            )}
          </div>
        )}

        {/* 5. SAVED ADDRESSES TAB */}
        {activeTab === 'address' && (
          <div className="space-y-8 max-w-5xl">
            <div className="flex justify-between items-center border-b border-gold/20 pb-4">
              <div>
                <h1 className="text-3xl font-heading text-maroon font-bold">Saved Delivery Addresses</h1>
                <p className="text-xs text-gray-500 mt-0.5">Manage multiple shipping destinations for fast checkout.</p>
              </div>
              <button
                onClick={() => setShowAddAddressModal(true)}
                className="bg-maroon hover:bg-gold text-white font-bold text-xs px-5 py-2.5 rounded-full transition shadow flex items-center space-x-2"
              >
                <FiPlus />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Addresses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(userProfile?.addresses && userProfile.addresses.length > 0) ? (
                userProfile.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-white p-6 rounded-3xl border transition duration-300 relative flex flex-col justify-between ${
                      addr.isDefault 
                        ? 'border-maroon shadow-md ring-2 ring-gold/40' 
                        : 'border-gold/20 hover:border-gold shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-maroon/10 text-maroon text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-gold/30">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="bg-green-100 text-green-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            Default Shipping Address
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-black leading-relaxed">
                        {addr.street}
                      </p>
                      {addr.landmark && <p className="text-xs text-gray-500 font-light mt-1">Landmark: {addr.landmark}</p>}
                      <p className="text-xs text-gray-700 font-medium mt-1">
                        {addr.city}, {addr.state} - <span className="font-mono">{addr.pincode}</span>
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100 text-xs">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-maroon font-bold hover:text-gold transition text-[11px]"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-gray-400 font-medium text-[11px]">Primary Choice</span>
                      )}

                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-red-500 hover:text-red-700 transition flex items-center space-x-1"
                        title="Delete Address"
                      >
                        <FiTrash2 />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center space-y-3">
                  <FiMapPin className="mx-auto text-3xl text-gray-400" />
                  <p className="text-xs text-gray-500 font-light">No saved addresses found. Add a delivery address for fast checkout.</p>
                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="inline-block bg-maroon text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-gold transition shadow-sm"
                  >
                    Add Your First Address
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. ACCOUNT SECURITY & PASSWORD TAB */}
        {activeTab === 'security' && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <h1 className="text-3xl font-heading text-maroon font-bold">Manage Password & Security</h1>
              <p className="text-xs text-gray-500 font-light mt-1">Update your account credentials and review connected login methods.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Connected Accounts Card */}
              <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-premium space-y-4">
                <h3 className="font-heading text-base text-maroon font-bold border-b border-gold/20 pb-2">
                  Connected Login Methods
                </h3>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-cream/30 rounded-xl border border-gold/10">
                    <span className="font-semibold text-gray-800">Email & Password</span>
                    <span className="text-green-600 font-bold">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-cream/30 rounded-xl border border-gold/10">
                    <span className="font-semibold text-gray-800">Google OAuth SSO</span>
                    <span className="text-blue-600 font-bold">Connected</span>
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-[11px] text-purple-900 space-y-1">
                  <p className="font-bold">🔒 Multi-Factor Protected</p>
                  <p className="text-gray-600">Your account is secured with SMS OTP mobile verification.</p>
                </div>
              </div>

              {/* Change Password Form */}
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gold/15 shadow-premium space-y-6">
                <h3 className="font-heading text-xl text-maroon font-bold border-b border-gold/20 pb-3">
                  Change Password
                </h3>

                {passwordMessage && (
                  <div className={`p-4 rounded-xl text-xs border ${
                    passwordMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    {passwordMessage.text}
                  </div>
                )}

                <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-600 uppercase mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-600 uppercase mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Minimum 6 characters"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-600 uppercase mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Re-enter new password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-maroon hover:bg-gold text-white font-bold py-3 px-8 rounded-full transition shadow-md uppercase tracking-wider text-[11px]"
                  >
                    Update Password
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* 7. HELP & SUPPORT TAB */}
        {activeTab === 'support' && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <h1 className="text-3xl font-heading text-maroon font-bold">Help & Support Concierge</h1>
              <p className="text-xs text-gray-500 font-light mt-1">Direct support for order status, custom weaving, or silk mark authentication.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a 
                href="https://wa.me/919876543210?text=Hello%20Indrani%20Paithani%20Support!%20I%20need%20help%20with%20my%20account."
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] text-white p-6 rounded-2xl shadow hover:opacity-90 transition block space-y-2"
              >
                <div className="text-3xl">💬</div>
                <h4 className="font-bold text-base">WhatsApp Concierge</h4>
                <p className="text-xs text-white/90">Chat directly with our Paithani saree specialists</p>
              </a>

              <a 
                href="tel:+919876543210"
                className="bg-maroon text-gold p-6 rounded-2xl shadow hover:opacity-90 transition block space-y-2"
              >
                <div className="text-3xl">📞</div>
                <h4 className="font-bold text-base">Call +91 9876543210</h4>
                <p className="text-xs text-gold/80">Mon - Sun (9:00 AM - 9:00 PM IST)</p>
              </a>
            </div>
          </div>
        )}

      </main>

      {/* EDIT PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowEditProfileModal(false)}
              className="absolute top-4 right-4 bg-maroon text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-gold transition"
            >
              ✕
            </button>

            <h3 className="font-heading text-2xl text-maroon font-bold border-b border-gold/20 pb-3">Edit Profile Details</h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.firstName}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.lastName}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">Mobile Phone (+91)</label>
                  <input
                    type="text"
                    value={editProfileForm.phone}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">Alternate Phone</label>
                  <input
                    type="text"
                    value={editProfileForm.altPhone}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, altPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">Gender</label>
                  <select
                    value={editProfileForm.gender}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary / Other">Non-binary / Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={editProfileForm.dob}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, dob: e.target.value })}
                    className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">Anniversary</label>
                  <input
                    type="date"
                    value={editProfileForm.anniversaryDate}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, anniversaryDate: e.target.value })}
                    className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 border border-gray-300 py-3 rounded-full hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex-1 bg-maroon hover:bg-gold text-white font-bold py-3 rounded-full transition shadow-md"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AVATAR SELECTOR MODAL */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowAvatarModal(false)}
              className="absolute top-4 right-4 bg-maroon text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-gold transition"
            >
              ✕
            </button>

            <h3 className="font-heading text-xl text-maroon font-bold border-b border-gold/20 pb-2">Select Profile Avatar</h3>

            <div className="grid grid-cols-2 gap-4">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectAvatar(preset.url)}
                  className="p-3 border rounded-2xl hover:border-gold hover:bg-cream/20 flex flex-col items-center space-y-2 transition"
                >
                  <img src={preset.url} alt={preset.name} className="w-16 h-16 rounded-full object-cover shadow border border-gold" />
                  <span className="text-xs font-bold text-gray-700">{preset.name}</span>
                </button>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <label className="block text-xs font-bold text-gray-600 uppercase">Or Enter Custom Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://..."
                  value={customAvatarInput}
                  onChange={(e) => setCustomAvatarInput(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <button
                  onClick={() => {
                    if (customAvatarInput.trim()) handleSelectAvatar(customAvatarInput.trim());
                  }}
                  className="bg-maroon text-white text-xs px-4 py-2 rounded-xl font-bold hover:bg-gold transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD ADDRESS MODAL */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowAddAddressModal(false)}
              className="absolute top-4 right-4 bg-maroon text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-gold transition"
            >
              ✕
            </button>

            <h3 className="font-heading text-xl text-maroon font-bold border-b border-gold/20 pb-2">Add Delivery Address</h3>

            <form onSubmit={handleAddAddressSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 uppercase mb-1">Address Type / Label</label>
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewAddressForm({ ...newAddressForm, label: lbl })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        newAddressForm.label === lbl ? 'bg-maroon text-white border-maroon' : 'bg-white border-gray-200 text-gray-700 hover:border-gold'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 uppercase mb-1">Flat / Building / Street *</label>
                <textarea
                  rows={2}
                  required
                  value={newAddressForm.street}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, street: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="e.g. Flat 402, Royal Palms Apartment, MG Road"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">Landmark</label>
                  <input
                    type="text"
                    value={newAddressForm.landmark}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, landmark: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="e.g. Near Library"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    value={newAddressForm.pincode}
                    onChange={handleAddressPincodeChange}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold font-bold"
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.city}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 uppercase mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.state}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={newAddressForm.isDefault}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, isDefault: e.target.checked })}
                  className="rounded text-maroon accent-maroon w-4 h-4"
                />
                <span className="text-xs font-semibold text-gray-700">Set as Primary Default Delivery Address</span>
              </label>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 border border-gray-300 py-3 rounded-full hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-maroon hover:bg-gold text-white font-bold py-3 rounded-full transition shadow-md"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BuyerDashboard;
