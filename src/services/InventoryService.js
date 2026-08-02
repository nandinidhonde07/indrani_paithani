import ProductService from './ProductService';
import ActivityLogger from './ActivityLogger';

class InventoryService {
  
  static async reduceStock(productId, quantity) {
    const products = await ProductService.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
      const newStock = Math.max(0, (product.stock || 0) - quantity);
      const updatedProduct = { ...product, stock: newStock };
      await ProductService.saveProduct(updatedProduct);
      
      if (newStock === 0) {
        ActivityLogger.log('Low Stock Alert', `Product ${product.name} is now OUT OF STOCK`, 'SYSTEM');
      } else if (newStock <= 2) {
        ActivityLogger.log('Low Stock Alert', `Product ${product.name} is running low on stock (${newStock} left)`, 'SYSTEM');
      }
      return true;
    }
    return false;
  }

  static async adjustStock(productId, newStockValue) {
    const products = await ProductService.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
      const updatedProduct = { ...product, stock: parseInt(newStockValue) };
      await ProductService.saveProduct(updatedProduct);
      ActivityLogger.log('Inventory Adjusted', `Stock for ${product.name} manually adjusted to ${newStockValue}`);
      return true;
    }
    return false;
  }
}

export default InventoryService;
