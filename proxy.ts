import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route gate for the admin area. (In Next.js 16 this file replaces the
 * deprecated `middleware.ts`, and the export is named `proxy`.)
 *
 * This is a cheap first pass only — it checks that a session cookie exists so
 * anonymous traffic is bounced before the dashboard shell renders. It cannot
 * validate the token: the real authorization is `getAdminUser()` in
 * `app/admin/layout.tsx`, which asks Django who the token belongs to and
 * requires `is_staff`, plus Django's own permission classes on every API call.
 */

const ACCESS_COOKIE = "leo_access";
const LOGIN_PATH = "/admin/login";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = Boolean(request.cookies.get(ACCESS_COOKIE)?.value);

  if (pathname === LOGIN_PATH) {
    if (signedIn) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!signedIn) {
    const login = new URL(LOGIN_PATH, request.url);
    // Send the visitor back where they were headed once they sign in.
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
