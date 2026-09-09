import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OrderService from '../services/OrderService.js';
import UserService from '../services/UserService.js';
import useCartStore from '../store/useCartStore.js';
import AuthService from '../services/AuthService.js';
import useAuthStore from '../store/useAuthStore.js';
import { generateInvoice } from '../utils/InvoiceGenerator.js';

const TIMELINE_STAGES = [
  "Order Confirmed",
  "Preparing Your Paithani",
  "Quality Inspection",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered"
];

const STATUS_DESCRIPTIONS = {
  "Order Confirmed": "Your payment or order details have been verified and assigned to our master weavers.",
  "Preparing Your Paithani": "Master artisans in Yeola are hand-weaving and crafting the pure silk and gold zari drapes.",
  "Quality Inspection": "A 24-point heritage quality audit checking thread density, zari purity, and motif perfection.",
  "Packed": "Carefully packaged in Indrani's signature moisture-proof luxury gift box.",
  "Shipped": "Dispatched via premium insured courier with real-time tracking.",
  "Out For Delivery": "Your package is out with the delivery executive and will reach your doorstep today.",
  "Delivered": "Handed over safely. Enjoy your timeless Indrani Paithani treasure!"
};

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const cart = useCartStore(state => state.cart);
  const wishlist = useCartStore(state => state.wishlist);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const removeFromWishlist = useCartStore(state => state.toggleWishlist);

  const [userProfile, setUserProfile] = useState(null);
  const [address, setAddress] = useState('');
  const [newAddress, setNewAddress] = useState('');
  
  // Profile Editing State
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    mobileVerified: true,
    email: '',
    age: '',
    gender: 'Female',
    address: '',
    emergencyContact: ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Orders & Tracking State
  const [orders, setOrders] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [viewingOrderDetails, setViewingOrderDetails] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');
  const [showStatusHelp, setShowStatusHelp] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Help & Support State
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('Order Tracking');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const fetchOrders = async () => {
    const user = await UserService.getCurrentUser();
    const email = user ? user.email : 'guest@example.com';
    const fetchedOrders = await OrderService.getBuyerOrders(email);
    setOrders(fetchedOrders);
    
    // Generate notifications
    const notifs = [];
    fetchedOrders.forEach(o => {
      if (o.timeline && o.timeline.length > 0) {
        const lastEvent = o.timeline[o.timeline.length - 1];
        notifs.push({
          id: o.orderId + lastEvent.status,
          message: `Order ${o.orderId}: ${lastEvent.message}`,
          date: lastEvent.date,
          isNew: true
        });
      }
    });
    setNotifications(notifs.sort((a,b) => new Date(b.date) - new Date(a.date)));
  };

  useEffect(() => {
    UserService.getCurrentUser().then(user => {
      if (user) {
        setUserProfile(user);
        setAddress(user.address || 'Yeola, Nashik, Maharashtra - 423401');
        setProfileForm({
          name: user.name || '',
          phone: user.phone || '',
          mobileVerified: user.mobileVerified !== false,
          email: user.email || '',
          age: user.age || '',
          gender: user.gender || 'Female',
          address: user.address || '',
          emergencyContact: user.emergencyContact || ''
        });
      } else {
        const guestUser = { name: 'Valued Client', email: 'guest@example.com', phone: '', mobileVerified: false, age: '', gender: 'Female', address: '' };
        setUserProfile(guestUser);
        setProfileForm(guestUser);
      }
    });

    fetchOrders();

    // Listen for order creation and local storage updates
    window.addEventListener('indrani_order_created', fetchOrders);
    window.addEventListener('storage', fetchOrders);
    return () => {
      window.removeEventListener('indrani_order_created', fetchOrders);
      window.removeEventListener('storage', fetchOrders);
    };
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/buyer-login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    const updated = await UserService.updateCurrentUser(profileForm);
    setUserProfile(updated);
    setIsUpdatingProfile(false);
    alert('Profile details updated successfully!');
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    if (newAddress.trim()) {
      const updatedUser = await UserService.updateCurrentUser({ address: newAddress });
      setAddress(updatedUser.address);
      setNewAddress('');
      alert('Delivery address updated successfully!');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const handleBuyAgain = (order) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    order.items.forEach(orderItem => {
      const existing = currentCart.find(c => c.id === orderItem.id);
      if (existing) existing.quantity += orderItem.quantity;
      else currentCart.push(orderItem);
    });
    localStorage.setItem('cart', JSON.stringify(currentCart));
    alert("Items added to your cart!");
    setActiveTab('cart');
  };

  const confirmCancelOrder = async () => {
    if (!cancellingOrder) return;
    await OrderService.updateOrderStatus(
      cancellingOrder.orderId, 
      'Cancelled', 
      `Order cancelled by buyer. Reason: ${cancelReason}`
    );
    setCancellingOrder(null);
    fetchOrders();
    alert("Your order has been cancelled successfully.");
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (supportMessage.trim()) {
      setSupportSubmitted(true);
      setTimeout(() => setSupportSubmitted(false), 5000);
      setSupportMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row relative">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-maroon text-white p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="border-b border-gold/30 pb-4">
            <h2 className="text-xl font-heading text-gold tracking-widest">MY LUXURY</h2>
            <p className="text-xs text-cream/70 font-light mt-1 truncate">{userProfile?.name || 'Valued Client'}</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'orders', label: `My Orders (${orders.length})` },
              { id: 'cart', label: `Cart (${cart.length})` },
              { id: 'wishlist', label: `Wishlist (${wishlist.length})` },
              { id: 'profile', label: 'My Profile' },
              { id: 'address', label: 'Saved Address' },
              { id: 'support', label: 'Help & Support' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left py-2.5 px-4 rounded-xl font-light text-sm transition ${
                  activeTab === tab.id ? 'bg-gold text-maroon font-semibold shadow-sm' : 'hover:bg-gold/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <button onClick={handleLogout} className="mt-8 bg-black/30 hover:bg-black/50 text-white text-sm py-3 rounded-xl transition font-semibold">
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto relative">
        
        {/* Notifications Bell */}
        <div className="absolute top-6 right-6 md:top-12 md:right-12 z-40">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 bg-white rounded-full shadow-md border border-gold/20 hover:shadow-lg transition"
          >
            <svg className="w-6 h-6 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gold/10 overflow-hidden">
              <div className="bg-maroon text-gold px-4 py-3 font-heading font-semibold text-sm">Recent Updates</div>
              <div className="max-h-64 overflow-y-auto p-2">
                {notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id} className="p-3 border-b border-gray-100 last:border-0 hover:bg-cream/30 transition">
                    <p className="text-xs text-gray-800 font-medium">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(n.date).toLocaleString()}</p>
                  </div>
                )) : (
                  <div className="p-4 text-center text-xs text-gray-500">No new notifications.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* MY ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-heading text-maroon">My Purchase History</h2>
                <p className="text-xs text-gray-500 mt-1">Track, manage, or download invoices for your royal Paithanis.</p>
              </div>
              <button 
                onClick={() => setShowStatusHelp(true)}
                className="text-xs border border-maroon text-maroon hover:bg-maroon hover:text-white px-4 py-2 rounded-full transition font-semibold"
              >
                ❓ Order Status Guide
              </button>
            </div>
            
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-premium border border-gold/10 text-gray-500">
                You haven't placed any orders yet. <Link to="/shop" className="text-maroon font-semibold underline">Explore our saree collections</Link>.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.orderId} className="bg-white rounded-2xl shadow-premium border border-gold/10 overflow-hidden flex flex-col md:flex-row relative">
                    
                    {/* Status Ribbon */}
                    <div className={`absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest z-10 ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700 border border-green-200' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                      'bg-cream/80 border border-gold text-maroon'
                    }`}>
                      {order.status}
                    </div>

                    <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100 flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Order Date</span>
                          <span className="font-medium text-black">{new Date(order.orderDate).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}</span>
                        </div>
                        <div className="text-right mr-20 md:mr-28">
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Total Amount</span>
                          <span className="font-bold text-maroon text-lg">₹{order.grandTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-4 flex flex-wrap gap-2 items-center">
                        <span className="font-semibold text-gray-700">ID:</span> <span className="font-mono">{order.orderId}</span>
                        <span>•</span>
                        <span className="font-semibold text-gray-700">Payment:</span> {order.paymentMethod}
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <img src={item.image} alt={item.name} className="w-14 h-16 object-cover rounded shadow-sm border border-gold/20" />
                            <div>
                              <h4 className="font-heading font-semibold text-maroon text-sm hover:text-gold transition">
                                <Link to={`/product/${item.id}`}>{item.name}</Link>
                              </h4>
                              <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} &nbsp;|&nbsp; ₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 md:w-64 bg-gray-50 flex flex-col justify-center space-y-2.5">
                      <button 
                        onClick={() => setTrackingOrder(order)}
                        className="w-full bg-maroon hover:bg-gold text-white font-semibold py-2 rounded-full text-xs transition shadow"
                      >
                        Track Progress
                      </button>
                      <button 
                        onClick={() => setViewingOrderDetails(order)}
                        className="w-full bg-white border border-gray-300 hover:border-gold text-gray-700 font-semibold py-2 rounded-full text-xs transition"
                      >
                        View Order Details
                      </button>
                      <button 
                        onClick={() => generateInvoice(order)}
                        className="w-full bg-white border border-maroon text-maroon hover:bg-cream font-semibold py-2 rounded-full text-xs transition"
                      >
                        Download Invoice (PDF)
                      </button>
                      <button 
                        onClick={() => handleBuyAgain(order)}
                        className="w-full bg-cream border border-gold/40 text-maroon hover:bg-gold hover:text-white font-semibold py-2 rounded-full text-xs transition"
                      >
                        Buy It Again
                      </button>
                      {order.status === 'Order Confirmed' && (
                        <button 
                          onClick={() => setCancellingOrder(order)}
                          className="w-full text-red-500 hover:text-red-700 font-semibold py-1 text-[10px] uppercase tracking-wider transition"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CART TAB */}
        {activeTab === 'cart' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Your Shopping Cart</h2>
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
                  <div className="flex justify-between font-medium">
                    <span>Subtotal:</span>
                    <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Shipping:</span>
                    <span className="text-green-600 font-semibold">FREE (Insured Express)</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-4 text-maroon">
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
                Your cart is empty. <Link to="/shop" className="text-maroon underline font-semibold">Browse Shop</Link>.
              </div>
            )}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">My Saved Masterpieces</h2>
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

        {/* MY PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-heading text-maroon">Verified Customer Profile</h2>
              <p className="text-xs text-gray-500 mt-1">Manage your verified credentials, demographic info, and order history.</p>
            </div>

            {/* Customer Summary & Identity Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Identity & Demographics Card */}
              <div className="bg-white p-8 rounded-3xl shadow-premium border border-gold/10 space-y-6 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-heading text-maroon font-bold">{userProfile?.name || 'Valued Client'}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{userProfile?.email}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-green-200">
                    ✓ Verified Client
                  </span>
                </div>

                <div className="space-y-4 text-xs pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                    <span className="font-bold text-purple-900">Mobile Number:</span>
                    <span className="font-semibold text-black flex items-center space-x-1">
                      <span>{userProfile?.phone || 'Not verified'}</span>
                      {userProfile?.phone && (
                        <span className="text-[9px] bg-green-600 text-white font-bold px-1.5 py-0.5 rounded-full ml-1">✓ OTP</span>
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-cream/30 p-3 rounded-xl border border-gold/10">
                      <span className="font-bold text-gray-400 block text-[10px] uppercase">Age</span>
                      <span className="font-semibold text-maroon text-sm">{userProfile?.age ? `${userProfile.age} Years` : 'Not specified'}</span>
                    </div>
                    <div className="bg-cream/30 p-3 rounded-xl border border-gold/10">
                      <span className="font-bold text-gray-400 block text-[10px] uppercase">Gender</span>
                      <span className="font-semibold text-maroon text-sm">{userProfile?.gender || 'Female'}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-400 block text-[10px] uppercase mb-1">Primary Delivery Address</span>
                    <p className="text-gray-700 font-medium leading-relaxed">{address}</p>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form */}
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-premium border border-gold/10 space-y-6">
                <h3 className="text-xl font-heading text-maroon font-bold border-b border-gold/20 pb-3">Update Customer Credentials</h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mobile Number (Verified)</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Age</label>
                      <input
                        type="number"
                        min="18"
                        max="100"
                        value={profileForm.age}
                        onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                        className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Gender</label>
                      <select
                        value={profileForm.gender}
                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                        className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Default Delivery Address</label>
                    <textarea
                      rows={2}
                      value={profileForm.address}
                      onChange={(e) => {
                        setProfileForm({ ...profileForm, address: e.target.value });
                        setAddress(e.target.value);
                      }}
                      className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isUpdatingProfile}
                    className="bg-maroon hover:bg-gold text-white font-semibold py-3 px-8 rounded-full text-sm transition shadow"
                  >
                    {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            </div>

            {/* PREVIOUS ORDERS BREAKDOWN CARD INSIDE PROFILE */}
            <div className="bg-white p-8 rounded-3xl shadow-premium border border-gold/10 space-y-6">
              <div className="flex justify-between items-center border-b border-gold/20 pb-4">
                <div>
                  <h3 className="text-xl font-heading text-maroon font-bold">Previous Orders Breakdown</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Comprehensive history of past purchases, payment methods, and delivery dates.</p>
                </div>
                <span className="text-xs font-bold text-maroon bg-cream px-3 py-1 rounded-full border border-gold/30">
                  Total Orders: {orders.length}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">
                  No previous orders found for this profile.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 uppercase font-bold tracking-wider">
                        <th className="py-3 px-2">Order ID</th>
                        <th className="py-3 px-2">Order Date</th>
                        <th className="py-3 px-2">Est. Delivery Date</th>
                        <th className="py-3 px-2">Payment Method</th>
                        <th className="py-3 px-2">Total Price</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(ord => (
                        <tr key={ord.orderId} className="border-b border-gray-100 hover:bg-cream/20 transition">
                          <td className="py-3 px-2 font-mono font-bold text-maroon">{ord.orderId}</td>
                          <td className="py-3 px-2 font-medium">{new Date(ord.orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                          <td className="py-3 px-2 text-gray-700 font-semibold">{new Date(ord.estimatedDelivery).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
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
                              onClick={() => setViewingOrderDetails(ord)}
                              className="text-[10px] bg-maroon hover:bg-gold text-white font-bold py-1 px-3 rounded-full transition"
                            >
                              Details
                            </button>
                            <button 
                              onClick={() => generateInvoice(ord)}
                              className="text-[10px] border border-maroon text-maroon hover:bg-maroon hover:text-white font-bold py-1 px-3 rounded-full transition"
                            >
                              Invoice
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

        {/* SAVED ADDRESS TAB */}
        {activeTab === 'address' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Delivery Address</h2>
            <div className="bg-white p-8 rounded-3xl shadow-premium border border-gold/10 max-w-md space-y-6">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase mb-2">Primary Saved Address</span>
                <p className="text-gray-700 font-light leading-relaxed bg-cream/30 p-4 rounded-xl border border-gold/10">
                  {address}
                </p>
              </div>

              <form onSubmit={saveAddress} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Update Address</label>
                  <textarea
                    rows={3}
                    required
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter house no, street, city, state and pincode"
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                  />
                </div>
                <button type="submit" className="bg-maroon hover:bg-gold text-white font-semibold py-3 px-6 rounded-full text-sm transition">
                  Save New Address
                </button>
              </form>
            </div>
          </div>
        )}

        {/* HELP & SUPPORT TAB (PROBLEM 5.i FIX) */}
        {activeTab === 'support' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-heading text-maroon">Help & Customer Support</h2>
              <p className="text-xs text-gray-500 mt-1">Get immediate assistance with orders, silk authentication, custom weaving, or returns.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Quick Contact Cards */}
              <div className="space-y-4">
                <a 
                  href="https://wa.me/917507755836?text=Hello%20Indrani%20Paithani%20Support%2C%20I%20need%20help%20with%20my%20account%2Forder."
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-500 text-white p-6 rounded-2xl shadow hover:bg-green-600 transition block flex items-center space-x-4"
                >
                  <div className="text-3xl">💬</div>
                  <div>
                    <h4 className="font-bold text-base">WhatsApp Concierge</h4>
                    <p className="text-xs text-white/90">Instant assistance from saree experts</p>
                  </div>
                </a>

                <a 
                  href="tel:+917507755836"
                  className="bg-maroon text-gold p-6 rounded-2xl shadow hover:bg-maroon/90 transition block flex items-center space-x-4"
                >
                  <div className="text-3xl">📞</div>
                  <div>
                    <h4 className="font-bold text-base">Call +91 7507755836</h4>
                    <p className="text-xs text-gold/80">Mon - Sun (9:00 AM - 9:00 PM IST)</p>
                  </div>
                </a>

                <div className="bg-white p-6 rounded-2xl shadow-premium border border-gold/10 flex items-center space-x-4">
                  <div className="text-3xl">✉️</div>
                  <div>
                    <h4 className="font-bold text-base text-maroon">Email Support</h4>
                    <p className="text-xs text-gray-500">nandini.dhonde1@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Submit Ticket Form */}
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-premium border border-gold/10">
                <h3 className="text-xl font-heading text-maroon font-bold mb-4">Send Us a Direct Inquiry</h3>
                
                {supportSubmitted && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm mb-4">
                    ✓ Support request submitted! Our concierge team will reach out within 2 hours.
                  </div>
                )}

                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Topic / Category</label>
                    <select
                      value={supportCategory}
                      onChange={(e) => setSupportCategory(e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                    >
                      <option value="Order Tracking">Order Tracking & Delivery Status</option>
                      <option value="Silk Authenticity">Silk Mark & Pure Zari Verification</option>
                      <option value="Custom Weaving">Custom Weaving Request</option>
                      <option value="Return / Exchange">Return, Exchange or Cancellation</option>
                      <option value="Payment Issue">Payment Verification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message / Details</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please describe your question or issue in detail..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                    />
                  </div>

                  <button type="submit" className="bg-maroon hover:bg-gold text-white font-semibold py-3 px-8 rounded-full text-sm transition">
                    Submit Support Ticket
                  </button>
                </form>

                {/* FAQ Quick Section */}
                <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                  <h4 className="font-heading font-bold text-maroon text-sm uppercase tracking-wider">Frequently Asked Questions</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="font-bold text-gray-800">Q: How long does delivery take?</p>
                      <p className="text-gray-600">Pure Paithanis are dispatched within 24-48 hours and delivered within 4-6 working days across India with insured shipping.</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Q: How do I verify pure silk authenticity?</p>
                      <p className="text-gray-600">Every Indrani Paithani comes with a handloom authenticity tag and pure silk test certification.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* DETAILED ORDER MODAL (PROBLEM 5.iii FIX) */}
      {viewingOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-maroon p-6 text-white relative flex justify-between items-center">
              <div>
                <h3 className="font-heading text-2xl tracking-wide text-gold">Order Details Breakdown</h3>
                <p className="text-xs text-cream/80">ID: {viewingOrderDetails.orderId}</p>
              </div>
              <button onClick={() => setViewingOrderDetails(null)} className="text-white/70 hover:text-white transition font-bold text-xl">✕</button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cream/20 p-4 rounded-2xl border border-gold/10 text-xs">
                <div>
                  <p className="font-bold uppercase text-gray-400 mb-1">Customer Info</p>
                  <p className="font-semibold text-black">{viewingOrderDetails.buyerName}</p>
                  <p className="text-gray-600">{viewingOrderDetails.buyerEmail}</p>
                  <p className="text-gray-600">{viewingOrderDetails.phone}</p>
                </div>
                <div>
                  <p className="font-bold uppercase text-gray-400 mb-1">Delivery Address</p>
                  <p className="text-gray-700">{viewingOrderDetails.shippingAddress}</p>
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-maroon text-base mb-3 border-b pb-2">Itemized Products</h4>
                <div className="space-y-3">
                  {viewingOrderDetails.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm">
                      <div className="flex items-center space-x-3">
                        <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded" />
                        <div>
                          <p className="font-bold text-maroon">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border text-xs space-y-2">
                <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span>₹{(viewingOrderDetails.subtotal || viewingOrderDetails.grandTotal).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-gray-600"><span>GST (5%):</span><span>₹{(viewingOrderDetails.gst || 0).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping:</span><span className="text-green-600 font-bold">FREE Insured</span></div>
                <div className="flex justify-between font-bold text-base text-maroon border-t pt-2"><span>Total Paid:</span><span>₹{viewingOrderDetails.grandTotal.toLocaleString('en-IN')}</span></div>
                <div className="pt-2 text-gray-500"><span>Payment Method:</span> <span className="font-semibold text-green-700 ml-1">{viewingOrderDetails.paymentMethod}</span></div>
              </div>

              <div className="flex gap-4">
                <a 
                  href={`https://wa.me/917507755836?text=Hello%20Support%2C%20I%20have%20a%20question%20about%20Order%20${viewingOrderDetails.orderId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full text-center text-xs transition"
                >
                  💬 Get Order Help on WhatsApp
                </a>
                <button 
                  onClick={() => generateInvoice(viewingOrderDetails)}
                  className="flex-1 bg-maroon hover:bg-gold text-white font-semibold py-3 rounded-full text-xs transition"
                >
                  Download Invoice (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CANCELLATION MODAL (PROBLEM 5.iii FIX) */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-6">
            <h3 className="font-heading text-2xl text-maroon font-bold">Cancel Order {cancellingOrder.orderId}?</h3>
            <p className="text-xs text-gray-600">Are you sure you want to cancel this order? Please select a reason:</p>
            
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon text-xs"
            >
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Want to change delivery address">Want to change delivery address</option>
              <option value="Found a different saree">Found a different saree</option>
              <option value="Price/Payment issue">Price or Payment issue</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex gap-4">
              <button onClick={() => setCancellingOrder(null)} className="flex-1 border py-3 rounded-full text-xs font-semibold hover:bg-gray-50">Keep Order</button>
              <button onClick={confirmCancelOrder} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-full text-xs font-semibold shadow">Confirm Cancellation</button>
            </div>
          </div>
        </div>
      )}

      {/* STATUS HELP GUIDE MODAL (PROBLEM 5.iii FIX) */}
      {showStatusHelp && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-maroon p-6 text-white relative">
              <button onClick={() => setShowStatusHelp(false)} className="absolute top-6 right-6 text-white/70 hover:text-white font-bold text-xl">✕</button>
              <h3 className="font-heading text-2xl tracking-wide text-gold">Order Status Guide</h3>
              <p className="text-xs text-cream/80">Understanding your Paithani's weaving & delivery journey</p>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {TIMELINE_STAGES.map((st, idx) => (
                <div key={idx} className="bg-cream/20 p-4 rounded-xl border border-gold/10 space-y-1">
                  <h4 className="font-bold text-maroon text-sm flex items-center space-x-2">
                    <span className="w-5 h-5 bg-gold text-maroon rounded-full flex items-center justify-center text-[10px]">{idx + 1}</span>
                    <span>{st}</span>
                  </h4>
                  <p className="text-gray-600 leading-relaxed pl-7">{STATUS_DESCRIPTIONS[st]}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 border-t">
              <button onClick={() => setShowStatusHelp(false)} className="w-full bg-maroon text-white font-semibold py-2.5 rounded-full text-xs">Close Guide</button>
            </div>
          </div>
        </div>
      )}

      {/* TRACKING MODAL */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-maroon p-6 text-white relative">
              <button onClick={() => setTrackingOrder(null)} className="absolute top-6 right-6 text-white/70 hover:text-white transition font-bold text-xl">✕</button>
              <h3 className="font-heading text-2xl tracking-wide text-gold mb-1">Track Order</h3>
              <p className="text-sm opacity-90">ID: {trackingOrder.orderId}</p>
            </div>

            <div className="p-8 overflow-y-auto bg-gray-50">
              <div className="mb-8">
                <p className="text-xs uppercase font-semibold text-gray-500 tracking-wider">Estimated Delivery</p>
                <p className="text-xl font-bold text-maroon">{new Date(trackingOrder.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                
                {trackingOrder.trackingNumber && (
                  <p className="text-sm mt-2 font-medium text-gray-700 bg-white inline-block px-3 py-1 rounded-lg border shadow-sm">
                    {trackingOrder.courier} Tracking ID: <span className="font-bold text-maroon">{trackingOrder.trackingNumber}</span>
                  </p>
                )}
              </div>

              {/* TIMELINE */}
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-4">
                {TIMELINE_STAGES.map((stage, idx) => {
                  const event = trackingOrder.timeline?.find(t => t.status === stage);
                  if (trackingOrder.status === 'Cancelled' && idx > 0) return null;
                  const isCompleted = !!event;
                  
                  if(trackingOrder.status === 'Cancelled' && stage === 'Order Confirmed') {
                    return (
                       <div key={idx} className="relative pl-8">
                        <div className="absolute w-6 h-6 bg-red-500 rounded-full border-4 border-gray-50 -left-[13px] flex items-center justify-center text-white text-[10px] font-bold shadow-sm z-10">✕</div>
                        <h4 className="font-bold text-red-600 text-sm uppercase tracking-wide">Order Cancelled</h4>
                        <p className="text-xs text-gray-500 mt-1">{trackingOrder.timeline[trackingOrder.timeline.length-1].message}</p>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className={`relative pl-8 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`absolute w-6 h-6 rounded-full border-4 border-gray-50 -left-[13px] flex items-center justify-center text-[10px] font-bold shadow-sm z-10 ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300'
                      }`}>
                        {isCompleted && '✓'}
                      </div>
                      
                      <h4 className={`font-bold text-sm uppercase tracking-wide ${isCompleted ? 'text-maroon' : 'text-gray-500'}`}>
                        {stage}
                      </h4>
                      
                      {isCompleted && event && (
                        <div className="mt-1">
                          <p className="text-xs text-gray-500 font-medium">{new Date(event.date).toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', weekday: 'short', month: 'short', day: 'numeric' })}</p>
                          {event.message && <p className="text-xs text-gray-600 mt-1 bg-white p-2 rounded border border-gray-100 shadow-sm inline-block">{event.message}</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
               <button onClick={() => setTrackingOrder(null)} className="w-full bg-cream border border-gold/30 hover:bg-gold/20 text-maroon font-semibold py-3 rounded-full transition">Close Tracker</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BuyerDashboard;
