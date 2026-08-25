import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OrderService from '../services/OrderService.js';
import UserService from '../services/UserService.js';
import useCartStore from '../store/useCartStore.js';
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

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const cart = useCartStore(state => state.cart);
  const wishlist = useCartStore(state => state.wishlist);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const removeFromWishlist = useCartStore(state => state.toggleWishlist); // toggle will remove it if it exists

  const [userProfile, setUserProfile] = useState(null);
  const [address, setAddress] = useState('');
  const [newAddress, setNewAddress] = useState('');
  
  // Orders & Tracking State
  const [orders, setOrders] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    UserService.getCurrentUser().then(user => {
      if (user) {
        setUserProfile(user);
        setAddress(user.address || 'Yeola, Nashik, Maharashtra - 423401');
      } else {
        setUserProfile({ name: 'Guest Valued Buyer', email: 'guest@example.com' });
      }
    });
  }, []);

  // Load Orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userProfile) return;
      const email = userProfile.email;
      const fetchedOrders = await OrderService.getBuyerOrders(email);
      setOrders(fetchedOrders);
      
      // Generate mock notifications based on recent timeline events
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
    if (activeTab === 'orders' || activeTab === 'profile') {
      fetchOrders();
    }
  }, [activeTab, userProfile]);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('currentUser');
    navigate('/buyer-login');
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

  const checkoutSimulation = () => {
    navigate('/checkout');
  };

  // Re-purchase logic
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

  // Order Cancel logic
  const handleCancelOrder = async (orderId) => {
    if(window.confirm("Are you sure you want to cancel this order?")) {
      await OrderService.updateOrderStatus(orderId, 'Cancelled', 'Order was cancelled by buyer.');
      const updatedOrders = await OrderService.getBuyerOrders(userProfile.email);
      setOrders(updatedOrders);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row relative">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-maroon text-white p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="border-b border-gold/30 pb-4">
            <h2 className="text-xl font-heading text-gold tracking-widest">MY LUXURY</h2>
            <p className="text-xs text-cream/70 font-light mt-1">{userProfile?.name}</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'orders', label: 'My Orders' },
              { id: 'cart', label: `Cart (${cart.length})` },
              { id: 'wishlist', label: `Wishlist (${wishlist.length})` },
              { id: 'profile', label: 'My Profile' },
              { id: 'address', label: 'Saved Address' }
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

        {activeTab === 'orders' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">My Purchase History</h2>
            
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-premium border border-gold/10 text-gray-500">
                You haven't placed any orders yet. <Link to="/shop" className="text-maroon underline">Explore our collections</Link>.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.orderId} className="bg-white rounded-2xl shadow-premium border border-gold/10 overflow-hidden flex flex-col md:flex-row relative">
                    
                    {/* Status Ribbon */}
                    <div className="absolute top-4 right-4 bg-cream/80 backdrop-blur-sm border border-gold text-maroon text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest z-10">
                      {order.status}
                    </div>

                    <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100 flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Order Placed</span>
                          <span className="font-medium text-black">{new Date(order.orderDate).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}</span>
                        </div>
                        <div className="text-right mr-16 md:mr-24">
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Total Amount</span>
                          <span className="font-bold text-maroon">₹{order.grandTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-4">
                        <span className="font-semibold text-gray-700">Order ID:</span> {order.orderId} &nbsp;&nbsp;|&nbsp;&nbsp; 
                        <span className="font-semibold text-gray-700">Payment:</span> {order.paymentMethod}
                      </div>

                      {/* Items */}
                      <div className="space-y-4">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded shadow-sm border border-gold/20" />
                            <div>
                              <h4 className="font-heading font-semibold text-maroon text-sm hover:text-gold transition">
                                <Link to={`/product/${item.id}`}>{item.name}</Link>
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} &nbsp;|&nbsp; ₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 md:w-64 bg-gray-50 flex flex-col justify-center space-y-3">
                      <button 
                        onClick={() => setTrackingOrder(order)}
                        className="w-full bg-maroon hover:bg-gold text-white font-semibold py-2.5 rounded-full text-xs transition shadow"
                      >
                        Track Order
                      </button>
                      <button 
                        onClick={() => generateInvoice(order)}
                        className="w-full bg-white border border-maroon hover:bg-cream text-maroon font-semibold py-2.5 rounded-full text-xs transition"
                      >
                        Download Invoice
                      </button>
                      <button 
                        onClick={() => handleBuyAgain(order)}
                        className="w-full bg-white border border-gray-300 hover:border-gold hover:text-gold text-gray-600 font-semibold py-2.5 rounded-full text-xs transition"
                      >
                        Buy It Again
                      </button>
                      {order.status === 'Order Confirmed' && (
                        <button 
                          onClick={() => handleCancelOrder(order.orderId)}
                          className="w-full text-red-500 hover:text-red-700 font-semibold py-1 text-[10px] uppercase tracking-wider transition mt-2"
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
                    <span className="text-green-600 font-semibold">FREE (Premium Insured)</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-4 text-maroon">
                    <span>Total Amount:</span>
                    <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <button onClick={checkoutSimulation} className="w-full bg-maroon hover:bg-gold text-white font-semibold py-3 rounded-full transition shadow-md">
                    Proceed to Secure Checkout
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gold/10 text-gray-500">
                Your cart is empty. Let's find your perfect drape in our <Link to="/shop" className="text-maroon underline font-semibold">Shop</Link>.
              </div>
            )}
          </div>
        )}

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
                      <Link to={`/product/${item.id}`} className="text-xs bg-gold text-maroon font-semibold py-1 px-3 rounded-full hover:bg-maroon hover:text-white transition">Buy Now</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gold/10 text-gray-500">
                Your wishlist is empty. Start saving items by clicking the heart button on the shop page.
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Profile Details</h2>
            <div className="bg-white p-8 rounded-2xl shadow-premium border border-gold/10 max-w-md space-y-4">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Registered Name</span>
                <p className="text-lg font-medium text-maroon mt-1">{userProfile?.name}</p>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Email Address</span>
                <p className="text-lg font-medium text-maroon mt-1">{userProfile?.email}</p>
              </div>
              <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
                Contact customer support at +91 7507755836 to request email modifications.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'address' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">Delivery Address</h2>
            <div className="bg-white p-8 rounded-2xl shadow-premium border border-gold/10 max-w-md space-y-6">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase mb-2">Saved Delivery Address</span>
                <p className="text-gray-700 font-light leading-relaxed bg-cream/30 p-4 rounded-xl border border-gold/10">
                  {address}
                </p>
              </div>

              <form onSubmit={saveAddress} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Update Address</label>
                  <input
                    type="text"
                    required
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter full physical delivery address"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                  />
                </div>
                <button type="submit" className="bg-maroon hover:bg-gold text-white font-semibold py-2 px-6 rounded-full text-sm transition">
                  Save New Address
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

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

              {/* AMAZON STYLE TIMELINE */}
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-4">
                {TIMELINE_STAGES.map((stage, idx) => {
                  
                  // Check if this stage exists in the order's timeline array
                  const event = trackingOrder.timeline?.find(t => t.status === stage);
                  
                  // If the order is cancelled, we stop the timeline logic
                  if (trackingOrder.status === 'Cancelled' && idx > 0) return null;

                  const isCompleted = !!event;
                  
                  // Special red styling for cancelled
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
                      {/* Timeline Dot */}
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
