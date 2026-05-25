export interface ApiResponse<T> {
  data?: T;
  message?: string;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface AuthResponse {
  user: UserDto;
  token: string;
}
