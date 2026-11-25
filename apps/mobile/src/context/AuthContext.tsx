import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'LOCUM' | 'THERAPIST' | 'ADMIN' | 'PARTNER';

export interface AuthUser {
  id: string;
  publicId: string;
  role: UserRole;
  name: string;
  phone: string;
  email?: string;
  telemedicineConsent: boolean;
  ndprConsent: boolean;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  authError: string | null;
  requestOtp: (
    identifier: string,
    role?: UserRole,
  ) => Promise<{ ok: boolean; devOtp?: string; message?: string }>;
  loginWithOtp: (identifier: string, otp: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  updateConsent: (telemed: boolean, ndpr: boolean) => Promise<void>;
}

const AUTH_STORAGE_KEY = 'manga_auth_user_v1';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  authError: null,
  requestOtp: async () => ({ ok: false }),
  loginWithOtp: async () => false,
  logout: async () => {},
  switchRole: async () => {},
  updateConsent: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Load user from SecureStore on startup
  useEffect(() => {
    async function loadUser() {
      try {
        const stored = await SecureStore.getItemAsync(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed: AuthUser = JSON.parse(stored);
          setUser(parsed);
        }
      } catch (err) {
        console.warn('Failed to load credentials from SecureStore:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const requestOtp = async (identifier: string, preferredRole?: UserRole) => {
    setAuthError(null);
    const trimmed = identifier.trim();
    if (!trimmed) {
      setAuthError('Phone number, email, or public ID is required.');
      return { ok: false, message: 'Identifier is required.' };
    }

    const apiBase = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${apiBase}/api/v1/auth/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: trimmed, role: preferredRole }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = Array.isArray(data?.message)
          ? data.message.join(', ')
          : data?.message || 'Failed to send OTP.';
        setAuthError(msg);
        return { ok: false, message: msg };
      }
      return { ok: true, devOtp: data?.dev_otp, message: data?.message };
    } catch {
      const msg = 'Unable to reach Manga Healthcare API server.';
      setAuthError(msg);
      return { ok: false, message: msg };
    }
  };

  const loginWithOtp = async (identifier: string, otp: string, preferredRole?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const apiBase = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiBase}/api/v1/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          otp: otp.trim(),
          role: preferredRole,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.access_token || !data?.user) {
        const msg = Array.isArray(data?.message)
          ? data.message.join(', ')
          : data?.message || 'Invalid or expired 6-digit OTP.';
        setAuthError(msg);
        return false;
      }

      const apiUser = data.user;
      const authUser: AuthUser = {
        id: apiUser.id,
        publicId: apiUser.public_id,
        role: apiUser.role as UserRole,
        name: apiUser.name,
        phone: apiUser.phone,
        email: apiUser.email,
        telemedicineConsent: Boolean(apiUser.telemedicine_consent),
        ndprConsent: Boolean(apiUser.ndpr_consent),
        token: data.access_token,
      };

      await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      setUser(authUser);

      if (authUser.role === 'DOCTOR' || authUser.role === 'LOCUM') {
        router.replace('/(doctor-tabs)');
      } else {
        router.replace('/(patient-tabs)');
      }

      return true;
    } catch {
      setAuthError('Unable to reach Manga Healthcare API server. Check EXPO_PUBLIC_API_URL.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (newRole: UserRole) => {
    if (!user) return;
    const isDoctor = newRole === 'DOCTOR' || newRole === 'LOCUM';
    const updated: AuthUser = {
      ...user,
      role: newRole,
      publicId: isDoctor ? 'LOC-9941' : 'PAT-48291',
      name: isDoctor ? 'Dr. Amina Bello (Locum)' : 'Amaka Adeleke',
    };

    await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);

    if (isDoctor) {
      router.replace('/(doctor-tabs)');
    } else {
      router.replace('/(patient-tabs)');
    }
  };

  const updateConsent = async (telemed: boolean, ndpr: boolean) => {
    if (!user) return;
    const apiBase = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      await fetch(`${apiBase}/api/v1/auth/consent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ telemedicine_consent: telemed, ndpr_consent: ndpr }),
      });
    } catch {
      // Continue storing consent locally when offline
    }
    const updated = { ...user, telemedicineConsent: telemed, ndprConsent: ndpr };
    await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  const logout = async () => {
    try {
      if (user?.token) {
        const apiBase = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
        await fetch(`${apiBase}/api/v1/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${user.token}` },
        }).catch(() => undefined);
      }
      await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY);
      setUser(null);
      router.replace('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        authError,
        requestOtp,
        loginWithOtp,
        logout,
        switchRole,
        updateConsent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
