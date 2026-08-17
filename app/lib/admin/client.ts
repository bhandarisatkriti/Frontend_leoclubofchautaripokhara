"use client";

/**
 * Client-side admin API access.
 *
 * Everything routes through `/api/admin/proxy/...` so the JWT stays in an
 * httpOnly cookie. `path` is the Django path, e.g. "team" or "team/12".
 */

export class ApiError extends Error {
  readonly status: number;
  /** DRF's `{field: ["message"]}` payload, when the failure was a 400. */
  readonly fieldErrors: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const PROXY = "/api/admin/proxy";

function parseErrors(body: unknown, status: number): ApiError {
  const record = (body ?? {}) as Record<string, unknown>;
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

  if (!detail) {
    detail =
      status === 401
        ? "Your session has expired. Please sign in again."
        : status === 403
          ? "You do not have permission to do that."
          : Object.keys(fieldErrors).length
            ? "Please correct the highlighted fields."
            : "Something went wrong. Please try again.";
  }

  return new ApiError(status, detail, fieldErrors);
}

async function request<T>(
  path: string,
  init: RequestInit & { json?: unknown; form?: FormData } = {},
): Promise<T> {
  const { json, form, ...rest } = init;

  const headers = new Headers(rest.headers);
  let body: BodyInit | undefined;
  if (form) {
    // Leave Content-Type unset so the browser adds the multipart boundary.
    body = form;
  } else if (json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  }
  headers.set("Accept", "application/json");

  // Strip a trailing slash before the query: Next normalises
  // `/api/admin/proxy/team/` to the slashless form with a 308, costing an
  // extra round trip on every call. The handler re-adds the slash Django wants.
  const cleanPath = path.replace(/\/(?=\?|$)/, "");

  let res: Response;
  try {
    res = await fetch(`${PROXY}/${cleanPath}`, { ...rest, headers, body });
  } catch {
    throw new ApiError(0, "Could not reach the server. Check your connection.");
  }

  if (res.status === 204) return undefined as T;

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok) throw parseErrors(payload, res.status);
  return payload as T;
}

export const adminApi = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, json: unknown) => request<T>(path, { method: "POST", json }),
  patch: <T>(path: string, json: unknown) => request<T>(path, { method: "PATCH", json }),
  /** Multipart variants, for anything with a file field. */
  postForm: <T>(path: string, form: FormData) =>
    request<T>(path, { method: "POST", form }),
  patchForm: <T>(path: string, form: FormData) =>
    request<T>(path, { method: "PATCH", form }),
  delete: (path: string) => request<void>(path, { method: "DELETE" }),
};

/**
 * Clear the admin session cookies. Navigation is left to the caller so this
 * stays usable from anywhere and routing goes through the Next router.
 */
export async function clearSession() {
  await fetch("/api/admin/session", { method: "DELETE" });
}
