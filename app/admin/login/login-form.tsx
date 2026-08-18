"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminButton, Field } from "@/app/components/admin/ui";

/** Fields here sit on the navy sign-in panel, not the light workspace. */
const loginFieldClasses =
  "mt-1.5 w-full rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white " +
  "outline-none placeholder:text-white/40 focus:border-leo-cyan";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const data = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { detail?: string };
        setError(body.detail ?? "Sign-in failed. Please try again.");
        setBusy(false);
        return;
      }

      // A full refresh so the protected layout re-runs and reads the new cookie.
      router.replace(next);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-100"
        >
          {error}
        </p>
      )}

      <Field label="Email" htmlFor="email" required>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          className={loginFieldClasses}
          placeholder="you@example.com"
        />
      </Field>

      <Field label="Password" htmlFor="password" required>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={loginFieldClasses}
        />
      </Field>

      <AdminButton type="submit" disabled={busy} className="w-full">
        {busy ? "Signing in…" : "Sign in"}
      </AdminButton>
    </form>
  );
}
