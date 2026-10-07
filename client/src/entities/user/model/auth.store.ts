import { create } from 'zustand';
import { type AuthUser, authApi } from '@/shared/api/auth.api';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;

  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'loading',

  setUser: (user) => set({ user, status: 'authenticated' }),
  clearUser: () => set({ user: null, status: 'unauthenticated' }),

  initializeAuth: async () => {
    try {
      const user = await authApi.getCurrentUser();

      set({ user, status: 'authenticated' });
    } catch {
      set({ user: null, status: 'unauthenticated' });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
    } finally {
      set({ user: null, status: 'unauthenticated' });
    }
  },
}));
