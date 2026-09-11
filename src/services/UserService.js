import useAuthStore from '../store/useAuthStore';

class UserService {
  static USERS_KEY = 'buyer_users';
  static CURRENT_USER_KEY = 'currentUser';

  static _normalizeUserSchema(user) {
    if (!user) return null;
    const name = user.name || user.registeredName || 'Valued Client';
    const nameParts = name.trim().split(' ');
    
    return {
      ...user,
      name,
      firstName: user.firstName || nameParts[0] || 'Valued',
      lastName: user.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Client'),
      email: user.email || 'buyer@indranipaithani.com',
      phone: user.phone || '+91 9876543210',
      altPhone: user.altPhone || '',
      mobileVerified: user.mobileVerified !== false,
      emailVerified: true,
      gender: user.gender || 'Female',
      dob: user.dob || '',
      anniversaryDate: user.anniversaryDate || '',
      marketingOptIn: user.marketingOptIn !== false,
      avatarUrl: user.avatarUrl || '/assets/official_logo.jpg',
      address: user.address || 'Pune, Maharashtra - 411001',
      deliveryInstructions: user.deliveryInstructions || 'Call before delivery',
      addresses: Array.isArray(user.addresses) && user.addresses.length > 0 ? user.addresses : [
        {
          id: 'addr_default_1',
          label: 'Home',
          street: user.address || 'Flat 402, Royal Palms, MG Road',
          landmark: '',
          pincode: '411001',
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          deliveryInstructions: user.deliveryInstructions || 'Call before delivery',
          isDefault: true
        }
      ],
      connectedAuth: Array.isArray(user.connectedAuth) ? user.connectedAuth : ['Email / Password', 'Google SSO']
    };
  }

  static async getUsers() {
    return new Promise((resolve) => {
      let users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
      if (users.length === 0) {
        users = [
          this._normalizeUserSchema({
            firstName: 'Priya',
            lastName: 'Deshmukh',
            name: 'Priya Deshmukh',
            email: 'buyer@indranipaithani.com',
            password: 'buyer123',
            phone: '+91 9876543210',
            altPhone: '+91 9822012345',
            mobileVerified: true,
            emailVerified: true,
            age: 28,
            gender: 'Female',
            dob: '1996-05-14',
            anniversaryDate: '2021-11-20',
            marketingOptIn: true,
            avatarUrl: '/assets/official_logo.jpg',
            address: 'Flat 402, Royal Palms, MG Road, Pune, Maharashtra - 411001',
            deliveryInstructions: 'Call before delivery'
          })
        ];
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      }
      resolve(users.map(u => this._normalizeUserSchema(u)));
    });
  }

  static async saveUsers(users) {
    return new Promise((resolve) => {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      resolve(users);
    });
  }

  static async getCurrentUser() {
    return new Promise((resolve) => {
      const authUser = useAuthStore.getState().user;
      const localProfile = JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY) || 'null');
      
      if (!authUser && !localProfile) {
        resolve(null);
      } else if (!authUser) {
        resolve(this._normalizeUserSchema(localProfile));
      } else {
        resolve(this._normalizeUserSchema({ ...authUser, ...localProfile }));
      }
    });
  }

  static async updateCurrentUser(updates) {
    return new Promise(async (resolve) => {
      const current = (await this.getCurrentUser()) || { name: 'Valued Client', email: 'guest@example.com' };

      const updatedUser = this._normalizeUserSchema({ ...current, ...updates });
      
      if (updates.firstName || updates.lastName) {
        updatedUser.name = `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim() || updatedUser.name;
      }

      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));

      // Also update in auth store if logged in
      const authUser = useAuthStore.getState().user;
      if (authUser) {
        useAuthStore.getState().setAuth({ ...authUser, ...updatedUser }, useAuthStore.getState().role);
      }

      // Also update in the users array
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.email === updatedUser.email);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
      } else {
        users.push(updatedUser);
      }
      await this.saveUsers(users);

      resolve(updatedUser);
    });
  }

  // Address Management Methods
  static async addAddress(newAddrData) {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const addresses = Array.isArray(user.addresses) ? [...user.addresses] : [];
    const newAddressObj = {
      id: 'addr_' + Date.now(),
      label: newAddrData.label || 'Home',
      street: newAddrData.street || '',
      landmark: newAddrData.landmark || '',
      pincode: newAddrData.pincode || '',
      city: newAddrData.city || '',
      state: newAddrData.state || '',
      country: newAddrData.country || 'India',
      deliveryInstructions: newAddrData.deliveryInstructions || '',
      isDefault: addresses.length === 0 ? true : !!newAddrData.isDefault
    };

    if (newAddressObj.isDefault) {
      addresses.forEach(a => a.isDefault = false);
    }

    addresses.push(newAddressObj);
    const primaryAddressStr = `${newAddressObj.street}, ${newAddressObj.city}, ${newAddressObj.state} - ${newAddressObj.pincode}`;

    return await this.updateCurrentUser({
      addresses,
      address: newAddressObj.isDefault ? primaryAddressStr : user.address,
      deliveryInstructions: newAddressObj.isDefault ? newAddressObj.deliveryInstructions : user.deliveryInstructions
    });
  }

  static async setDefaultAddress(addressId) {
    const user = await this.getCurrentUser();
    if (!user || !Array.isArray(user.addresses)) return null;

    let selectedAddressStr = user.address;
    let selectedDeliveryNotes = user.deliveryInstructions;

    const updatedAddresses = user.addresses.map(a => {
      const isMatch = a.id === addressId;
      if (isMatch) {
        selectedAddressStr = `${a.street}, ${a.city}, ${a.state} - ${a.pincode}`;
        selectedDeliveryNotes = a.deliveryInstructions || selectedDeliveryNotes;
      }
      return { ...a, isDefault: isMatch };
    });

    return await this.updateCurrentUser({
      addresses: updatedAddresses,
      address: selectedAddressStr,
      deliveryInstructions: selectedDeliveryNotes
    });
  }

  static async deleteAddress(addressId) {
    const user = await this.getCurrentUser();
    if (!user || !Array.isArray(user.addresses)) return null;

    const filtered = user.addresses.filter(a => a.id !== addressId);
    if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
      filtered[0].isDefault = true;
    }

    const defaultAddr = filtered.find(a => a.isDefault);
    const newAddressStr = defaultAddr 
      ? `${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.pincode}`
      : '';

    return await this.updateCurrentUser({
      addresses: filtered,
      address: newAddressStr
    });
  }

  // Change Password Helper
  static async changePassword(currentPassword, newPassword) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("No active user session found.");

    if (user.password && user.password !== currentPassword) {
      throw new Error("Current password entered is incorrect.");
    }

    return await this.updateCurrentUser({ password: newPassword });
  }
}

export default UserService;
