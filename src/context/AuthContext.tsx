import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppUser, AuthSession, UserRole } from '../types';
import { sessionStorage_, userStorage, verifyPassword } from '../storage/localStorage';

interface AuthContextValue {
  currentUser: AppUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage_.get();
    if (stored) {
      if (new Date(stored.expiresAt) > new Date()) {
        const user = userStorage.findByEmail(stored.email);
        if (user && user.active) {
          setSession(stored);
          setCurrentUser(user);
        } else {
          sessionStorage_.set(null);
        }
      } else {
        sessionStorage_.set(null);
      }
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const user = userStorage.findByEmail(email);
    if (!user || !user.active) {
      return { ok: false, error: 'Usuario no encontrado o inactivo' };
    }
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return { ok: false, error: 'Contraseña incorrecta' };
    }
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(); // 8h
    const newSession: AuthSession = {
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      expiresAt,
    };
    sessionStorage_.set(newSession);
    setSession(newSession);
    setCurrentUser(user);
    return { ok: true };
  }

  function logout() {
    sessionStorage_.set(null);
    setSession(null);
    setCurrentUser(null);
  }

  function hasRole(roles: UserRole[]): boolean {
    return session ? roles.includes(session.role) : false;
  }

  return (
    <AuthContext.Provider value={{ currentUser, session, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
