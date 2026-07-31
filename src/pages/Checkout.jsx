import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Cart, 2: Address, 3: Payment, 4: Summary, 5: Confirmation
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const handleNextStep = () => {
    if (step === 2) {
      if (!address.fullName || !address.phone || !address.street || !address.city || !address.pincode) {
        alert('Please fill out all address fields.');
        return;
      }
    }
    if (step === 3) {
      if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
        alert('Please fill out your card details.');
        return;
      }
    }
    if (step === 4) {
      // Place Order
      localStorage.removeItem('cart');
      setStep(5);
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="bg-cream min-h-screen py-16 px-6">
      <div className="container mx-auto max-w-4xl bg-white rounded-3xl p-8 md:p-12 shadow-premium border border-gold/10">
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-gold -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          ></div>
          
          {['Cart', 'Address', 'Payment', 'Review', 'Placed'].map((label, idx) => (
            <div key={idx} className="z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition duration-300 ${
                step > idx + 1 ? 'bg-gold text-white' :
                step === idx + 1 ? 'bg-maroon text-white border-2 border-gold' : 'bg-white text-gray-400 border border-gray-200'
              }`}>
                {idx + 1}
              </div>
              <span className={`text-[10px] uppercase font-semibold mt-2 ${step === idx + 1 ? 'text-maroon' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Dynamic Steps */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-maroon">1. Review Your Cart</h2>
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded" />
                      <div>
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-maroon">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="text-right pt-4">
                  <span className="text-gray-500 mr-4">Total Amount:</span>
                  <span className="text-2xl font-heading font-bold text-maroon">₹{calculateTotal().toLocaleString('en-IN')}</span>
                </div>
                <button
                  onClick={handleNextStep}
                  className="w-full bg-maroon hover:bg-gold text-white font-semibold py-3 rounded-full transition"
                >
                  Proceed to Delivery Address
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Your cart is empty. <Link to="/shop" className="text-maroon underline">Shop Sarees</Link>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-maroon">2. Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <input
                type="text"
                placeholder="Street Address"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="col-span-full w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="border border-gray-300 px-6 py-3 rounded-full flex-1 hover:bg-gray-50 transition">
                Back
              </button>
              <button onClick={handleNextStep} className="bg-maroon hover:bg-gold text-white font-semibold py-3 rounded-full flex-1 transition">
                Next: Payment Details
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-maroon">3. Secure Payment</h2>
            <div className="flex justify-center space-x-6 border-b pb-4">
              {['card', 'cod'].map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-6 border-b-2 font-semibold ${paymentMethod === method ? 'border-maroon text-maroon' : 'border-transparent text-gray-400'}`}
                >
                  {method === 'card' ? 'Credit / Debit Card' : 'Cash On Delivery'}
                </button>
              ))}
            </div>

            {paymentMethod === 'card' ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-cream/30 border border-gold/20 rounded-xl text-center text-sm text-gray-600">
                You can pay using Cash / UPI during shipment delivery.
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="border border-gray-300 px-6 py-3 rounded-full flex-1 hover:bg-gray-50 transition">
                Back
              </button>
              <button onClick={handleNextStep} className="bg-maroon hover:bg-gold text-white font-semibold py-3 rounded-full flex-1 transition">
                Next: Order Summary
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-maroon">4. Final Order Summary</h2>
            <div className="bg-cream/20 p-6 rounded-2xl border border-gold/10 space-y-4">
              <div>
                <h4 className="font-semibold text-maroon">Shipping Address</h4>
                <p className="text-sm text-gray-600">{address.fullName}, {address.phone}</p>
                <p className="text-sm text-gray-600">{address.street}, {address.city}, {address.pincode}</p>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold text-maroon">Payment Method</h4>
                <p className="text-sm text-gray-600 uppercase">{paymentMethod}</p>
              </div>
              <div className="border-t pt-4 space-y-2">
                <h4 className="font-semibold text-maroon">Items</h4>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg text-maroon">
                <span>Final Price:</span>
                <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(3)} className="border border-gray-300 px-6 py-3 rounded-full flex-1 hover:bg-gray-50 transition">
                Back
              </button>
              <button onClick={handleNextStep} className="bg-gold hover:bg-maroon hover:text-white font-semibold py-3 rounded-full flex-1 transition shadow-lg text-center">
                Confirm & Place Order
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h2 className="text-3xl font-heading text-maroon">Order Placed Successfully!</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Your royal drape has been ordered. An email receipt and SMS shipping details will be sent within 24 hours.
            </p>
            <Link to="/" className="inline-block bg-maroon hover:bg-gold text-white font-semibold px-8 py-3 rounded-full transition">
              Back to Home
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;
