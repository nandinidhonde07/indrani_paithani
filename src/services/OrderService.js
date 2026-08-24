// src/services/OrderService.js

/**
 * Enterprise Order Management Service
 * Currently utilizes LocalStorage for rapid prototyping and frontend-only operation.
 * Designed asynchronously to allow immediate drop-in replacement with Supabase/PostgreSQL/Firebase.
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class OrderService {
  constructor() {
    this.storageKey = 'indrani_orders';
    // Initialize if empty
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  // Helper to read from LocalStorage
  _getOrders() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Helper to write to LocalStorage
  _saveOrders(orders) {
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
  }

  /**
   * Create a new order with exhaustive tracking data
   */
  async createOrder(orderData) {
    await delay(500); // Simulate network latency

    const orders = this._getOrders();
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();

    const newOrder = {
      orderId,
      ...orderData,
      orderDate: timestamp,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // +5 days
      status: 'Order Confirmed',
      trackingNumber: null,
      courier: null,
      timeline: [
        {
          status: 'Order Confirmed',
          date: timestamp,
          message: 'Your order has been placed successfully.'
        }
      ]
    };

    orders.push(newOrder);
    this._saveOrders(orders);
    
    // Also clear the cart
    localStorage.removeItem('cart');

    return newOrder;
  }

  /**
   * Get all orders for a specific buyer
   */
  async getBuyerOrders(buyerEmail) {
    await delay(300);
    const orders = this._getOrders();
    // Sort by date descending
    return orders.filter(o => o.buyerEmail === buyerEmail).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }

  /**
   * Get all orders (for Owner Dashboard)
   */
  async getAllOrders() {
    await delay(300);
    const orders = this._getOrders();
    return orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }

  /**
   * Update the primary status of an order and append to its timeline
   */
  async updateOrderStatus(orderId, newStatus, message) {
    await delay(400);
    const orders = this._getOrders();
    const orderIndex = orders.findIndex(o => o.orderId === orderId);
    
    if (orderIndex === -1) throw new Error("Order not found");

    orders[orderIndex].status = newStatus;
    orders[orderIndex].timeline.push({
      status: newStatus,
      date: new Date().toISOString(),
      message: message || `Order status updated to ${newStatus}`
    });

    this._saveOrders(orders);
    return orders[orderIndex];
  }

  /**
   * Assign courier and tracking number
   */
  async assignTracking(orderId, courier, trackingNumber) {
    await delay(300);
    const orders = this._getOrders();
    const orderIndex = orders.findIndex(o => o.orderId === orderId);
    
    if (orderIndex === -1) throw new Error("Order not found");

    orders[orderIndex].courier = courier;
    orders[orderIndex].trackingNumber = trackingNumber;
    
    // Auto update status to shipped if assigning tracking
    orders[orderIndex].status = 'Shipped';
    orders[orderIndex].timeline.push({
      status: 'Shipped',
      date: new Date().toISOString(),
      message: `Order shipped via ${courier}. Tracking ID: ${trackingNumber}`
    });

    this._saveOrders(orders);
    return orders[orderIndex];
  }
}

export default new OrderService();
