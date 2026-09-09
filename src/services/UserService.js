import useAuthStore from '../store/useAuthStore';

class UserService {
  static USERS_KEY = 'buyer_users';
  static CURRENT_USER_KEY = 'currentUser';

  static async getUsers() {
    return new Promise((resolve) => {
      let users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
      if (users.length === 0) {
        users = [
          {
            name: 'Priya Deshmukh',
            email: 'buyer@indranipaithani.com',
            password: 'buyer123',
            phone: '+91 9876543210',
            mobileVerified: true,
            age: 28,
            gender: 'Female',
            address: 'Flat 402, Royal Palms, MG Road, Pune, Maharashtra - 411001'
          }
        ];
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      }
      resolve(users);
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
      
      if (!authUser) {
        resolve(localProfile);
      } else {
        resolve({ ...authUser, ...localProfile });
      }
    });
  }

  static async updateCurrentUser(updates) {
    return new Promise(async (resolve) => {
      const current = (await this.getCurrentUser()) || { name: 'Valued Buyer', email: 'guest@example.com' };

      const updatedUser = { ...current, ...updates };
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
}

export default UserService;
