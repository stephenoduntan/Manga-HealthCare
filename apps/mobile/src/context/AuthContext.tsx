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
  loginWithOtp: (identifier: string, otp: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  updateConsent: (telemed: boolean, ndpr: boolean) => Promise<void>;
}

const AUTH_STORAGE_KEY = 'manga_auth_user_v1';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  loginWithOtp: async () => false,
  logout: async () => {},
  switchRole: async () => {},
  updateConsent: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const loginWithOtp = async (identifier: string, otp: string, preferredRole?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Determine role from prefix or parameter
      let detectedRole: UserRole = preferredRole || 'PATIENT';
      let publicId = 'PAT-48291';
      let name = 'Amaka Adeleke';

      const cleanId = identifier.trim().toUpperCase();
      if (cleanId.startsWith('DOC-') || cleanId.includes('DOCTOR')) {
        detectedRole = 'DOCTOR';
        publicId = cleanId.startsWith('DOC-') ? cleanId : 'DOC-1082';
        name = 'Dr. Chidi Okafor';
      } else if (cleanId.startsWith('LOC-') || cleanId.includes('LOCUM')) {
        detectedRole = 'LOCUM';
        publicId = cleanId.startsWith('LOC-') ? cleanId : 'LOC-9941';
        name = 'Dr. Amina Bello (Locum)';
      } else if (cleanId.startsWith('PAT-')) {
        detectedRole = 'PATIENT';
        publicId = cleanId;
        name = 'Amaka Adeleke';
      }

      const mockUser: AuthUser = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        publicId,
        role: detectedRole,
        name,
        phone: identifier.includes('@') ? '+2348030001122' : identifier,
        email: identifier.includes('@') ? identifier : undefined,
        telemedicineConsent: true,
        ndprConsent: true,
        token: 'jwt-mock-session-' + Date.now(),
      };

      await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);

      // Route dynamically to patient or doctor navigation shell
      if (mockUser.role === 'DOCTOR' || mockUser.role === 'LOCUM') {
        router.replace('/(doctor-tabs)');
      } else {
        router.replace('/(patient-tabs)');
      }

      return true;
    } catch (err) {
      console.error('Login error:', err);
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
    const updated = { ...user, telemedicineConsent: telemed, ndprConsent: ndpr };
    await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  const logout = async () => {
    try {
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
