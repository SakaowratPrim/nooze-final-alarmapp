export interface User {
  username: string;
  email: string;
  loginDate: string;
}

const STORAGE_KEY = 'nooze_auth';

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const auth = localStorage.getItem(STORAGE_KEY);
  return auth !== null;
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const auth = localStorage.getItem(STORAGE_KEY);
  if (!auth) return null;
  return JSON.parse(auth);
}

export function signIn(email: string, password: string): { success: boolean; error?: string } {
  // Simple validation (in real app, this would call an API)
  if (!email || !password) {
    return { success: false, error: 'Please fill in all fields' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  // Extract username from email
  const username = email.split('@')[0];

  const user: User = {
    username,
    email,
    loginDate: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return { success: true };
}

export function signOut(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
