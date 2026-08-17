import type { Metadata } from "next";
import Link from "next/link";
import { API_URL } from "@/app/lib/api";
import { getAdminUser } from "@/app/lib/admin/session";

export const metadata: Metadata = { title: "Settings" };

/**
 * Deliberately thin. Everything genuinely configurable lives either in the
 * club profile (Contact / Website content) or in the backend's environment,
 * which must not be editable from a browser. This page points to the right
 * place rather than inventing settings that write nowhere.
 */
export default async function AdminSettingsPage() {
  const user = await getAdminUser();

  const rows = [
    { label: "Signed in as", value: user?.email ?? "—" },
    { label: "Access level", value: user?.is_superuser ? "Superuser" : "Staff" },
    { label: "API endpoint", value: API_URL },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-admin-muted">
          Environment details and where to change what.
        </p>
      </div>

      <section className="rounded-xl border border-admin-border bg-admin-card p-6">
        <h3 className="font-semibold">Environment</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label}>
              <dt className="text-xs uppercase tracking-wide text-admin-muted">
                {row.label}
              </dt>
              <dd className="mt-0.5 break-all font-mono text-sm">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-xl border border-admin-border bg-admin-card p-6">
        <h3 className="font-semibold">Where to change things</h3>
        <ul className="mt-4 space-y-2.5 text-sm text-admin-muted">
          <li>
            Club name, address, phone, email and social links —{" "}
            <Link href="/admin/contact" className="text-admin-accent-bright hover:underline">
              Contact information
            </Link>
          </li>
          <li>
            Homepage headline, about text, mission and vision —{" "}
            <Link href="/admin/content" className="text-admin-accent-bright hover:underline">
              Website content
            </Link>
          </li>
          <li>
            Hero background and About photos —{" "}
            <Link href="/admin/images" className="text-admin-accent-bright hover:underline">
              Website images
            </Link>
          </li>
          <li>
            Your own name, phone and password —{" "}
            <Link href="/admin/profile" className="text-admin-accent-bright hover:underline">
              Admin profile
            </Link>
          </li>
          <li>
            Database, email and upload limits — backend <code>.env</code>, not editable
            from here.
          </li>
        </ul>
      </section>
    </div>
  );
}
