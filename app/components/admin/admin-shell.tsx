"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ToastProvider } from "@/app/components/admin/toast";
import { clearSession } from "@/app/lib/admin/client";
import type { AdminUser } from "@/app/lib/admin/types";

type NavItem = { href: string; label: string; icon: React.ReactNode };

function icon(d: string) {
  return <path d={d} />;
}

/**
 * Grouped rather than one long list: eleven flat links read as a wall, whereas
 * the groups say what each part of the dashboard is for.
 */
const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: icon("M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z") },
      { href: "/admin/join-applications", label: "Join Applications", icon: icon("M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm8 1.5V8h4.5L14 3.5ZM8 12h8v2H8v-2Zm0 4h8v2H8v-2Z") },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/team", label: "Team", icon: icon("M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0 2c-2.7 0-6 1.3-6 4v3h8v-3c0-1 .4-2 1.1-2.8A11 11 0 0 0 8 14Zm8 0c-3 0-8 1.5-8 4.5V21h16v-2.5C24 15.5 19 14 16 14Z") },
      { href: "/admin/events", label: "Events", icon: icon("M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7ZM5 9h14v11H5V9Z") },
      { href: "/admin/news", label: "News & Articles", icon: icon("M4 4h13a1 1 0 0 1 1 1v13a2 2 0 0 0 2 2H5a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Zm2 4v3h9V8H6Zm0 5v2h9v-2H6Z") },
      { href: "/admin/gallery", label: "Gallery", icon: icon("M3 6h4l2-2h6l2 2h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm9 3a5 5 0 1 0 5 5 5 5 0 0 0-5-5Z") },
    ],
  },
  {
    title: "Website",
    items: [
      { href: "/admin/images", label: "Website Images", icon: icon("M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1 13h14l-4.5-6-3.5 4.5-2.5-3L5 17Z") },
      { href: "/admin/content", label: "Website Content", icon: icon("M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm2 4v2h12V7H6Zm0 4v2h12v-2H6Zm0 4v2h8v-2H6Z") },
      { href: "/admin/contact", label: "Contact Details", icon: icon("M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.5 3 3 3.4 2.5 4 2.5h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z") },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/admin/profile", label: "Admin Profile", icon: icon("M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-8 2-8 5v3h16v-3c0-3-4-5-8-5Z") },
      { href: "/admin/settings", label: "Settings", icon: icon("M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4Zm9.4 4a7.6 7.6 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.2L16.5 3h-4l-.4 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z") },
    ],
  },
];

const allItems = navGroups.flatMap((group) => group.items);

/**
 * Two-tone admin frame: deep navy chrome around a white workspace.
 *
 * The sidebar carries the identity — gradient ground, a glowing rail down its
 * edge, icon chips and a lit pill on the active row — so the content area can
 * stay plain white and let dense tables and forms read at full contrast.
 */
export function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await clearSession();
    router.replace("/admin/login");
    router.refresh();
  }

  // Close the mobile drawer on navigation — adjusted during render rather than
  // in an effect (https://react.dev/learn/you-might-not-need-an-effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const current = allItems.find((item) => pathname.startsWith(item.href));

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-admin-bg text-admin-text">
        {open && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-admin-nav/60 backdrop-blur-sm lg:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[17rem] shrink-0 flex-col bg-[linear-gradient(180deg,#0b2450_0%,#071a35_45%,#05132a_100%)] transition-transform duration-300 ease-[var(--ease-premium)] lg:static lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Lit rail down the trailing edge — the sidebar's signature. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-px bg-[linear-gradient(180deg,transparent,rgba(56,189,248,0.55)_18%,rgba(30,94,255,0.45)_60%,transparent)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-leo-blue/20 blur-3xl"
          />

          {/* Brand */}
          <div className="relative flex h-20 items-center gap-3 px-5">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(140deg,#1e5eff,#38bdf8)] p-[1.5px]">
              <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] bg-white">
                <Image src="/logo.png" alt="" width={34} height={34} className="object-cover" />
              </span>
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold text-admin-nav-text">Leo Chautari</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-leo-cyan">
                Control panel
              </span>
            </span>
          </div>

          <nav className="relative flex-1 overflow-y-auto px-3 pb-4">
            {navGroups.map((group) => (
              <div key={group.title} className="mb-5">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-admin-nav-muted/60">
                  {group.title}
                </p>

                {group.items.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                        active
                          ? "bg-[linear-gradient(100deg,rgba(30,94,255,0.35),rgba(56,189,248,0.12))] text-white"
                          : "text-admin-nav-muted hover:bg-white/[0.06] hover:text-admin-nav-text"
                      }`}
                    >
                      {/* Active marker: a short cyan bar rather than a full border. */}
                      <span
                        aria-hidden
                        className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-leo-cyan transition-opacity duration-200 ${
                          active ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${
                          active
                            ? "bg-leo-cyan/20 text-leo-cyan"
                            : "bg-white/[0.05] text-admin-nav-muted group-hover:text-admin-nav-text"
                        }`}
                      >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                          {item.icon}
                        </svg>
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Signed-in card */}
          <div className="relative border-t border-white/10 p-3">
            <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.05] px-3 py-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(140deg,#1e5eff,#38bdf8)] text-xs font-bold text-white">
                {user.display_name.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-xs font-semibold text-admin-nav-text">
                  {user.display_name}
                </span>
                <span className="block text-[10px] text-admin-nav-muted">
                  {user.is_superuser ? "Superuser" : "Staff"}
                </span>
              </span>
              <button
                type="button"
                onClick={() => void handleSignOut()}
                aria-label="Log out"
                title="Log out"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-admin-nav-muted transition-colors hover:bg-red-500/20 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-cyan"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5v-2H5V5h5V3Zm6.6 4.6L15.2 9l2 2H9v2h8.2l-2 2 1.4 1.4L21 12l-4.4-4.4Z" />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-admin-border bg-admin-panel/95 px-4 backdrop-blur sm:px-6">
            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="rounded-lg border border-admin-border p-2 text-admin-text lg:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <h1 className="truncate text-base font-bold">{current?.label ?? "Admin"}</h1>

            <Link
              href="/"
              target="_blank"
              className="ml-auto hidden rounded-full border border-admin-border px-3 py-1.5 text-xs font-semibold text-admin-muted transition-colors hover:border-admin-accent hover:text-admin-accent sm:block"
            >
              View site ↗
            </Link>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
