"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useToast } from "@/app/components/admin/toast";
import {
  AdminButton,
  AdminEmptyState,
  ConfirmDialog,
  ErrorState,
  Field,
  LoadingState,
  Modal,
  fieldClasses,
} from "@/app/components/admin/ui";
import { DateField } from "@/app/components/date-field";
import { TimeField } from "@/app/components/time-field";
import { ApiError, adminApi } from "@/app/lib/admin/client";
import type { Paginated } from "@/app/lib/types";

/**
 * Config-driven CRUD screen.
 *
 * Events, news, gallery and site images differ only in their fields, columns
 * and endpoint, so they share this rather than each carrying its own copy of
 * the search/filter/paginate/modal/delete machinery.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "date"
  | "time"
  | "select"
  | "checkbox"
  | "image";

export type FieldSpec = {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /**
   * Fill a `select` from a backend list endpoint instead of hard-coded
   * `options` — categories, albums and anything else an administrator can add
   * without a redeploy. Loaded once when the form opens; anything in `options`
   * is listed first, so the two can be combined.
   */
  optionsFrom?: {
    /** Django path, without slashes: "gallery/categories". */
    path: string;
    /** Row field submitted as the value. Default "id". */
    valueKey?: string;
    /** Row field shown in the dropdown. Default "name". */
    labelKey?: string;
  };
  /**
   * Read this field's starting value out of the row being edited.
   *
   * Foreign keys are written as `category_id` but read back as a nested
   * `category` object, so without this the edit form would open with the
   * category blank and silently clear it on save.
   */
  initial?: (row: Record<string, unknown>) => unknown;
  /** Blank the field out with a placeholder other than "Not set". */
  emptyLabel?: string;
  /** Span both columns in the two-column form grid. */
  full?: boolean;
};

export type ColumnSpec<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

export type FilterSpec = {
  param: string;
  label: string;
  options: { value: string; label: string }[];
};

export type ResourceConfig<T> = {
  /** Django path, without slashes: "events", "articles", "gallery". */
  path: string;
  /** Field used in detail URLs — "slug" for events/articles, "id" elsewhere. */
  idKey: keyof T & string;
  singular: string;
  /** Label for a row, used in toasts and the delete prompt. */
  labelOf: (row: T) => string;
  fields: FieldSpec[];
  columns: ColumnSpec<T>[];
  filters?: FilterSpec[];
  searchable?: boolean;
  ordering?: string;
  pageSize?: number;
  /** Initial values for the create form. */
  defaults: Record<string, unknown>;
  canCreate?: boolean;
  canDelete?: boolean;
  /** Extra note under the heading. */
  note?: string;
};

type RowLike = Record<string, unknown>;

export function ResourceManager<T extends RowLike>({
  config,
}: {
  config: ResourceConfig<T>;
}) {
  const toast = useToast();
  const pageSize = config.pageSize ?? 12;
  const canCreate = config.canCreate ?? true;
  const canDelete = config.canDelete ?? true;

  const [rows, setRows] = useState<T[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);

  function reload() {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);
    return () => window.clearTimeout(id);
  }, [search]);

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (config.ordering) params.set("ordering", config.ordering);
    if (debounced) params.set("search", debounced);
    for (const [key, value] of Object.entries(
      JSON.parse(filterKey) as Record<string, string>,
    )) {
      if (value) params.set(key, value);
    }

    void (async () => {
      try {
        const data = await adminApi.get<Paginated<T> | T[]>(
          `${config.path}?${params}`,
        );
        if (cancelled) return;
        setLoadError(null);
        if (Array.isArray(data)) {
          setRows(data);
          setCount(data.length);
        } else {
          setRows(data.results);
          setCount(data.count);
        }
      } catch (error) {
        if (cancelled) return;
        setLoadError(
          error instanceof ApiError
            ? error.message
            : `Could not load ${config.singular} records.`,
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debounced, filterKey, reloadKey, config.path, config.ordering, pageSize]);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await adminApi.delete(`${config.path}/${String(deleting[config.idKey])}`);
      toast.success(`${config.labelOf(deleting)} was deleted.`);
      setDeleting(null);
      if (rows.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not delete that record.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        {config.searchable !== false && (
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search…"
            aria-label="Search"
            className="min-w-56 flex-1 rounded-lg border border-admin-border bg-admin-card px-3 py-2.5 text-sm text-admin-text outline-none placeholder:text-admin-muted/60 focus:border-admin-accent-bright"
          />
        )}

        {config.filters?.map((filter) => (
          <select
            key={filter.param}
            aria-label={filter.label}
            value={filters[filter.param] ?? ""}
            onChange={(event) => {
              setFilters((current) => ({
                ...current,
                [filter.param]: event.target.value,
              }));
              setPage(1);
              setLoading(true);
            }}
            className="rounded-lg border border-admin-border bg-admin-card px-3 py-2.5 text-sm text-admin-text outline-none focus:border-admin-accent-bright"
          >
            <option value="">{filter.label}: all</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}

        {canCreate && (
          <AdminButton onClick={() => setEditing("new")}>
            + Add {config.singular}
          </AdminButton>
        )}
      </div>

      {loading ? (
        <LoadingState rows={5} />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={reload} />
      ) : rows.length === 0 ? (
        <AdminEmptyState
          message={`No ${config.singular} records found.`}
          action={
            canCreate ? (
              <AdminButton onClick={() => setEditing("new")}>
                Add the first {config.singular}
              </AdminButton>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-admin-border bg-admin-card">
          <table className="w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-admin-muted">
                {config.columns.map((column) => (
                  <th key={column.key} className="px-5 py-3 font-semibold">
                    {column.label}
                  </th>
                ))}
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={String(row[config.idKey])}
                  className="border-t border-admin-border/70"
                >
                  {config.columns.map((column) => (
                    <td key={column.key} className="px-5 py-3 align-top">
                      {column.render
                        ? column.render(row)
                        : String(row[column.key] ?? "—")}
                    </td>
                  ))}
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <AdminButton
                        tone="ghost"
                        className="px-3 py-1.5 text-xs"
                        onClick={() => setEditing(row)}
                      >
                        Edit
                      </AdminButton>
                      {canDelete && (
                        <AdminButton
                          tone="danger"
                          className="px-3 py-1.5 text-xs"
                          onClick={() => setDeleting(row)}
                        >
                          Delete
                        </AdminButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-admin-muted">
          <span>
            Page {page} of {totalPages} · {count} record{count === 1 ? "" : "s"}
          </span>
          <div className="flex gap-2">
            <AdminButton
              tone="ghost"
              className="px-3 py-1.5 text-xs"
              disabled={page <= 1}
              onClick={() => {
                setLoading(true);
                setPage((current) => current - 1);
              }}
            >
              Previous
            </AdminButton>
            <AdminButton
              tone="ghost"
              className="px-3 py-1.5 text-xs"
              disabled={page >= totalPages}
              onClick={() => {
                setLoading(true);
                setPage((current) => current + 1);
              }}
            >
              Next
            </AdminButton>
          </div>
        </div>
      )}

      {editing !== null && (
        <ResourceForm
          config={config}
          row={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(message) => {
            setEditing(null);
            toast.success(message);
            reload();
          }}
        />
      )}

      <ConfirmDialog
        open={deleting !== null}
        title={`Delete ${config.singular}`}
        message={
          deleting
            ? `Permanently delete "${config.labelOf(deleting)}"? This removes it from the public website immediately and cannot be undone.`
            : ""
        }
        busy={busy}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------- form -- */

/**
 * Coerce an API value into what the matching HTML input can display.
 *
 * `<input type="date">` only accepts `YYYY-MM-DD`, but some backend fields are
 * datetimes (an article's `published_at` arrives as
 * `2026-08-17T17:24:40+05:45`). Handing that to a date input renders it blank,
 * which then silently clears the value on save. Same story for `type="time"`,
 * which wants `HH:MM[:SS]`.
 */
function forInput(value: unknown, type?: FieldType): unknown {
  const text = String(value);
  if (type === "date") return text.slice(0, 10);
  if (type === "time") return text.slice(0, 5);
  return value;
}

/**
 * Empty date, time, number and select inputs must not be sent as `""`.
 *
 * DRF rejects an empty string for those field types outright ("Date has wrong
 * format", or for a foreign key "This field may not be null" vs an invalid pk),
 * so leaving an optional start time or category blank would fail the whole
 * save. `null` is what actually clears a nullable column.
 */
function forApi(
  values: Record<string, unknown>,
  fields: FieldSpec[],
): Record<string, unknown> {
  const typeByName = new Map(fields.map((field) => [field.name, field.type]));
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    const type = typeByName.get(key);
    const blank = value === "" || value === null || value === undefined;
    if (
      blank &&
      (type === "date" || type === "time" || type === "number" || type === "select")
    ) {
      payload[key] = null;
    } else {
      payload[key] = value;
    }
  }
  return payload;
}


function ResourceForm<T extends RowLike>({
  config,
  row,
  onClose,
  onSaved,
}: {
  config: ResourceConfig<T>;
  row: T | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    if (!row) return { ...config.defaults };
    const initial: Record<string, unknown> = {};
    for (const field of config.fields) {
      if (field.type === "image") continue;
      const value = field.initial ? field.initial(row) : row[field.name];
      initial[field.name] =
        value === null || value === undefined
          ? (config.defaults[field.name] ?? "")
          : forInput(value, field.type);
    }
    return initial;
  });

  // Options fetched from the backend, keyed by field name. Empty until the
  // request lands; the select still renders, just with nothing to pick yet.
  const [remoteOptions, setRemoteOptions] = useState<
    Record<string, { value: string; label: string }[]>
  >({});

  useEffect(() => {
    const sources = config.fields.filter((field) => field.optionsFrom);
    if (!sources.length) return;
    let cancelled = false;

    void (async () => {
      for (const field of sources) {
        const source = field.optionsFrom!;
        try {
          const data = await adminApi.get<Paginated<RowLike> | RowLike[]>(
            `${source.path}?page_size=200&ordering=${source.labelKey ?? "name"}`,
          );
          if (cancelled) return;
          const list = Array.isArray(data) ? data : data.results;
          setRemoteOptions((current) => ({
            ...current,
            [field.name]: list.map((item) => ({
              value: String(item[source.valueKey ?? "id"] ?? ""),
              label: String(item[source.labelKey ?? "name"] ?? ""),
            })),
          }));
        } catch {
          // A dropdown that cannot load its choices must not block the rest of
          // the form — the field simply offers nothing to select.
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [config.fields]);

  const [files, setFiles] = useState<Record<string, File>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Object URLs must be released or the tab leaks a blob per preview.
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

    const id = row ? String(row[config.idKey]) : null;
    const label = String(values[config.fields[0].name] ?? config.singular);

    try {
      const payload = forApi(values, config.fields);
      const hasFile = Object.keys(files).length > 0;

      if (hasFile) {
        const selects = new Set(
          config.fields.filter((f) => f.type === "select").map((f) => f.name),
        );
        const form = new FormData();
        for (const [key, value] of Object.entries(payload)) {
          // Multipart has no null, so a blank optional field is omitted
          // instead — the backend then leaves it untouched. A cleared dropdown
          // is the exception: it is sent as an empty value, or clearing a
          // photo's album while also replacing the photo would silently keep
          // the old album.
          if (value === null || value === undefined || value === "") {
            if (selects.has(key)) form.append(key, "");
            continue;
          }
          form.append(key, String(value));
        }
        for (const [key, file] of Object.entries(files)) form.append(key, file);
        if (id) await adminApi.patchForm(`${config.path}/${id}`, form);
        else await adminApi.postForm(config.path, form);
      } else if (id) {
        await adminApi.patch(`${config.path}/${id}`, payload);
      } else {
        await adminApi.post(config.path, payload);
      }

      onSaved(
        id ? `${label} was updated successfully.` : `${label} was created successfully.`,
      );
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.fieldErrors);
        setFormError(error.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
      setBusy(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={row ? `Edit ${config.singular}` : `Add ${config.singular}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {formError && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {formError}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {config.fields.map((field) => {
            const id = `field_${field.name}`;
            const fieldErrors = errors[field.name];
            const wide = field.full || field.type === "textarea" || field.type === "image";

            if (field.type === "image") {
              const existing = row ? (row[field.name] as string | null) : null;
              const preview = previews[field.name] ?? existing;
              return (
                <div key={field.name} className="sm:col-span-2">
                  <div className="flex flex-wrap items-center gap-5">
                    <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-admin-border bg-admin-raised">
                      {preview && (
                        <Image
                          src={preview}
                          alt=""
                          fill
                          sizes="96px"
                          className="object-cover"
                          unoptimized={Boolean(previews[field.name])}
                        />
                      )}
                    </span>
                    <div className="min-w-48 flex-1">
                      <Field
                        label={field.label}
                        htmlFor={id}
                        required={field.required && !row}
                        errors={fieldErrors}
                        hint={field.hint ?? "JPEG, PNG or WebP."}
                      >
                        <input
                          id={id}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          required={field.required && !row && !existing}
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
                  errors={fieldErrors}
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
                  ) : field.type === "select" ? (
                    <select
                      id={id}
                      required={field.required}
                      value={String(values[field.name] ?? "")}
                      onChange={(event) => setValue(field.name, event.target.value)}
                      className={fieldClasses}
                    >
                      <option value="">{field.emptyLabel ?? "Not set"}</option>
                      {[
                        ...(field.options ?? []),
                        ...(remoteOptions[field.name] ?? []),
                      ].map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "time" ? (
                    <TimeField
                      id={id}
                      required={field.required}
                      value={String(values[field.name] ?? "")}
                      onValueChange={(next) => setValue(field.name, next)}
                      className={fieldClasses}
                    />
                  ) : field.type === "date" ? (
                    <DateField
                      id={id}
                      required={field.required}
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

        <div className="flex justify-end gap-3 border-t border-admin-border pt-5">
          <AdminButton type="button" tone="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </AdminButton>
          <AdminButton type="submit" disabled={busy}>
            {busy ? "Saving…" : row ? "Save changes" : `Add ${config.singular}`}
          </AdminButton>
        </div>
      </form>
    </Modal>
  );
}
