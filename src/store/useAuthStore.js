import { create } from 'zustand';
import AuthService from '../services/AuthService.js';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  // Initialize the auth listener
  initAuth: () => {
    // Prevent multiple listeners if already initialized
    if (useAuthStore.getState().unsubscribe) return;

    set({ loading: true });
    
    const unsubscribe = AuthService.initAuthListener((userData) => {
      set({ 
        user: userData,
        isAuthenticated: !!userData,
        loading: false
      });
    });

    set({ unsubscribe });
  },

  unsubscribe: null,
}));

export default useAuthStore;
