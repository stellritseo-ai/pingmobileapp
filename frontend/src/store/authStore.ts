import { create } from 'zustand';
import { User } from '../types';
import { storage } from '@/src/utils/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  login: async (user) => {
    await storage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  
  logout: async () => {
    await storage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
  
  loadUser: async () => {
    try {
      const userStr = await storage.getItem('user', null);
      if (userStr) {
        const user = JSON.parse(userStr as string);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      set({ isLoading: false });
    }
  },
}));