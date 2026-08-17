import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/app/admin/login/login-form";
import { site } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Administrator sign-in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Only allow same-site relative paths back, so `?next=` cannot be used as an open redirect. */
function safeNext(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin/dashboard";
  }
  return value;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const { next, reason } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4 py-12 text-admin-text">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt=""
            width={64}
            height={64}
            className="rounded-full bg-white"
            priority
          />
          <h1 className="mt-5 text-2xl font-bold tracking-tight">
            Administrator sign-in
          </h1>
          <p className="mt-2 text-sm text-admin-muted">
            {site.name} website management
          </p>
        </div>

        {reason === "unauthorized" && (
          <p className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Please sign in with an administrator account to continue.
          </p>
        )}

        <div className="mt-8 rounded-2xl border border-admin-border bg-admin-card p-6 shadow-soft-lg sm:p-8">
          <LoginForm next={safeNext(next)} />
        </div>

        <p className="mt-6 text-center text-xs text-admin-muted">
          <Link href="/" className="transition-colors hover:text-admin-text">
            ← Back to the public website
          </Link>
        </p>
      </div>
    </div>
  );
}
