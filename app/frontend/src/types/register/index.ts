export interface RegisterFormValues {
  email: string;
  password: string;
  full_name: string;
}

export interface RegisterFormState {
  isLoading: boolean;
  error: string | null;
}
