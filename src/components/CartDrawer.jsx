import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import useCartStore from '../store/useCartStore.js';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  if (!isOpen) return null;

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in text-black">
      <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl relative">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-gold/20 flex justify-between items-center bg-cream/30">
          <div className="flex items-center space-x-2">
            <FiShoppingBag className="text-maroon text-xl" />
            <h3 className="font-heading text-xl text-maroon font-bold">
              Shopping Bag ({totalItemsCount})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-maroon hover:text-white flex items-center justify-center transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="p-6 flex-grow overflow-y-auto space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="flex space-x-4 border-b border-gray-100 pb-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-xl border border-gold/20 shrink-0"
                />
                <div className="flex-grow space-y-1">
                  <h4 className="font-semibold text-xs text-maroon line-clamp-1">{item.name}</h4>
                  <span className="text-[10px] text-gray-400 block uppercase">{item.category}</span>
                  <div className="flex items-center space-x-3 pt-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-cream"
                    >
                      <FiMinus size={10} />
                    </button>
                    <span className="text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-cream"
                    >
                      <FiPlus size={10} />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-xs text-black">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[10px] text-red-500 hover:underline mt-2 block"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 space-y-3">
              <FiShoppingBag className="mx-auto text-4xl text-gray-300" />
              <p className="text-gray-500 text-sm font-light">Your luxury shopping bag is currently empty.</p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/shop');
                }}
                className="inline-block bg-maroon text-white text-xs px-6 py-2.5 rounded-full font-bold hover:bg-gold transition"
              >
                Browse Saree Boutique
              </button>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gold/20 space-y-4 bg-cream/20">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Insured Shipping Across India</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-base text-maroon pt-2 border-t border-gold/10">
                <span>Subtotal:</span>
                <span>₹{calculateSubtotal().toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className="w-full bg-maroon hover:bg-gold text-white font-bold py-3.5 rounded-full transition text-center flex items-center justify-center space-x-2 text-xs shadow-lg"
            >
              <span>Proceed to Checkout</span>
              <FiArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
