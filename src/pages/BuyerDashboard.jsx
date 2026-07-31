import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [userProfile, setUserProfile] = useState({ name: 'Guest Valued Buyer', email: 'buyer@indranipaithani.com' });
  const [address, setAddress] = useState('Yeola, Nashik, Maharashtra - 423401');
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    // Sync cart & wishlist from local storage
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
    setWishlist(JSON.parse(localStorage.getItem('wishlist') || '[]'));
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('currentUser');
    navigate('/buyer-login');
  };

  const removeFromCart = (id) => {
    const updated = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(updated));
    setCart(updated);
  };

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setWishlist(updated);
  };

  const updateQuantity = (id, q) => {
    if (q < 1) return;
    const updated = cart.map(item => item.id === id ? { ...item, quantity: q } : item);
    localStorage.setItem('cart', JSON.stringify(updated));
    setCart(updated);
  };

  const saveAddress = (e) => {
    e.preventDefault();
    if (newAddress.trim()) {
      setAddress(newAddress);
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

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-maroon text-white p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="border-b border-gold/30 pb-4">
            <h2 className="text-xl font-heading text-gold tracking-widest">MY LUXURY</h2>
            <p className="text-xs text-cream/70 font-light mt-1">{userProfile.name}</p>
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
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading text-maroon">My Purchase History</h2>
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gold/10 overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-2">Order ID</th>
                    <th className="py-2">Item Name</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'ORD1024', name: 'Royal Peacock Paithani', status: 'Delivered', price: 28000 }
                  ].map(ord => (
                    <tr key={ord.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 font-semibold">{ord.id}</td>
                      <td className="py-3">{ord.name}</td>
                      <td className="py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium">₹{ord.price.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                <p className="text-lg font-medium text-maroon mt-1">{userProfile.name}</p>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Email Address</span>
                <p className="text-lg font-medium text-maroon mt-1">{userProfile.email}</p>
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
    </div>
  );
};

export default BuyerDashboard;
