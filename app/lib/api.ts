/**
 * Thin fetch helper for the Django backend
 * (../backend_leoclubofchautaripokhara).
 *
 * Set NEXT_PUBLIC_API_URL in .env.local — see .env.example.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

type ApiOptions = RequestInit & {
  /** Seconds before the cached response is refetched. Defaults to 5 minutes. */
  revalidate?: number | false;
};

export async function apiFetch<T>(
  path: string,
  { revalidate = 300, ...init }: ApiOptions = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init.headers },
    next: { revalidate: revalidate === false ? undefined : revalidate },
    cache: revalidate === false ? "no-store" : undefined,
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} — GET ${path}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Same as apiFetch, but returns a fallback instead of throwing. Use this on
 * pages that should still render when the backend is down or not yet wired up.
 */
export async function apiFetchOr<T>(
  path: string,
  fallback: T,
  options?: ApiOptions,
): Promise<T> {
  try {
    return await apiFetch<T>(path, options);
  } catch {
    return fallback;
  }
}

/**
 * Backend route paths, guessed from the Django app names. Correct these to
 * match config/urls.py once the API routes are final — everything else in the
 * frontend reads from here.
 */
export const endpoints = {
  club: "/club/",
  team: "/team/",
  events: "/events/",
  gallery: "/gallery/",
  galleryCategories: "/gallery/categories/",
  news: "/articles/",
  resources: "/resources/",
  partners: "/partners/",
  clubs: "/clubs/",
  contact: "/contact/",
  memberships: "/memberships/",
  newsletter: "/newsletter/",
} as const;

/** Django REST Framework's default pagination envelope. */
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

/** Media paths from Django are relative; make them absolute for next/image. */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return new URL(path, API_URL).toString();
}
