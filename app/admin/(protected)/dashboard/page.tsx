import type { Metadata } from "next";
import Link from "next/link";
import { API_URL } from "@/app/lib/api";
import { getAccessToken } from "@/app/lib/admin/session";
import type { DashboardSummary } from "@/app/lib/admin/types";

export const metadata: Metadata = { title: "Dashboard" };

const dateTime = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const statusTone: Record<string, string> = {
  PENDING: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  REVIEWING: "border-sky-500/40 bg-sky-500/10 text-sky-200",
  APPROVED: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  REJECTED: "border-red-500/40 bg-red-500/10 text-red-200",
};

const actionTone: Record<string, string> = {
  CREATED: "bg-emerald-500",
  UPDATED: "bg-sky-500",
  DELETED: "bg-red-500",
  SUBMITTED: "bg-amber-500",
};

async function getSummary(): Promise<DashboardSummary | null> {
  const token = await getAccessToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/admin/dashboard/`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as DashboardSummary;
  } catch {
    return null;
  }
}

export default async function AdminDashboardPage() {
  const summary = await getSummary();

  if (!summary) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6">
        <h2 className="font-semibold text-red-100">Could not load the dashboard</h2>
        <p className="mt-2 text-sm text-red-200">
          The API did not respond. Check that the Django server is running at{" "}
          <code className="font-mono">{API_URL}</code>, then reload this page.
        </p>
      </div>
    );
  }

  const { stats, recent_applications: applications, recent_activity: activity } = summary;

  const cards = [
    { label: "Team members", value: stats.team_members, sub: `${stats.team_members_active} active`, href: "/admin/team" },
    { label: "Join applications", value: stats.applications_total, sub: `${stats.applications_pending} pending`, href: "/admin/join-applications" },
    { label: "Events", value: stats.events_total, sub: `${stats.events_upcoming} upcoming`, href: "/admin/events" },
    { label: "News articles", value: stats.articles_total, sub: `${stats.articles_published} published`, href: "/admin/news" },
    { label: "Gallery images", value: stats.gallery_images, sub: "in the library", href: "/admin/gallery" },
    { label: "Contact messages", value: stats.contact_messages, sub: "received", href: "/admin/contact" },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="sr-only">Statistics</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-admin-border bg-admin-card p-5 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-admin-accent"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-admin-muted">
                {card.label}
              </p>
              <p className="mt-3 text-3xl font-bold tabular-nums">{card.value}</p>
              <p className="mt-1 text-xs text-admin-muted">{card.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-xl border border-admin-border bg-admin-card">
          <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
            <h2 className="font-semibold">Recent join applications</h2>
            <Link
              href="/admin/join-applications"
              className="text-xs font-semibold text-admin-accent-bright hover:underline"
            >
              View all
            </Link>
          </div>

          {applications.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-admin-muted">
              No applications have been submitted yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[38rem] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-admin-muted">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Contact</th>
                    <th className="px-5 py-3 font-semibold">Submitted</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {applications.map((row) => (
                    <tr key={row.id} className="border-t border-admin-border/70">
                      <td className="px-5 py-3 font-medium">{row.full_name}</td>
                      <td className="px-5 py-3 text-admin-muted">
                        <span className="block">{row.email}</span>
                        <span className="block text-xs">{row.phone}</span>
                      </td>
                      <td className="px-5 py-3 text-admin-muted">
                        {dateTime.format(new Date(row.submitted_at))}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            statusTone[row.status] ?? "border-admin-border text-admin-muted"
                          }`}
                        >
                          {row.status_display}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          href={`/admin/join-applications/${row.id}`}
                          className="text-xs font-semibold text-admin-accent-bright hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-admin-border bg-admin-card">
          <div className="border-b border-admin-border px-5 py-4">
            <h2 className="font-semibold">Recent activity</h2>
          </div>

          {activity.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-admin-muted">
              Activity will appear here as content is changed.
            </p>
          ) : (
            <ul className="divide-y divide-admin-border/70">
              {activity.map((entry) => (
                <li key={entry.id} className="flex gap-3 px-5 py-3.5">
                  <span
                    aria-hidden
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      actionTone[entry.action] ?? "bg-admin-muted"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{entry.action_display}</span>{" "}
                      <span className="text-admin-muted">{entry.description}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-admin-muted">
                      {dateTime.format(new Date(entry.created_at))}
                      {entry.actor_name && ` · ${entry.actor_name}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
