import { create } from 'zustand';
import type { UserDto } from '@/types/global';

interface AuthState {
  user: UserDto | null;
  token: string | null;
  setAuth: (user: UserDto, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
    set({ user, token });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
    set({ user: null, token: null });
  },

  isAuthenticated: () => !!get().token,
}));
