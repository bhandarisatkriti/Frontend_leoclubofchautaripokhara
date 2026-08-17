"use client";

import { useState } from "react";
import { API_URL } from "@/app/lib/api";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "date" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: readonly string[];
  full?: boolean;
};

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Posts the form as JSON to `${API_URL}${endpoint}`. Field names must match the
 * serializer fields on the Django side.
 */
export function ApiForm({
  endpoint,
  fields,
  submitLabel,
  successMessage,
}: {
  endpoint: string;
  fields: readonly Field[];
  submitLabel: string;
  successMessage: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `${res.status} ${res.statusText}`);
      }

      form.reset();
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-leo-violet";

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.name}
          className={field.full || field.type === "textarea" ? "sm:col-span-2" : ""}
        >
          <label htmlFor={field.name} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-leo-red"> *</span>}
          </label>

          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              rows={5}
              className={inputClass}
            />
          ) : field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              required={field.required}
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select…
              </option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              placeholder={field.placeholder}
              className={inputClass}
            />
          )}
        </div>
      ))}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-leo-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-leo-red-dark disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : submitLabel}
        </button>

        {status === "success" && (
          <p className="mt-3 text-sm font-medium text-leo-green">{successMessage}</p>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-leo-red">
            Could not submit — {error}
          </p>
        )}
      </div>
    </form>
  );
}
