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
    // Initialize with default demo orders if empty
    if (!localStorage.getItem(this.storageKey) || JSON.parse(localStorage.getItem(this.storageKey) || '[]').length === 0) {
      const defaultSeedOrders = [
        {
          orderId: 'ORD-892401',
          buyerEmail: 'priya@gmail.com',
          buyerName: 'Priya Deshmukh',
          phone: '+91 9876543210',
          altPhone: '+91 9123456789',
          shippingAddress: 'Flat 402, Royal Palms Apartment, MG Road, Pune, Maharashtra - 411001',
          pincode: '411001',
          deliveryInstructions: 'Call before delivery / Leave with security at gate',
          orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Order Confirmed',
          paymentMethod: 'Instant UPI (VPA: priya@okaxis)',
          paymentStatus: 'Paid (Verified UPI)',
          subtotal: 28500,
          gst: 1425,
          shipping: 0,
          grandTotal: 29925,
          items: [
            { id: '1', name: 'Royal Maharani Kath Pure Silk Paithani', price: 28500, quantity: 1, image: '/assets/products/muniya_1.png' }
          ],
          timeline: [
            { status: 'Order Confirmed', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), message: 'Order placed successfully by client.' }
          ]
        },
        {
          orderId: 'ORD-761204',
          buyerEmail: 'aditi@gmail.com',
          buyerName: 'Aditi Kulkarni',
          phone: '+91 9822012345',
          altPhone: 'Not provided',
          shippingAddress: 'Plot 12, Baner Highway, Pune, Maharashtra - 411045',
          pincode: '411045',
          deliveryInstructions: 'Ring bell twice upon delivery',
          orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Shipped',
          trackingNumber: 'BD78945612IN',
          courier: 'BlueDart Express',
          paymentMethod: 'Razorpay (Online Paid)',
          paymentStatus: 'Paid (Razorpay)',
          subtotal: 42000,
          gst: 2100,
          shipping: 0,
          grandTotal: 44100,
          items: [
            { id: '2', name: 'Yeola Handloom Silk Swan Paithani', price: 42000, quantity: 1, image: '/assets/products/lotus_swan_flat.png' }
          ],
          timeline: [
            { status: 'Order Confirmed', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), message: 'Order placed.' },
            { status: 'Shipped', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), message: 'Shipped via BlueDart Express (BD78945612IN)' }
          ]
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(defaultSeedOrders));
    }
  }

  // Helper to read from LocalStorage
  _getOrders() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Helper to write to LocalStorage
  _saveOrders(orders) {
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('indrani_order_created'));
      window.dispatchEvent(new Event('storage'));
    }
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
    
    // Save guest order ID locally
    const guestOrders = JSON.parse(localStorage.getItem('indrani_guest_order_ids') || '[]');
    if (!guestOrders.includes(orderId)) {
      guestOrders.push(orderId);
      localStorage.setItem('indrani_guest_order_ids', JSON.stringify(guestOrders));
    }

    this._saveOrders(orders);
    
    // Also clear the cart
    localStorage.removeItem('cart');

    return newOrder;
  }

  /**
   * Get all orders for a specific buyer (by email or guest order session IDs)
   */
  async getBuyerOrders(buyerEmail) {
    await delay(300);
    const orders = this._getOrders();
    const guestOrders = JSON.parse(localStorage.getItem('indrani_guest_order_ids') || '[]');
    
    // Match orders by buyer email OR guest order IDs placed in this session
    return orders.filter(o => 
      (buyerEmail && o.buyerEmail && o.buyerEmail.toLowerCase() === buyerEmail.toLowerCase()) ||
      guestOrders.includes(o.orderId) ||
      (!buyerEmail || buyerEmail === 'guest@example.com')
    ).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
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
