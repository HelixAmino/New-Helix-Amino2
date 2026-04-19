import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  loginWithPassword,
  registerUser,
  validateToken,
  logout as wooLogout,
  getCurrentUser,
  WooUser,
} from '../services/wooAuth';

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: { full_name?: string };
  wooId: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(u: WooUser): AuthUser {
  return {
    id: String(u.id),
    email: u.email,
    user_metadata: { full_name: u.displayName },
    wooId: u.id,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = getCurrentUser();
      if (stored) {
        const valid = await validateToken();
        if (!cancelled) {
          if (valid) setUser(toAuthUser(stored));
          else {
            wooLogout();
            setUser(null);
          }
        }
      }
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const u = await loginWithPassword(email, password);
      setUser(toAuthUser(u));
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Login failed' };
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    try {
      const u = await registerUser(email, password, fullName);
      setUser(toAuthUser(u));
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Sign up failed' };
    }
  }

  async function signOut() {
    wooLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
