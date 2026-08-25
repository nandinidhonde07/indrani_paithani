import ActivityLogger from './ActivityLogger';

class AuthService {
  static ROLES = {
    SUPER_OWNER: 'super_owner',
    MANAGER: 'manager',
    INVENTORY_MANAGER: 'inventory_manager',
    MARKETING_MANAGER: 'marketing_manager',
    CUSTOMER_SUPPORT: 'customer_support',
    BUYER: 'buyer'
  };

  static async login(email, password) {
    return new Promise((resolve) => {
      // Hardcoded mock authentication for Phase 2
      let role = null;
      let user = null;

      if (email === 'owner@indranipaithani.com' && password === 'owner123') {
        role = this.ROLES.SUPER_OWNER;
        user = { name: 'Niharika Wade', email, role };
      } else if (email === 'manager@indranipaithani.com' && password === 'manager123') {
        role = this.ROLES.MANAGER;
        user = { name: 'Store Manager', email, role };
      } else if (email === 'buyer@indranipaithani.com' && password === 'buyer123') {
        role = this.ROLES.BUYER;
        user = { name: 'Demo Buyer', email, role };
      }

      if (role) {
        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify(user));
        if (role !== this.ROLES.BUYER) {
           ActivityLogger.log('Admin Login', `${user.name} logged in.`, user.name);
        }
        resolve({ success: true, user });
      } else {
        resolve({ success: false, error: 'Invalid credentials' });
      }
    });
  }

  static logout() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role !== this.ROLES.BUYER) {
        ActivityLogger.log('Admin Logout', `${user.name} logged out.`, user.name);
      }
    }
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  }

  static getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static hasPermission(requiredRole) {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (user.role === this.ROLES.SUPER_OWNER) return true;
    return user.role === requiredRole;
  }
}

export default AuthService;
