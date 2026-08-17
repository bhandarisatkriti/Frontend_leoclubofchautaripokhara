import "server-only";

import { cookies } from "next/headers";
import { API_URL } from "@/app/lib/api";
import type { AdminUser } from "@/app/lib/admin/types";

/**
 * Admin session handling.
 *
 * JWTs live in httpOnly cookies, never in localStorage and never in a prop sent
 * to the browser: an XSS on the public site must not be able to read a staff
 * token. Everything the admin UI does goes through the route handlers in
 * `app/api/admin/`, which attach the token server-side.
 */

export const ACCESS_COOKIE = "leo_access";
export const REFRESH_COOKIE = "leo_refresh";

/** Access tokens last 60 minutes server-side; refresh tokens 7 days. */
const ACCESS_MAX_AGE = 60 * 60;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

const baseCookie = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
} as const;

export async function setSessionCookies(access: string, refresh: string) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, access, { ...baseCookie, maxAge: ACCESS_MAX_AGE });
  store.set(REFRESH_COOKIE, refresh, { ...baseCookie, maxAge: REFRESH_MAX_AGE });
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getAccessToken(): Promise<string | null> {
  return (await cookies()).get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  return (await cookies()).get(REFRESH_COOKIE)?.value ?? null;
}

/**
 * Exchange the refresh token for a new access token.
 *
 * Returns the new access token, or null when the refresh token is itself
 * expired or rejected — in which case the caller should treat the session as
 * ended. SIMPLE_JWT rotates refresh tokens, so a new one may come back too.
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refresh = await getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${API_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { access?: string; refresh?: string };
  if (!data.access) return null;

  const store = await cookies();
  store.set(ACCESS_COOKIE, data.access, { ...baseCookie, maxAge: ACCESS_MAX_AGE });
  if (data.refresh) {
    store.set(REFRESH_COOKIE, data.refresh, { ...baseCookie, maxAge: REFRESH_MAX_AGE });
  }
  return data.access;
}

/**
 * The signed-in staff account, or null.
 *
 * This is the real authorization check on the frontend: it asks Django who the
 * token belongs to and confirms `is_staff`. A cookie merely being present
 * proves nothing — `proxy.ts` only does a cheap presence check to avoid
 * rendering the shell for obvious anonymous traffic.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  let token = await getAccessToken();
  if (!token) return null;

  let res = await fetchMe(token);
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) return null;
    token = refreshed;
    res = await fetchMe(token);
  }

  if (!res.ok) return null;

  const user = (await res.json()) as AdminUser;
  return user.is_staff ? user : null;
}

function fetchMe(token: string) {
  return fetch(`${API_URL}/auth/me/`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
}
