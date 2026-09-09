import productsData from '../data/products.json';
import ActivityLogger from './ActivityLogger';

class ProductService {
  static KEY = 'indrani_products';

  static async getProducts() {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(this.KEY);
      if (stored) {
        resolve(JSON.parse(stored));
      } else {
        localStorage.setItem(this.KEY, JSON.stringify(productsData));
        resolve(productsData);
      }
    });
  }

  static async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  static async saveProduct(productPayload) {
    const products = await this.getProducts();
    const isEdit = !!products.find(p => p.id === productPayload.id);
    
    let updated;
    if (isEdit) {
      updated = products.map(p => p.id === productPayload.id ? productPayload : p);
      ActivityLogger.log('Product Edited', `Updated product: ${productPayload.name}`);
    } else {
      productPayload.id = String(Date.now());
      updated = [...products, productPayload];
      ActivityLogger.log('Product Added', `Created product: ${productPayload.name}`);
    }

    localStorage.setItem(this.KEY, JSON.stringify(updated));
    return updated;
  }

  static async deleteProduct(id) {
    const products = await this.getProducts();
    const product = products.find(p => p.id === id);
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem(this.KEY, JSON.stringify(updated));
    if (product) {
       ActivityLogger.log('Product Deleted', `Deleted product: ${product.name}`);
    }
    return updated;
  }
}

export default ProductService;
