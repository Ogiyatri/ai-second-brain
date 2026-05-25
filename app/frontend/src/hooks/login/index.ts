'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/auth';
import { to } from '@/lib/await-to-error';
import { validateEmail, validatePassword } from '@/domains/login';
import type { LoginFormState, LoginFormValues } from '@/types/login';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const [state, setState] = useState<LoginFormState>({ isLoading: false, error: null });

  const login = async (values: LoginFormValues) => {
    const emailErr = validateEmail(values.email);
    if (emailErr) { setState({ isLoading: false, error: emailErr }); return; }
    const passErr = validatePassword(values.password);
    if (passErr) { setState({ isLoading: false, error: passErr }); return; }

    setState({ isLoading: true, error: null });
    const [err, data] = await to(authApi.login(values.email, values.password));
    if (err || !data) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Login failed';
      setState({ isLoading: false, error: msg });
      return;
    }
    setAuth(data.user, data.token);
    router.push('/dashboard');
  };

  return { ...state, login };
}
