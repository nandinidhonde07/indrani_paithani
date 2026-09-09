import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  role: 'GUEST',

  setAuth: (user, role) => set({ user, isAuthenticated: !!user, role, isLoading: false }),
  clearAuth: () => set({ user: null, isAuthenticated: false, role: 'GUEST', isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
