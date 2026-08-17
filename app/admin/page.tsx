import { redirect } from "next/navigation";

/**
 * `/admin` has no screen of its own — send it to the dashboard.
 *
 * Without this, signing in after landing on `/admin` bounces through
 * `?next=/admin` and drops the administrator on a 404.
 */
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
