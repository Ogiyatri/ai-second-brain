export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormState {
  isLoading: boolean;
  error: string | null;
}
