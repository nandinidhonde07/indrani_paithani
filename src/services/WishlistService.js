class WishlistService {
  static WISHLIST_KEY = 'wishlist';

  static async getWishlist() {
    return new Promise((resolve) => {
      const wishlist = JSON.parse(localStorage.getItem(this.WISHLIST_KEY) || '[]');
      resolve(wishlist);
    });
  }

  static async saveWishlist(wishlist) {
    return new Promise((resolve) => {
      localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
      resolve(wishlist);
    });
  }

  static async toggleWishlist(product) {
    return new Promise(async (resolve) => {
      let wishlist = await this.getWishlist();
      const existing = wishlist.find(item => item.id === product.id);
      
      if (existing) {
        wishlist = wishlist.filter(item => item.id !== product.id);
      } else {
        wishlist.push(product);
      }
      
      await this.saveWishlist(wishlist);
      resolve(wishlist);
    });
  }
}

export default WishlistService;
