class CartService {
  static CART_KEY = 'cart';

  static async getCart() {
    return new Promise((resolve) => {
      const cart = JSON.parse(localStorage.getItem(this.CART_KEY) || '[]');
      resolve(cart);
    });
  }

  static async saveCart(cart) {
    return new Promise((resolve) => {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
      resolve(cart);
    });
  }

  static async addToCart(product, quantity = 1) {
    return new Promise(async (resolve) => {
      const cart = await this.getCart();
      const existing = cart.find(item => item.id === product.id);
      
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }
      
      await this.saveCart(cart);
      resolve(cart);
    });
  }

  static async removeFromCart(productId) {
    return new Promise(async (resolve) => {
      let cart = await this.getCart();
      cart = cart.filter(item => item.id !== productId);
      await this.saveCart(cart);
      resolve(cart);
    });
  }

  static async updateQuantity(productId, quantity) {
    return new Promise(async (resolve) => {
      if (quantity < 1) return resolve(await this.getCart());
      
      const cart = await this.getCart();
      const updated = cart.map(item => item.id === productId ? { ...item, quantity } : item);
      await this.saveCart(updated);
      resolve(updated);
    });
  }

  static async clearCart() {
    return new Promise((resolve) => {
      localStorage.removeItem(this.CART_KEY);
      resolve([]);
    });
  }
}

export default CartService;
