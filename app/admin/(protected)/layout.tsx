import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/app/components/admin/admin-shell";
import { getAdminUser } from "@/app/lib/admin/session";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Leo Chautari Admin" },
  // The dashboard must never be indexed, even if a URL leaks.
  robots: { index: false, follow: false },
};

/**
 * The dashboard is per-request and per-user; nothing here may be prerendered
 * or shared between visitors.
 */
export const dynamic = "force-dynamic";

/**
 * Guard for every admin screen. `/admin/login` deliberately sits outside this
 * route group — putting it inside would make an unauthenticated visitor
 * redirect to a page that redirects them again.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  // The authoritative frontend check. `proxy.ts` only sees whether a cookie
  // exists; this resolves the token against Django and requires `is_staff`, so
  // a signed-in non-staff account is turned away rather than shown a shell.
  if (!user) redirect("/admin/login?reason=unauthorized");

  return <AdminShell user={user}>{children}</AdminShell>;
}
