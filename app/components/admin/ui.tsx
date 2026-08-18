"use client";

import { useEffect, useRef } from "react";

/**
 * Shared presentational primitives for the admin dashboard: states, buttons,
 * fields and dialogs. Kept in one module because each is a handful of lines and
 * they are almost always imported together.
 */

/* ---------------------------------------------------------------- buttons -- */

type ButtonTone = "primary" | "ghost" | "danger";

const toneClasses: Record<ButtonTone, string> = {
  primary:
    "bg-admin-accent text-white hover:bg-admin-accent-bright disabled:opacity-50",
  ghost:
    "border border-admin-border bg-transparent text-admin-text hover:bg-admin-raised/50 disabled:opacity-50",
  danger: "bg-red-600 text-white hover:bg-red-500 disabled:opacity-50",
};

export function AdminButton({
  tone = "primary",
  className = "",
  ...rest
}: { tone?: ButtonTone } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-admin-bg disabled:cursor-not-allowed ${toneClasses[tone]} ${className}`}
    />
  );
}

/* ----------------------------------------------------------------- states -- */

export function LoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="h-14 rounded-lg border border-admin-border bg-admin-card"
        >
          <div className="skeleton h-full w-full rounded-lg opacity-40" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <AdminButton tone="ghost" className="mt-4" onClick={onRetry}>
          Try again
        </AdminButton>
      )}
    </div>
  );
}

export function AdminEmptyState({
  message,
  action,
}: {
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-admin-border px-6 py-16 text-center">
      <p className="text-sm text-admin-muted">{message}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/* ----------------------------------------------------------------- fields -- */

export function Field({
  label,
  htmlFor,
  errors,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  errors?: string[];
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && !errors?.length && (
        <p className="mt-1 text-xs text-admin-muted">{hint}</p>
      )}
      {errors?.map((error) => (
        <p key={error} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ))}
    </div>
  );
}

export const fieldClasses =
  "mt-1.5 w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-muted/60 focus:border-admin-accent-bright";

/* ---------------------------------------------------------------- dialogs -- */

/**
 * Modal built on `<dialog>` so focus trapping, Escape and the top layer come
 * from the platform rather than a hand-rolled implementation.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself) dismisses.
        if (event.target === ref.current) onClose();
      }}
      className={`m-auto w-[calc(100vw-2rem)] rounded-2xl border border-admin-border bg-admin-panel p-0 text-admin-text backdrop:bg-black/60 ${
        wide ? "max-w-3xl" : "max-w-lg"
      }`}
    >
      <div className="flex items-center justify-between border-b border-admin-border px-6 py-4">
        <h2 className="text-base font-bold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1 text-admin-muted transition-colors hover:bg-admin-raised/60 hover:text-admin-text"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
    </dialog>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-admin-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <AdminButton tone="ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </AdminButton>
        <AdminButton tone="danger" onClick={onConfirm} disabled={busy}>
          {busy ? "Working…" : confirmLabel}
        </AdminButton>
      </div>
    </Modal>
  );
}
