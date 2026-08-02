import ActivityLogger from './ActivityLogger';

class OrderService {
  static KEY = 'indrani_orders';

  static async getOrders() {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(this.KEY);
      resolve(stored ? JSON.parse(stored) : []);
    });
  }

  static async createOrder(orderPayload) {
    const orders = await this.getOrders();
    const newOrder = {
      ...orderPayload,
      id: `ORD${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: 'New'
    };
    
    const updated = [newOrder, ...orders];
    localStorage.setItem(this.KEY, JSON.stringify(updated));
    ActivityLogger.log('Order Placed', `Order ${newOrder.id} placed for ₹${newOrder.totalAmount}`);
    
    window.dispatchEvent(new Event('orders_updated'));
    return newOrder;
  }

  static async updateOrderStatus(orderId, newStatus) {
    const orders = await this.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem(this.KEY, JSON.stringify(updated));
    ActivityLogger.log('Order Updated', `Order ${orderId} status changed to ${newStatus}`);
    
    window.dispatchEvent(new Event('orders_updated'));
    return updated;
  }
}

export default OrderService;
