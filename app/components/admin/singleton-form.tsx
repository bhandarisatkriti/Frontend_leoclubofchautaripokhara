"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useToast } from "@/app/components/admin/toast";
import {
  AdminButton,
  ErrorState,
  Field,
  LoadingState,
  fieldClasses,
} from "@/app/components/admin/ui";
import type { FieldSpec } from "@/app/components/admin/resource-manager";
import { ApiError, adminApi } from "@/app/lib/admin/client";

/**
 * Edit-in-place form for a singleton resource such as `/api/club/`.
 *
 * The club endpoint answers 404 until an administrator creates the record and
 * treats POST as an upsert, so a missing profile is a normal first-run state
 * here rather than an error.
 */
export function SingletonForm({
  path,
  sections,
  emptyMessage,
}: {
  path: string;
  sections: { title: string; description?: string; fields: FieldSpec[] }[];
  emptyMessage: string;
}) {
  const toast = useToast();
  const allFields = sections.flatMap((section) => section.fields);

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [existing, setExisting] = useState<Record<string, unknown> | null>(null);
  const [files, setFiles] = useState<Record<string, File>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await adminApi.get<Record<string, unknown>>(path);
        if (cancelled) return;
        setExisting(data);
        const next: Record<string, unknown> = {};
        for (const field of allFields) {
          if (field.type === "image") continue;
          next[field.name] = data[field.name] ?? (field.type === "checkbox" ? false : "");
        }
        setValues(next);
        setLoadError(null);
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 404) {
          // Not an error: the record simply has not been created yet.
          setExisting(null);
          const next: Record<string, unknown> = {};
          for (const field of allFields) {
            if (field.type === "image") continue;
            next[field.name] = field.type === "checkbox" ? true : "";
          }
          setValues(next);
          setLoadError(null);
        } else {
          setLoadError(
            error instanceof ApiError ? error.message : "Could not load this record.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, reloadKey]);

  useEffect(() => {
    const urls = Object.values(previews);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  function setValue(name: string, value: unknown) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function setFile(name: string, file: File | null) {
    setFiles((current) => {
      const next = { ...current };
      if (file) next[name] = file;
      else delete next[name];
      return next;
    });
    setPreviews((current) => {
      const next = { ...current };
      if (current[name]) URL.revokeObjectURL(current[name]);
      if (file) next[name] = URL.createObjectURL(file);
      else delete next[name];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setFormError(null);

    try {
      const hasFile = Object.keys(files).length > 0;
      if (hasFile) {
        const form = new FormData();
        for (const [key, value] of Object.entries(values)) {
          if (value === null || value === undefined) continue;
          form.append(key, typeof value === "boolean" ? String(value) : String(value));
        }
        for (const [key, file] of Object.entries(files)) form.append(key, file);
        // POST upserts on this endpoint, so it is correct whether or not the
        // record already exists.
        await adminApi.postForm(path, form);
      } else if (existing) {
        await adminApi.patch(path, values);
      } else {
        await adminApi.post(path, values);
      }

      toast.success("Saved. The public website will show the update shortly.");
      setFiles({});
      setPreviews({});
      setReloadKey((key) => key + 1);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.fieldErrors);
        setFormError(error.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <LoadingState rows={6} />;
  if (loadError)
    return <ErrorState message={loadError} onRetry={() => setReloadKey((k) => k + 1)} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!existing && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {emptyMessage}
        </p>
      )}

      {formError && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </p>
      )}

      {sections.map((section) => (
        <section
          key={section.title}
          className="rounded-xl border border-admin-border bg-admin-card p-5 sm:p-6"
        >
          <h3 className="font-semibold">{section.title}</h3>
          {section.description && (
            <p className="mt-1 text-sm text-admin-muted">{section.description}</p>
          )}

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {section.fields.map((field) => {
              const id = `single_${field.name}`;
              const wide =
                field.full || field.type === "textarea" || field.type === "image";

              if (field.type === "image") {
                const preview =
                  previews[field.name] ?? (existing?.[field.name] as string | null);
                return (
                  <div key={field.name} className="sm:col-span-2">
                    <div className="flex flex-wrap items-center gap-5">
                      <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-admin-border bg-admin-raised">
                        {preview && (
                          <Image
                            src={preview}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-contain"
                            unoptimized={Boolean(previews[field.name])}
                          />
                        )}
                      </span>
                      <div className="min-w-48 flex-1">
                        <Field
                          label={field.label}
                          htmlFor={id}
                          errors={errors[field.name]}
                          hint={field.hint}
                        >
                          <input
                            id={id}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/svg+xml"
                            onChange={(event) =>
                              setFile(field.name, event.target.files?.[0] ?? null)
                            }
                            className="mt-1.5 block w-full text-sm text-admin-muted file:mr-3 file:rounded-lg file:border-0 file:bg-admin-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-admin-accent-bright"
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                );
              }

              if (field.type === "checkbox") {
                return (
                  <label
                    key={field.name}
                    className="flex items-center gap-2.5 self-end text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(values[field.name])}
                      onChange={(event) => setValue(field.name, event.target.checked)}
                      className="h-4 w-4 rounded border-admin-border bg-admin-bg"
                    />
                    {field.label}
                  </label>
                );
              }

              return (
                <div key={field.name} className={wide ? "sm:col-span-2" : ""}>
                  <Field
                    label={field.label}
                    htmlFor={id}
                    required={field.required}
                    errors={errors[field.name]}
                    hint={field.hint}
                  >
                    {field.type === "textarea" ? (
                      <textarea
                        id={id}
                        rows={4}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={String(values[field.name] ?? "")}
                        onChange={(event) => setValue(field.name, event.target.value)}
                        className={fieldClasses}
                      />
                    ) : (
                      <input
                        id={id}
                        type={field.type ?? "text"}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={String(values[field.name] ?? "")}
                        onChange={(event) =>
                          setValue(
                            field.name,
                            field.type === "number"
                              ? Number(event.target.value)
                              : event.target.value,
                          )
                        }
                        className={fieldClasses}
                      />
                    )}
                  </Field>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="flex justify-end">
        <AdminButton type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </AdminButton>
      </div>
    </form>
  );
}
