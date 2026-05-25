'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/auth';
import { to } from '@/lib/await-to-error';
import { validateEmail, validatePassword } from '@/domains/login';
import { validateFullName } from '@/domains/register';
import type { RegisterFormState, RegisterFormValues } from '@/types/register';

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const [state, setState] = useState<RegisterFormState>({ isLoading: false, error: null });

  const register = async (values: RegisterFormValues) => {
    const emailErr = validateEmail(values.email);
    if (emailErr) { setState({ isLoading: false, error: emailErr }); return; }
    const passErr = validatePassword(values.password);
    if (passErr) { setState({ isLoading: false, error: passErr }); return; }
    const nameErr = validateFullName(values.full_name);
    if (nameErr) { setState({ isLoading: false, error: nameErr }); return; }

    setState({ isLoading: true, error: null });
    const [err, data] = await to(authApi.register(values.email, values.password, values.full_name));
    if (err || !data) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Registration failed';
      setState({ isLoading: false, error: msg });
      return;
    }
    setAuth(data.user, data.token);
    router.push('/dashboard');
  };

  return { ...state, register };
}
