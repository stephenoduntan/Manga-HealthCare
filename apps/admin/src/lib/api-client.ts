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

export interface AdminApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  errorMessage?: string;
  networkError?: boolean;
}

function extractAdminError(data: any, status: number): string {
  if (data?.message) {
    return Array.isArray(data.message) ? data.message.join(', ') : String(data.message);
  }
  if (status === 401) return 'Unauthorized staff credentials, OTP, or 2FA code.';
  if (status === 403) return 'Forbidden: ADMIN role is required.';
  if (status === 429) return 'Rate limit exceeded. Wait before requesting another OTP.';
  return `Request failed with status ${status}.`;
}

export async function adminApiFetch<T = any>(
  path: string,
  init: RequestInit = {},
): Promise<AdminApiResponse<T>> {
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
    return {
      ok: response.ok,
      status: response.status,
      data,
      ...(!response.ok ? { errorMessage: extractAdminError(data, response.status) } : {}),
    };
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      networkError: true,
      errorMessage: 'Unable to reach Manga Healthcare API server. Check NEXT_PUBLIC_API_URL or network connectivity.',
    };
  }
}
