"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/app/components/admin/toast";
import {
  AdminButton,
  AdminEmptyState,
  ErrorState,
  LoadingState,
  Modal,
} from "@/app/components/admin/ui";
import { ApiError, adminApi } from "@/app/lib/admin/client";
import type { Paginated } from "@/app/lib/types";

/**
 * Photographs attached to one event.
 *
 * These are ordinary gallery images carrying a link to the event, which is why
 * this is a separate panel rather than a field on the event form: each photo is
 * its own record with its own upload, and several can be added at once. It also
 * needs the event to exist before anything can point at it, so it hangs off the
 * row rather than the create form.
 */

type Photo = {
  id: number;
  title: string;
  image: string | null;
  description: string;
};

/** "river-cleanup_02.jpg" -> "River cleanup 02" */
function titleFromFile(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  const cleaned = base.replace(/\s+/g, " ");
  if (cleaned.length < 2) return "Event photo";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function EventPhotosButton({
  eventId,
  eventTitle,
}: {
  eventId: number;
  eventTitle: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AdminButton
        tone="ghost"
        className="px-3 py-1.5 text-xs"
        onClick={() => setOpen(true)}
      >
        Photos
      </AdminButton>
      {open && (
        <EventPhotosModal
          eventId={eventId}
          eventTitle={eventTitle}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function EventPhotosModal({
  eventId,
  eventTitle,
  onClose,
}: {
  eventId: number;
  eventTitle: string;
  onClose: () => void;
}) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [rows, setRows] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await adminApi.get<Paginated<Photo> | Photo[]>(
          `gallery?event_id=${eventId}&page_size=100&ordering=display_order`,
        );
        if (cancelled) return;
        setLoadError(null);
        setRows(Array.isArray(data) ? data : data.results);
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof ApiError ? error.message : "Could not load photos.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [eventId, reloadKey]);

  /**
   * Uploaded one at a time rather than in one request: the API creates one
   * image per call, and doing them in sequence means a single rejected file
   * (too large, wrong type) reports itself without taking the rest down.
   */
  async function upload(files: FileList) {
    const list = Array.from(files);
    if (!list.length) return;

    setBusy(true);
    setProgress({ done: 0, total: list.length });
    const failed: string[] = [];

    for (const [i, file] of list.entries()) {
      const form = new FormData();
      form.append("title", titleFromFile(file.name));
      form.append("image", file);
      form.append("event_id", String(eventId));
      try {
        await adminApi.postForm("gallery", form);
      } catch (error) {
        failed.push(
          `${file.name}: ${error instanceof ApiError ? error.message : "upload failed"}`,
        );
      }
      setProgress({ done: i + 1, total: list.length });
    }

    setBusy(false);
    setProgress(null);
    if (fileRef.current) fileRef.current.value = "";

    const added = list.length - failed.length;
    if (added > 0) {
      toast.success(`${added} photo${added === 1 ? "" : "s"} added to ${eventTitle}.`);
    }
    if (failed.length) toast.error(failed.join(" · "));

    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  /** Deletes the image record outright — it is not merely detached. */
  async function remove(photo: Photo) {
    setBusy(true);
    try {
      await adminApi.delete(`gallery/${photo.id}`);
      setRows((current) => current.filter((row) => row.id !== photo.id));
      toast.success("Photo deleted.");
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not delete the photo.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open onClose={onClose} wide title={`Photos — ${eventTitle}`}>
      <div className="space-y-6">
        <div className="rounded-xl border border-dashed border-admin-border bg-admin-raised/40 p-5">
          <label
            htmlFor="event_photos"
            className="block text-sm font-semibold text-admin-text"
          >
            Add photographs
          </label>
          <p className="mt-1 text-xs text-admin-muted">
            Select as many as you like at once. Each one is added to the gallery
            and shown on this event&rsquo;s page. The file name becomes the
            title, which you can change under Gallery.
          </p>
          <input
            id="event_photos"
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            disabled={busy}
            onChange={(event) => {
              if (event.target.files) void upload(event.target.files);
            }}
            className="mt-3 block w-full text-sm text-admin-text file:mr-3 file:rounded-lg file:border-0 file:bg-admin-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-admin-accent-bright disabled:opacity-60"
          />
          {progress && (
            <p className="mt-3 text-xs font-semibold text-admin-accent">
              Uploading {progress.done} of {progress.total}…
            </p>
          )}
        </div>

        {loading ? (
          <LoadingState rows={2} />
        ) : loadError ? (
          <ErrorState
            message={loadError}
            onRetry={() => {
              setLoading(true);
              setReloadKey((key) => key + 1);
            }}
          />
        ) : rows.length === 0 ? (
          <AdminEmptyState message="No photographs on this event yet." />
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
              {rows.length} photo{rows.length === 1 ? "" : "s"}
            </p>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {rows.map((photo) => (
                <li
                  key={photo.id}
                  className="overflow-hidden rounded-xl border border-admin-border bg-admin-card"
                >
                  <div className="relative aspect-4/3 bg-admin-raised">
                    {photo.image && (
                      <Image
                        src={photo.image}
                        alt={photo.title}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="line-clamp-2 text-xs font-medium text-admin-text">
                      {photo.title}
                    </p>
                    <AdminButton
                      tone="danger"
                      className="w-full px-2 py-1 text-[11px]"
                      disabled={busy}
                      onClick={() => void remove(photo)}
                    >
                      Delete
                    </AdminButton>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="flex justify-end border-t border-admin-border pt-5">
          <AdminButton tone="ghost" onClick={onClose} disabled={busy}>
            Done
          </AdminButton>
        </div>
      </div>
    </Modal>
  );
}
