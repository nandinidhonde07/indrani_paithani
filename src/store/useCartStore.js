import { create } from 'zustand';
import CartService from '../services/CartService';
import WishlistService from '../services/WishlistService';

const useCartStore = create((set, get) => ({
  cart: [],
  wishlist: [],
  isInitialized: false,

  initStore: async () => {
    if (get().isInitialized) return;
    const cart = await CartService.getCart();
    const wishlist = await WishlistService.getWishlist();
    set({ cart, wishlist, isInitialized: true });
  },

  addToCart: async (product, quantity = 1) => {
    const updated = await CartService.addToCart(product, quantity);
    set({ cart: updated });
  },

  removeFromCart: async (productId) => {
    const updated = await CartService.removeFromCart(productId);
    set({ cart: updated });
  },

  updateQuantity: async (productId, quantity) => {
    const updated = await CartService.updateQuantity(productId, quantity);
    set({ cart: updated });
  },

  clearCart: async () => {
    const updated = await CartService.clearCart();
    set({ cart: updated });
  },

  toggleWishlist: async (product) => {
    const updated = await WishlistService.toggleWishlist(product);
    set({ wishlist: updated });
  }
}));

export default useCartStore;
