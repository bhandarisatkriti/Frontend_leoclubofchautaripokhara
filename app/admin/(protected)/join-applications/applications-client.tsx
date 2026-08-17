"use client";

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
import { Pill, dateOnly, dateTime } from "@/app/components/admin/cells";
import { ApiError, adminApi } from "@/app/lib/admin/client";
import type { Paginated } from "@/app/lib/types";

/**
 * Join Now applications.
 *
 * Not built on `ResourceManager`: applications are submitted by the public and
 * are read-only to staff apart from `status` and `admin_notes`, so the screen
 * is a reviewing queue with a detail drawer rather than a CRUD table.
 */

type Application = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  age: number | null;
  occupation: string;
  status: string;
  status_display: string;
  submitted_at: string;
  reviewed_at: string | null;
};

type ApplicationDetail = Application & {
  date_of_birth: string;
  address: string;
  education: string;
  skills: string;
  previous_experience: string;
  reason_for_joining: string;
  social_media: string;
  profile_image: string | null;
  admin_notes: string;
  is_decided: boolean;
  reviewed_by: { display_name: string } | null;
};

/** Mirrors `MembershipApplication.Status` on the backend. */
const STATUSES = [
  { value: "PENDING", label: "Pending", tone: "amber" as const },
  { value: "REVIEWING", label: "Under review", tone: "blue" as const },
  { value: "APPROVED", label: "Approved", tone: "green" as const },
  { value: "REJECTED", label: "Rejected", tone: "red" as const },
];

const toneFor = (status: string) =>
  STATUSES.find((entry) => entry.value === status)?.tone ?? "grey";

const PAGE_SIZE = 12;

export function ApplicationsClient() {
  const toast = useToast();

  const [rows, setRows] = useState<Application[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [viewing, setViewing] = useState<ApplicationDetail | null>(null);
  const [deleting, setDeleting] = useState<Application | null>(null);
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

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(PAGE_SIZE),
      ordering: "-submitted_at",
    });
    if (debounced) params.set("search", debounced);
    if (status) params.set("status", status);

    void (async () => {
      try {
        const data = await adminApi.get<Paginated<Application> | Application[]>(
          `memberships?${params}`,
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
          error instanceof ApiError ? error.message : "Could not load applications.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, debounced, status, reloadKey]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  async function openDetail(row: Application) {
    try {
      setViewing(await adminApi.get<ApplicationDetail>(`memberships/${row.id}`));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not open that application.",
      );
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await adminApi.delete(`memberships/${deleting.id}`);
      toast.success(`${deleting.full_name}'s application was deleted.`);
      setDeleting(null);
      if (rows.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not delete that application.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email or phone…"
          aria-label="Search applications"
          className="min-w-56 flex-1 rounded-lg border border-admin-border bg-admin-card px-3 py-2.5 text-sm text-admin-text outline-none placeholder:text-admin-muted/60 focus:border-admin-accent-bright"
        />
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
            setLoading(true);
          }}
          aria-label="Filter by status"
          className="rounded-lg border border-admin-border bg-admin-card px-3 py-2.5 text-sm text-admin-text outline-none focus:border-admin-accent-bright"
        >
          <option value="">All statuses</option>
          {STATUSES.map((entry) => (
            <option key={entry.value} value={entry.value}>
              {entry.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingState rows={5} />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={reload} />
      ) : rows.length === 0 ? (
        <AdminEmptyState
          message={
            debounced || status
              ? "No applications match those filters."
              : "No one has applied through the Join Now form yet."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-admin-border bg-admin-card">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-admin-muted">
                <th className="px-5 py-3 font-semibold">Applicant</th>
                <th className="px-5 py-3 font-semibold">Contact</th>
                <th className="px-5 py-3 font-semibold">Submitted</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-admin-border/70">
                  <td className="px-5 py-3">
                    <p className="font-medium">{row.full_name}</p>
                    <p className="text-xs text-admin-muted">
                      {row.age ? `${row.age} years old` : ""}
                      {row.age && row.occupation ? " · " : ""}
                      {row.occupation}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-admin-muted">
                    <span className="block">{row.email}</span>
                    <span className="block text-xs">{row.phone}</span>
                  </td>
                  <td className="px-5 py-3 text-admin-muted">
                    {dateTime(row.submitted_at)}
                  </td>
                  <td className="px-5 py-3">
                    <Pill tone={toneFor(row.status)}>{row.status_display}</Pill>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <AdminButton
                        tone="ghost"
                        className="px-3 py-1.5 text-xs"
                        onClick={() => void openDetail(row)}
                      >
                        View
                      </AdminButton>
                      <AdminButton
                        tone="danger"
                        className="px-3 py-1.5 text-xs"
                        onClick={() => setDeleting(row)}
                      >
                        Delete
                      </AdminButton>
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
            Page {page} of {totalPages} · {count} application{count === 1 ? "" : "s"}
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

      {viewing && (
        <ApplicationDetailModal
          application={viewing}
          onClose={() => setViewing(null)}
          onSaved={(message) => {
            setViewing(null);
            toast.success(message);
            reload();
          }}
          onError={(message) => toast.error(message)}
        />
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="Delete application"
        message={
          deleting
            ? `Permanently delete ${deleting.full_name}'s application? This is personal data submitted by a member of the public and cannot be recovered.`
            : ""
        }
        busy={busy}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

/* ----------------------------------------------------------------- detail -- */

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-admin-muted">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-wrap text-sm">{value}</dd>
    </div>
  );
}

function ApplicationDetailModal({
  application,
  onClose,
  onSaved,
  onError,
}: {
  application: ApplicationDetail;
  onClose: () => void;
  onSaved: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.admin_notes ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await adminApi.patch(`memberships/${application.id}`, {
        status,
        admin_notes: notes,
      });
      onSaved(`${application.full_name}'s application was updated.`);
    } catch (error) {
      onError(
        error instanceof ApiError ? error.message : "Could not update the application.",
      );
      setBusy(false);
    }
  }

  return (
    <Modal open onClose={onClose} wide title={application.full_name}>
      <div className="space-y-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Row label="Email" value={application.email} />
          <Row label="Phone" value={application.phone} />
          <Row
            label="Date of birth"
            value={`${dateOnly(application.date_of_birth)}${
              application.age ? ` (${application.age} years)` : ""
            }`}
          />
          <Row label="Address" value={application.address} />
          <Row label="Education" value={application.education} />
          <Row label="Occupation" value={application.occupation} />
          <Row label="Social media" value={application.social_media} />
          <Row label="Submitted" value={dateTime(application.submitted_at)} />
        </dl>

        <div className="space-y-4 border-t border-admin-border pt-5">
          <Row label="Reason for joining" value={application.reason_for_joining} />
          <Row label="Skills" value={application.skills} />
          <Row label="Previous experience" value={application.previous_experience} />
        </div>

        <div className="space-y-4 border-t border-admin-border pt-5">
          <Field label="Status" htmlFor="app_status">
            <select
              id="app_status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={fieldClasses}
            >
              {STATUSES.map((entry) => (
                <option key={entry.value} value={entry.value}>
                  {entry.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Internal notes"
            htmlFor="app_notes"
            hint="Never shown to the applicant or on the public website."
          >
            <textarea
              id="app_notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className={fieldClasses}
            />
          </Field>

          {application.reviewed_by && (
            <p className="text-xs text-admin-muted">
              Last reviewed by {application.reviewed_by.display_name}
              {application.reviewed_at && ` on ${dateTime(application.reviewed_at)}`}.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-admin-border pt-5">
          <AdminButton tone="ghost" onClick={onClose} disabled={busy}>
            Close
          </AdminButton>
          <AdminButton onClick={() => void save()} disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </AdminButton>
        </div>
      </div>
    </Modal>
  );
}
