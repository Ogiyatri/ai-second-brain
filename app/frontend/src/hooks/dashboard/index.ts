'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/api/auth.api';
import { to } from '@/lib/await-to-error';

export function useDashboard() {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!stored) { router.replace('/login'); return; }
    if (!user) {
      to(authApi.me()).then(([err, data]) => {
        if (err || !data) { clearAuth(); router.replace('/login'); return; }
        setAuth(data, stored);
      });
    }
  }, []);

  const logout = () => {
    clearAuth();
    router.replace('/login');
  };

  return { user, token, logout };
}
