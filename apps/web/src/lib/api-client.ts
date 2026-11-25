'use client';

export interface StoredAuthUser {
  id: string;
  public_id: string;
  role: 'PATIENT' | 'DOCTOR' | 'THERAPIST' | 'LOCUM' | 'ADMIN' | 'PARTNER';
  name: string;
  phone: string;
  email?: string;
  telemedicine_consent: boolean;
  ndpr_consent: boolean;
  rbac_role?: string;
  doctor_profile?: {
    verification_status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
    specialty?: string;
    mdcn_license_number?: string;
    is_online?: boolean;
  } | null;
}

export interface StoredAuthSession {
  access_token: string;
  refresh_token?: string;
  user: StoredAuthUser;
}

const SESSION_KEY = 'manga_web_auth_session_v1';

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
}

export function getAuthSession(): StoredAuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredAuthSession) : null;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: StoredAuthSession): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
}

async function tryRefreshSession(current: StoredAuthSession): Promise<StoredAuthSession | null> {
  if (!current.refresh_token) return null;
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ refresh_token: current.refresh_token }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token: string; refresh_token?: string };
    const updated: StoredAuthSession = {
      ...current,
      access_token: data.access_token,
      refresh_token: data.refresh_token || current.refresh_token,
    };
    saveAuthSession(updated);
    return updated;
  } catch {
    return null;
  }
}

export async function authorizedApiFetch<T = any>(
  path: string,
  init: RequestInit = {},
): Promise<{ ok: boolean; status: number; data: T | null; networkError?: boolean }> {
  const session = getAuthSession();
  const buildHeaders = (token?: string): HeadersInit => ({
    ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  try {
    let response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      credentials: 'include',
      headers: buildHeaders(session?.access_token),
    });

    if (response.status === 401 && session?.refresh_token) {
      const refreshed = await tryRefreshSession(session);
      if (refreshed) {
        response = await fetch(`${getApiBaseUrl()}${path}`, {
          ...init,
          credentials: 'include',
          headers: buildHeaders(refreshed.access_token),
        });
      }
    }

    const data = await response.json().catch(() => null);
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: 0, data: null, networkError: true };
  }
}

export async function logoutAuthorizedSession(): Promise<void> {
  const session = getAuthSession();
  if (session) {
    await authorizedApiFetch('/api/v1/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
  }
  clearAuthSession();
}
