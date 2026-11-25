'use client';

export interface AdminAuthSession {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    public_id: string;
    role: string;
    name: string;
    email?: string;
    rbac_role?: string;
  };
}

const ADMIN_SESSION_KEY = 'manga_admin_auth_session_v1';

export function getAdminApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
}

export function getAdminSession(): AdminAuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? (JSON.parse(raw) as AdminAuthSession) : null;
  } catch {
    return null;
  }
}

export function saveAdminSession(session: AdminAuthSession): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}

export async function adminApiFetch<T = any>(
  path: string,
  init: RequestInit = {},
): Promise<{ ok: boolean; status: number; data: T | null; networkError?: boolean }> {
  const session = getAdminSession();
  const buildHeaders = (token?: string): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  try {
    let response = await fetch(`${getAdminApiBaseUrl()}${path}`, {
      ...init,
      credentials: 'include',
      headers: buildHeaders(session?.access_token),
    });

    if (response.status === 401 && session?.refresh_token) {
      const refreshRes = await fetch(`${getAdminApiBaseUrl()}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ refresh_token: session.refresh_token }),
      });
      if (refreshRes.ok) {
        const refreshed = (await refreshRes.json()) as { access_token: string; refresh_token?: string };
        const updated: AdminAuthSession = {
          ...session,
          access_token: refreshed.access_token,
          refresh_token: refreshed.refresh_token || session.refresh_token,
        };
        saveAdminSession(updated);
        response = await fetch(`${getAdminApiBaseUrl()}${path}`, {
          ...init,
          credentials: 'include',
          headers: buildHeaders(updated.access_token),
        });
      }
    }

    const data = await response.json().catch(() => null);
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: 0, data: null, networkError: true };
  }
}
