/**
 * Fetch helpers for the Django backend
 * (../backend_leoclubofchautaripokhara).
 *
 * Set NEXT_PUBLIC_API_URL in .env.local — see .env.example.
 */
import type { ClubInformation, Paginated } from "@/app/lib/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export type { Paginated } from "@/app/lib/types";

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
 * Backend routes. These match `config/urls.py` in the Django project —
 * everything else in the frontend reads paths from here.
 */
export const endpoints = {
  club: "/club/",
  clubs: "/clubs/",
  partners: "/partners/",
  team: "/team/",
  teamPositions: "/team/positions/",
  events: "/events/",
  eventsCalendar: "/events/calendar/",
  eventCategories: "/events/categories/",
  gallery: "/gallery/",
  galleryCategories: "/gallery/categories/",
  articles: "/articles/",
  articleCategories: "/article-categories/",
  tags: "/tags/",
  resources: "/resources/",
  resourceCategories: "/resource-categories/",
  contact: "/contact/",
  memberships: "/memberships/",
} as const;

/** Build a query string, dropping empty values. `{}` produces "". */
export function query(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Fetch a list endpoint and return just the rows.
 *
 * Most list endpoints are paginated, but the small taxonomy endpoints
 * (categories, tags, team positions) return a bare array — this accepts either,
 * and yields `[]` when the backend is unreachable so pages still render.
 */
export async function fetchList<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
  options?: ApiOptions,
): Promise<T[]> {
  const data = await apiFetchOr<Paginated<T> | T[] | null>(
    `${path}${query(params)}`,
    null,
    options,
  );
  if (!data) return [];
  return Array.isArray(data) ? data : (data.results ?? []);
}

/**
 * The club profile, or `null` when an administrator has not created it yet
 * (the backend answers 404 until then — that is expected, not an error).
 */
export function getClubInformation(options?: ApiOptions) {
  return apiFetchOr<ClubInformation | null>(endpoints.club, null, {
    revalidate: 3600,
    ...options,
  });
}

/** Result of a public form submission. */
export type SubmitResult =
  | { ok: true; detail: string }
  | { ok: false; detail: string; fieldErrors: Record<string, string[]> };

/**
 * POST a public form (contact, membership) and normalise the response.
 *
 * DRF answers 400 with `{field: ["message", …]}`, so field errors are handed
 * back separately from the general message rather than dumped as raw JSON.
 * Accepts a plain object (sent as JSON) or FormData (for file uploads, where
 * Content-Type must be left for the browser to set).
 */
export async function submitForm(
  path: string,
  payload: Record<string, unknown> | FormData,
): Promise<SubmitResult> {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? payload : JSON.stringify(payload),
    });
  } catch {
    return {
      ok: false,
      detail: "Could not reach the server. Please check your connection and try again.",
      fieldErrors: {},
    };
  }

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* empty or non-JSON body */
  }

  const record = (body ?? {}) as Record<string, unknown>;

  if (res.ok) {
    return {
      ok: true,
      detail:
        typeof record.detail === "string"
          ? record.detail
          : "Thank you — your submission has been received.",
    };
  }

  if (res.status === 429) {
    return {
      ok: false,
      detail:
        typeof record.detail === "string"
          ? record.detail
          : "Too many submissions from this device. Please try again later.",
      fieldErrors: {},
    };
  }

  // 400: split field-keyed errors from any top-level message.
  const fieldErrors: Record<string, string[]> = {};
  let detail = "";
  for (const [key, value] of Object.entries(record)) {
    const messages = Array.isArray(value)
      ? value.map(String)
      : typeof value === "string"
        ? [value]
        : [];
    if (!messages.length) continue;
    if (key === "detail" || key === "non_field_errors") {
      detail ||= messages.join(" ");
    } else {
      fieldErrors[key] = messages;
    }
  }

  return {
    ok: false,
    detail: detail || "Please correct the highlighted fields and try again.",
    fieldErrors,
  };
}

/**
 * Media paths from Django are already absolute, but this stays defensive so a
 * relative path (or a differently-configured backend) still resolves.
 */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return new URL(path, API_URL).toString();
}
