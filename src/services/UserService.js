class UserService {
  static USERS_KEY = 'buyer_users';
  static CURRENT_USER_KEY = 'currentUser';

  static async getUsers() {
    return new Promise((resolve) => {
      const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
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
      const user = JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY) || 'null');
      resolve(user);
    });
  }

  static async updateCurrentUser(updates) {
    return new Promise(async (resolve) => {
      const current = await this.getCurrentUser();
      if (!current) return resolve(null);

      const updatedUser = { ...current, ...updates };
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));

      // Also update in the users array
      const users = await this.getUsers();
      const updatedUsers = users.map(u => u.email === updatedUser.email ? updatedUser : u);
      await this.saveUsers(updatedUsers);

      resolve(updatedUser);
    });
  }
}

export default UserService;
