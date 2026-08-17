"use client";

import { useState } from "react";
import { buttonClasses } from "@/app/components/ui/button-link";
import { submitForm } from "@/app/lib/api";
import { DateField } from "@/app/components/date-field";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "date" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: readonly string[];
  full?: boolean;
  /** Shown under the field; also used to surface backend rules up front. */
  hint?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Posts the form to `${API_URL}${endpoint}`. Field names must match the
 * serializer fields on the Django side.
 *
 * Validation errors come back from DRF keyed by field name, so they are
 * rendered against the input they belong to rather than as one opaque blob.
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(successMessage);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);
    setFieldErrors({});

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    const result = await submitForm(endpoint, payload);

    if (result.ok) {
      form.reset();
      setSuccess(result.detail || successMessage);
      setStatus("success");
      return;
    }

    setError(result.detail);
    setFieldErrors(result.fieldErrors);
    setStatus("error");
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-[border-color,box-shadow] duration-[var(--duration-fast)] focus:border-leo-blue focus:shadow-soft-sm";
  const errorClass =
    "mt-1.5 w-full rounded-lg border border-leo-red bg-background px-3.5 py-2.5 text-sm outline-none transition-[border-color,box-shadow] duration-[var(--duration-fast)] focus:border-leo-red focus:shadow-soft-sm";

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => {
        const messages = fieldErrors[field.name];
        const invalid = Boolean(messages?.length);
        const describedBy = invalid
          ? `${field.name}-error`
          : field.hint
            ? `${field.name}-hint`
            : undefined;

        const shared = {
          id: field.name,
          name: field.name,
          required: field.required,
          placeholder: field.placeholder,
          "aria-invalid": invalid || undefined,
          "aria-describedby": describedBy,
          className: invalid ? errorClass : inputClass,
        };

        return (
          <div
            key={field.name}
            className={field.full || field.type === "textarea" ? "sm:col-span-2" : ""}
          >
            <label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-leo-red"> *</span>}
            </label>

            {field.type === "textarea" ? (
              <textarea {...shared} rows={5} />
            ) : field.type === "select" ? (
              <select {...shared} defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === "date" ? (
              <DateField {...shared} birthdate={field.name === "date_of_birth"} />
            ) : (
              <input {...shared} type={field.type ?? "text"} />
            )}

            {invalid ? (
              <p id={`${field.name}-error`} className="mt-1.5 text-sm text-leo-red">
                {messages!.join(" ")}
              </p>
            ) : (
              field.hint && (
                <p id={`${field.name}-hint`} className="mt-1.5 text-xs text-muted">
                  {field.hint}
                </p>
              )
            )}
          </div>
        );
      })}

      {/*
        Honeypot. The backend rejects any submission where `website` is filled
        in, which stops most drive-by bots. Hidden from sighted users and from
        assistive technology, and kept out of the tab order.
      */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={buttonClasses(
            "primary",
            "md",
            "disabled:opacity-60 disabled:hover:translate-y-0",
          )}
        >
          {status === "submitting" ? "Sending…" : submitLabel}
        </button>

        <div aria-live="polite">
          {status === "success" && (
            <p className="mt-3 text-sm font-medium text-leo-green">{success}</p>
          )}
          {status === "error" && error && (
            <p className="mt-3 text-sm text-leo-red">{error}</p>
          )}
        </div>
      </div>
    </form>
  );
}
