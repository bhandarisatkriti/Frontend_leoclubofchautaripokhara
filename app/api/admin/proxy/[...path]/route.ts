import { NextResponse } from "next/server";
import { API_URL } from "@/app/lib/api";
import { getAccessToken, refreshAccessToken } from "@/app/lib/admin/session";

/**
 * Authenticated pass-through to the Django API.
 *
 * Admin screens are interactive, so their reads and writes happen in the
 * browser — but the JWT must not. Every client-side admin request goes to
 * `/api/admin/proxy/<django path>`; this handler attaches the bearer token from
 * the httpOnly cookie and forwards the result back untouched.
 *
 * Django remains the authority: it re-checks `IsAdminUserOrReadOnly` on every
 * call, so forging a request here gains nothing without a valid staff token.
 */

const FORWARDED_REQUEST_HEADERS = ["content-type", "accept"];

async function forward(request: Request, pathParts: string[]) {
  // Django's routes all end in a slash; APPEND_SLASH does not apply to non-GET.
  const path = pathParts.join("/");
  const search = new URL(request.url).search;
  const target = `${API_URL}/${path}${path.endsWith("/") ? "" : "/"}${search}`;

  // Read the body once — a retry after refresh cannot re-consume the stream.
  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const send = (token: string) => {
    const outgoing = new Headers(headers);
    outgoing.set("Authorization", `Bearer ${token}`);
    return fetch(target, {
      method: request.method,
      headers: outgoing,
      body: body ? Buffer.from(body) : undefined,
      cache: "no-store",
    });
  };

  let token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ detail: "Not signed in." }, { status: 401 });
  }

  let res: Response;
  try {
    res = await send(token);
    if (res.status === 401) {
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        return NextResponse.json({ detail: "Session expired." }, { status: 401 });
      }
      token = refreshed;
      res = await send(token);
    }
  } catch {
    return NextResponse.json(
      { detail: "Could not reach the server." },
      { status: 502 },
    );
  }

  // 204 and friends must not carry a body.
  if (res.status === 204 || res.status === 205) {
    return new NextResponse(null, { status: res.status });
  }

  const payload = await res.arrayBuffer();
  return new NextResponse(payload, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

type Context = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, { params }: Context) {
  return forward(request, (await params).path);
}

export async function POST(request: Request, { params }: Context) {
  return forward(request, (await params).path);
}

export async function PATCH(request: Request, { params }: Context) {
  return forward(request, (await params).path);
}

export async function PUT(request: Request, { params }: Context) {
  return forward(request, (await params).path);
}

export async function DELETE(request: Request, { params }: Context) {
  return forward(request, (await params).path);
}
