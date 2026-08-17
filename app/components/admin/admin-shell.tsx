"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ToastProvider } from "@/app/components/admin/toast";
import { clearSession } from "@/app/lib/admin/client";
import type { AdminUser } from "@/app/lib/admin/types";

const navSections: { href: string; label: string; icon: React.ReactNode }[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: icon("M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z") },
  { href: "/admin/team", label: "Team Management", icon: icon("M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0 2c-2.7 0-6 1.3-6 4v3h8v-3c0-1 .4-2 1.1-2.8A11 11 0 0 0 8 14Zm8 0c-3 0-8 1.5-8 4.5V21h16v-2.5C24 15.5 19 14 16 14Z") },
  { href: "/admin/images", label: "Hero / Website Images", icon: icon("M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1 13h14l-4.5-6-3.5 4.5-2.5-3L5 17Z") },
  { href: "/admin/contact", label: "Contact Information", icon: icon("M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.5 3 3 3.4 2.5 4 2.5h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z") },
  { href: "/admin/join-applications", label: "Join Applications", icon: icon("M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm8 1.5V8h4.5L14 3.5ZM8 12h8v2H8v-2Zm0 4h8v2H8v-2Z") },
  { href: "/admin/events", label: "Events Management", icon: icon("M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7ZM5 9h14v11H5V9Z") },
  { href: "/admin/news", label: "News Management", icon: icon("M4 4h13a1 1 0 0 1 1 1v13a2 2 0 0 0 2 2H5a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Zm2 4v3h9V8H6Zm0 5v2h9v-2H6Z") },
  { href: "/admin/gallery", label: "Gallery", icon: icon("M3 6h4l2-2h6l2 2h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm9 3a5 5 0 1 0 5 5 5 5 0 0 0-5-5Z") },
  { href: "/admin/content", label: "Website Content", icon: icon("M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm2 4v2h12V7H6Zm0 4v2h12v-2H6Zm0 4v2h8v-2H6Z") },
  { href: "/admin/profile", label: "Admin Profile", icon: icon("M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-8 2-8 5v3h16v-3c0-3-4-5-8-5Z") },
  { href: "/admin/settings", label: "Settings", icon: icon("M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4Zm9.4 4a7.6 7.6 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.2L16.5 3h-4l-.4 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z") },
];

function icon(d: string) {
  return <path d={d} />;
}

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

  const current = navSections.find((item) => pathname.startsWith(item.href));

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-admin-bg text-admin-text">
        {/* Backdrop for the mobile drawer */}
        {open && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-68 shrink-0 flex-col border-r border-admin-border bg-admin-panel transition-transform duration-300 ease-[var(--ease-premium)] lg:static lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ width: "17rem" }}
        >
          <div className="flex h-16 items-center gap-2.5 border-b border-admin-border px-5">
            <Image src="/logo.png" alt="" width={32} height={32} className="rounded-full bg-white" />
            <span className="text-sm font-bold leading-tight">
              Leo Chautari
              <span className="block text-[11px] font-normal text-admin-muted">
                Admin dashboard
              </span>
            </span>
          </div>

          <nav className="flex-1 overflow-y-auto p-3">
            {navSections.map((item) => {
              const active = pathname.startsWith(item.href);
              const body = (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                    {item.icon}
                  </svg>
                  <span className="flex-1">{item.label}</span>
                </>
              );


              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "bg-admin-accent text-white"
                      : "text-admin-muted hover:bg-admin-raised/50 hover:text-admin-text"
                  }`}
                >
                  {body}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-admin-border p-3">
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-admin-muted transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                <path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5v-2H5V5h5V3Zm6.6 4.6L15.2 9l2 2H9v2h8.2l-2 2 1.4 1.4L21 12l-4.4-4.4Z" />
              </svg>
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-admin-border bg-admin-panel/95 px-4 backdrop-blur sm:px-6">
            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="rounded-md border border-admin-border p-2 lg:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <h1 className="truncate text-base font-bold">
              {current?.label ?? "Admin"}
            </h1>

            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="hidden text-xs font-medium text-admin-muted transition-colors hover:text-admin-text sm:block"
              >
                View site ↗
              </Link>
              <div className="flex items-center gap-2.5 border-l border-admin-border pl-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-accent text-xs font-bold text-white">
                  {user.display_name.slice(0, 2).toUpperCase()}
                </span>
                <span className="hidden leading-tight sm:block">
                  <span className="block text-xs font-semibold">{user.display_name}</span>
                  <span className="block text-[11px] text-admin-muted">
                    {user.is_superuser ? "Superuser" : "Staff"}
                  </span>
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
