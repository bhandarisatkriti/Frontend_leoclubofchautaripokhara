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
import { Pill, dateTime } from "@/app/components/admin/cells";
import { ApiError, adminApi } from "@/app/lib/admin/client";
import type { Paginated } from "@/app/lib/types";

/**
 * Inbox for messages sent through the public contact form.
 *
 * The dashboard counted these but nothing displayed them, so a message could
 * arrive and never be read. Everything except `status` and `admin_notes` is
 * read-only on the backend — the sender's words are a record, not something
 * staff edit.
 */

type Message = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  admin_notes: string;
  is_handled: boolean;
  created_at: string;
};

/** Mirrors `ContactMessage.Status` on the backend. */
const STATUSES = [
  { value: "NEW", label: "New", tone: "amber" as const },
  { value: "READ", label: "Read", tone: "blue" as const },
  { value: "REPLIED", label: "Replied", tone: "green" as const },
  { value: "ARCHIVED", label: "Archived", tone: "grey" as const },
];

const toneFor = (status: string) =>
  STATUSES.find((entry) => entry.value === status)?.tone ?? "grey";
const labelFor = (status: string) =>
  STATUSES.find((entry) => entry.value === status)?.label ?? status;

const PAGE_SIZE = 10;

export function MessageInbox() {
  const toast = useToast();

  const [rows, setRows] = useState<Message[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [reading, setReading] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState<Message | null>(null);
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
      ordering: "-created_at",
    });
    if (debounced) params.set("search", debounced);
    if (status) params.set("status", status);

    void (async () => {
      try {
        const data = await adminApi.get<Paginated<Message> | Message[]>(
          `contact?${params}`,
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
          error instanceof ApiError ? error.message : "Could not load messages.",
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

  /** Opening an unread message marks it read, the way an inbox should. */
  async function open(row: Message) {
    setReading(row);
    if (row.status !== "NEW") return;
    try {
      await adminApi.patch(`contact/${row.id}`, { status: "READ" });
      reload();
    } catch {
      /* leaving it unread is harmless */
    }
  }

  async function setRowStatus(row: Message, next: string, notes: string) {
    setBusy(true);
    try {
      await adminApi.patch(`contact/${row.id}`, {
        status: next,
        admin_notes: notes,
      });
      toast.success(`Message from ${row.name} updated.`);
      setReading(null);
      reload();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not update the message.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await adminApi.delete(`contact/${deleting.id}`);
      toast.success("Message deleted.");
      setDeleting(null);
      if (rows.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not delete the message.",
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
          placeholder="Search name, email or subject…"
          aria-label="Search messages"
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
        <LoadingState rows={4} />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={reload} />
      ) : rows.length === 0 ? (
        <AdminEmptyState
          message={
            debounced || status
              ? "No messages match those filters."
              : "No one has sent a message through the contact form yet."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-admin-border bg-admin-card">
          <table className="w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-admin-muted">
                <th className="px-5 py-3 font-semibold">From</th>
                <th className="px-5 py-3 font-semibold">Subject</th>
                <th className="px-5 py-3 font-semibold">Received</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-admin-border/70">
                  <td className="px-5 py-3">
                    <p className={row.status === "NEW" ? "font-bold" : "font-medium"}>
                      {row.name}
                    </p>
                    <p className="text-xs text-admin-muted">{row.email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="max-w-sm truncate">{row.subject}</p>
                    <p className="max-w-sm truncate text-xs text-admin-muted">
                      {row.message}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-admin-muted">
                    {dateTime(row.created_at)}
                  </td>
                  <td className="px-5 py-3">
                    <Pill tone={toneFor(row.status)}>{labelFor(row.status)}</Pill>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <AdminButton
                        tone="ghost"
                        className="px-3 py-1.5 text-xs"
                        onClick={() => void open(row)}
                      >
                        Read
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
            Page {page} of {totalPages} · {count} message{count === 1 ? "" : "s"}
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

      {reading && (
        <MessageModal
          message={reading}
          busy={busy}
          onClose={() => setReading(null)}
          onSave={(next, notes) => void setRowStatus(reading, next, notes)}
        />
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="Delete message"
        message={
          deleting
            ? `Permanently delete the message from ${deleting.name}? This cannot be undone.`
            : ""
        }
        busy={busy}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

function MessageModal({
  message,
  busy,
  onClose,
  onSave,
}: {
  message: Message;
  busy: boolean;
  onClose: () => void;
  onSave: (status: string, notes: string) => void;
}) {
  const [status, setStatus] = useState(message.status);
  const [notes, setNotes] = useState(message.admin_notes ?? "");

  return (
    <Modal open onClose={onClose} wide title={message.subject || "Message"}>
      <div className="space-y-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-admin-muted">From</dt>
            <dd className="mt-0.5 text-sm font-medium">{message.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-admin-muted">
              Received
            </dt>
            <dd className="mt-0.5 text-sm">{dateTime(message.created_at)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-admin-muted">Email</dt>
            <dd className="mt-0.5 text-sm">
              <a
                href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
                className="text-admin-accent hover:underline"
              >
                {message.email}
              </a>
            </dd>
          </div>
          {message.phone && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-admin-muted">
                Phone
              </dt>
              <dd className="mt-0.5 text-sm">{message.phone}</dd>
            </div>
          )}
        </dl>

        <div className="border-t border-admin-border pt-5">
          <p className="text-xs uppercase tracking-wide text-admin-muted">Message</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
            {message.message}
          </p>
        </div>

        <div className="space-y-4 border-t border-admin-border pt-5">
          <Field label="Status" htmlFor="msg_status">
            <select
              id="msg_status"
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
            htmlFor="msg_notes"
            hint="Never shown to the sender."
          >
            <textarea
              id="msg_notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className={fieldClasses}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-3 border-t border-admin-border pt-5">
          <AdminButton tone="ghost" onClick={onClose} disabled={busy}>
            Close
          </AdminButton>
          <AdminButton onClick={() => onSave(status, notes)} disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </AdminButton>
        </div>
      </div>
    </Modal>
  );
}
