import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '../api/auth.types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setAuth: (user: AuthUser, tokens: { accessToken: string; refreshToken: string }) => void;
  clearAuth: () => void;

  // Derived
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  isSeller: () => boolean;
  isCustomer: () => boolean;
  isStaff: () => boolean; // admin or seller
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setUser: (user) => set({ user }),

      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),

      setAuth: (user, tokens) =>
        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }),

      clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null }),

      isAuthenticated: () => Boolean(get().accessToken && get().user),
      isAdmin: () => get().user?.role === 'ADMIN',
      isSeller: () => get().user?.role === 'SELLER',
      isCustomer: () => get().user?.role === 'CUSTOMER',
      isStaff: () => {
        const role = get().user?.role;
        return role === 'ADMIN' || role === 'SELLER';
      },
    }),
    {
      name: 'car-dealership-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);