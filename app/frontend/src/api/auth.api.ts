import apiClient from '@/lib/api-client';
import type { AuthResponse, UserDto } from '@/types/global';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return res.data;
  },

  register: async (
    email: string,
    password: string,
    full_name: string,
  ): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
      full_name,
    });
    return res.data;
  },

  me: async (): Promise<UserDto> => {
    const res = await apiClient.get<UserDto>('/auth/me');
    return res.data;
  },
};
