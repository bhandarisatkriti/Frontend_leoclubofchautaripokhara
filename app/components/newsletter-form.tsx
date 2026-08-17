"use client";

import { useState } from "react";
import { API_URL, endpoints } from "@/app/lib/api";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const email = new FormData(form).get("email");

    try {
      const res = await fetch(`${API_URL}${endpoints.newsletter}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex overflow-hidden rounded-full border border-white/15 bg-white/5">
        <input
          type="email"
          name="email"
          required
          placeholder="Your email"
          className="w-full min-w-0 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-on-navy-muted focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-label="Subscribe"
          className="flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-leo-violet to-leo-blue px-4 text-white transition-[transform,box-shadow] duration-[var(--duration-fast)] hover:shadow-glow-blue disabled:opacity-60"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
      {status === "success" && (
        <p className="mt-2 text-xs text-leo-green">Subscribed — thank you!</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs text-on-navy-muted">
          Couldn&apos;t subscribe right now — please try again later.
        </p>
      )}
    </form>
  );
}
