import { create } from 'zustand';
import { ApiError, authApi, type UserDto } from '@/shared/api';

export type AuthStatus =
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

interface AuthState {
  user: UserDto | null;
  status: AuthStatus;

  setUser: (user: UserDto) => void;
  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

let pendingInitialization: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: 'loading',

  setUser: (user) => set({ user, status: 'authenticated' }),

  initializeAuth: async () => {
    if (pendingInitialization) {
      return pendingInitialization;
    }

    const { status } = get();

    if (status === 'authenticated' || status === 'unauthenticated') {
      return Promise.resolve();
    }

    set({ status: 'loading' });

    pendingInitialization = authApi
      .getCurrentUser()
      .then(
        (user) => set({ user, status: 'authenticated' }),
        (error: unknown) =>
          set({
            user: null,
            status:
              error instanceof ApiError && error.isUnauthorized
                ? 'unauthenticated'
                : 'error',
          }),
      )
      .finally(() => {
        pendingInitialization = null;
      });

    return pendingInitialization;
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
