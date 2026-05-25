export const validateFullName = (name: string): string | null => {
  if (!name) return 'Full name is required';
  if (name.trim().length < 2) return 'Full name must be at least 2 characters';
  if (name.trim().length > 100) return 'Full name must be at most 100 characters';
  return null;
};
