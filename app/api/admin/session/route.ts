import { NextResponse } from "next/server";
import { API_URL } from "@/app/lib/api";
import { clearSessionCookies, setSessionCookies } from "@/app/lib/admin/session";
import type { AdminUser } from "@/app/lib/admin/types";

/**
 * Admin sign-in / sign-out.
 *
 * The browser posts credentials here rather than to Django directly, so the
 * JWT pair can be stored in httpOnly cookies that client JavaScript cannot
 * read. Only the (non-sensitive) profile is returned to the caller.
 */

type TokenResponse = { access: string; refresh: string; user: AdminUser };

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;
  if (!email || !password) {
    return NextResponse.json(
      { detail: "Email and password are both required." },
      { status: 400 },
    );
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { detail: "Could not reach the server. Please try again." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    // Deliberately generic: never reveal whether the address exists.
    const status = res.status === 429 ? 429 : 401;
    return NextResponse.json(
      {
        detail:
          status === 429
            ? "Too many sign-in attempts. Please wait and try again."
            : "Those credentials were not recognised.",
      },
      { status },
    );
  }

  const data = (await res.json()) as TokenResponse;

  // Authentication is not authorization: a non-staff account has valid
  // credentials but no business in the dashboard, so no cookie is issued.
  if (!data.user?.is_staff) {
    return NextResponse.json(
      { detail: "This account does not have administrator access." },
      { status: 403 },
    );
  }

  await setSessionCookies(data.access, data.refresh);
  return NextResponse.json({ user: data.user });
}

export async function DELETE() {
  await clearSessionCookies();
  return NextResponse.json({ detail: "Signed out." });
}
