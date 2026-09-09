class CustomerService {
  static KEY = 'indrani_customers';

  static async getCustomers() {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(this.KEY);
      resolve(stored ? JSON.parse(stored) : []);
    });
  }

  static async updateCustomerStats(email, orderTotal) {
    const customers = await this.getCustomers();
    const existing = customers.find(c => c.email === email);
    
    let updated;
    if (existing) {
      updated = customers.map(c => c.email === email ? {
        ...c, 
        ordersCount: c.ordersCount + 1,
        lifetimeValue: c.lifetimeValue + orderTotal
      } : c);
    } else {
      updated = [...customers, {
        id: String(Date.now()),
        email,
        name: 'Guest User', // Or derived from order
        ordersCount: 1,
        lifetimeValue: orderTotal,
        joinedAt: new Date().toISOString()
      }];
    }
    
    localStorage.setItem(this.KEY, JSON.stringify(updated));
    return updated;
  }
}

export default CustomerService;
