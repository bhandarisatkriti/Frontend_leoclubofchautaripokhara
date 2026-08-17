"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useToast } from "@/app/components/admin/toast";
import { ApiError, adminApi } from "@/app/lib/admin/client";
import type { AdminTeamMember } from "@/app/lib/admin/types";
import type { Paginated } from "@/app/lib/types";

const PAGE_SIZE = 12;

type Filter = "all" | "active" | "inactive";

const blank = {
  name: "",
  position: "",
  bio: "",
  email: "",
  phone: "",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
  display_order: 0,
  is_active: true,
};

export function TeamManager() {
  const toast = useToast();

  const [members, setMembers] = useState<AdminTeamMember[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editing, setEditing] = useState<AdminTeamMember | null | "new">(null);
  const [deleting, setDeleting] = useState<AdminTeamMember | null>(null);
  const [busy, setBusy] = useState(false);

  // Debounce the search box so typing does not fire a request per keystroke.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => window.clearTimeout(id);
  }, [search]);

  /**
   * Bumped to force a refetch after a mutation. Filters and paging already
   * re-run the effect through their own dependencies.
   */
  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    // `cancelled` drops the response of a superseded request: typing quickly
    // or paging fast can otherwise let an older response overwrite a newer one.
    let cancelled = false;

    const params = new URLSearchParams({
      page: String(page),
      page_size: String(PAGE_SIZE),
      ordering: "display_order",
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    // No "include inactive" flag is needed: TeamMemberViewSet already returns
    // the full roster to staff and only hides inactive members from the public.
    if (filter !== "all") params.set("active", String(filter === "active"));

    void (async () => {
      try {
        const data = await adminApi.get<Paginated<AdminTeamMember> | AdminTeamMember[]>(
          `team?${params}`,
        );
        if (cancelled) return;
        setLoadError(null);
        if (Array.isArray(data)) {
          setMembers(data);
          setCount(data.length);
        } else {
          setMembers(data.results);
          setCount(data.count);
        }
      } catch (error) {
        if (cancelled) return;
        setLoadError(
          error instanceof ApiError ? error.message : "Could not load team members.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, filter, reloadKey]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await adminApi.delete(`team/${deleting.id}`);
      toast.success(`${deleting.name} was removed from the team.`);
      setDeleting(null);
      // Stepping back a page avoids landing on an empty last page.
      if (members.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not delete that member.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(member: AdminTeamMember) {
    try {
      await adminApi.patch(`team/${member.id}`, { is_active: !member.is_active });
      toast.success(
        `${member.name} is now ${member.is_active ? "hidden from" : "visible on"} the website.`,
      );
      reload();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not update that member.",
      );
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or position…"
          aria-label="Search team members"
          className="min-w-56 flex-1 rounded-lg border border-admin-border bg-admin-card px-3 py-2.5 text-sm text-admin-text outline-none placeholder:text-admin-muted/60 focus:border-admin-accent-bright"
        />

        <select
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value as Filter);
            setPage(1);
            setLoading(true);
          }}
          aria-label="Filter by status"
          className="rounded-lg border border-admin-border bg-admin-card px-3 py-2.5 text-sm text-admin-text outline-none focus:border-admin-accent-bright"
        >
          <option value="all">All statuses</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>

        <AdminButton onClick={() => setEditing("new")}>+ Add member</AdminButton>
      </div>

      {loading ? (
        <LoadingState rows={5} />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={reload} />
      ) : members.length === 0 ? (
        <AdminEmptyState
          message={
            debouncedSearch || filter !== "all"
              ? "No team members match those filters."
              : "No team members yet."
          }
          action={<AdminButton onClick={() => setEditing("new")}>Add the first member</AdminButton>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-admin-border bg-admin-card">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-admin-muted">
                <th className="px-5 py-3 font-semibold">Member</th>
                <th className="px-5 py-3 font-semibold">Position</th>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t border-admin-border/70">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-admin-raised">
                        {member.profile_image && (
                          <Image
                            src={member.profile_image}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{member.name}</p>
                        {member.email && (
                          <p className="truncate text-xs text-admin-muted">{member.email}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-admin-muted">{member.position}</td>
                  <td className="px-5 py-3 tabular-nums text-admin-muted">
                    {member.display_order}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => void toggleActive(member)}
                      title="Toggle whether this member appears on the public website"
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                        member.is_active
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                          : "border-admin-border text-admin-muted hover:bg-admin-raised/50"
                      }`}
                    >
                      {member.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <AdminButton
                        tone="ghost"
                        className="px-3 py-1.5 text-xs"
                        onClick={() => setEditing(member)}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        tone="danger"
                        className="px-3 py-1.5 text-xs"
                        onClick={() => setDeleting(member)}
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
            Page {page} of {totalPages} · {count} member{count === 1 ? "" : "s"}
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
        <TeamMemberForm
          member={editing === "new" ? null : editing}
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
        title="Delete team member"
        message={
          deleting
            ? `Permanently delete ${deleting.name}? They will disappear from the public website immediately. To hide them without losing the record, set them to Inactive instead.`
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

function TeamMemberForm({
  member,
  onClose,
  onSaved,
}: {
  member: AdminTeamMember | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [values, setValues] = useState(() =>
    member
      ? {
          name: member.name,
          position: member.position,
          bio: member.bio ?? "",
          email: member.email ?? "",
          phone: member.phone ?? "",
          facebook_url: member.facebook_url ?? "",
          instagram_url: member.instagram_url ?? "",
          linkedin_url: member.linkedin_url ?? "",
          display_order: member.display_order,
          is_active: member.is_active,
        }
      : { ...blank },
  );
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const previewUrl = useMemo(
    () => (photo ? URL.createObjectURL(photo) : null),
    [photo],
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setFormError(null);

    try {
      // Multipart only when a file is attached; JSON is cheaper and avoids
      // Django coercing "false" to True for the boolean.
      if (photo) {
        const form = new FormData();
        for (const [key, value] of Object.entries(values)) {
          form.append(key, typeof value === "boolean" ? String(value) : String(value));
        }
        form.append("profile_image", photo);
        if (member) await adminApi.patchForm(`team/${member.id}`, form);
        else await adminApi.postForm("team", form);
      } else if (member) {
        await adminApi.patch(`team/${member.id}`, values);
      } else {
        await adminApi.post("team", values);
      }

      onSaved(
        member
          ? `${values.name} was updated successfully.`
          : `${values.name} was added to the team.`,
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

  const currentImage = previewUrl ?? member?.profile_image ?? null;

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={member ? `Edit ${member.name}` : "Add team member"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {formError && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {formError}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-5">
          <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-admin-border bg-admin-raised">
            {currentImage && (
              <Image
                src={currentImage}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
                unoptimized={Boolean(previewUrl)}
              />
            )}
          </span>
          <div className="min-w-48 flex-1">
            <label htmlFor="profile_image" className="text-sm font-medium">
              Profile photo
            </label>
            <input
              id="profile_image"
              name="profile_image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
              className="mt-1.5 block w-full text-sm text-admin-muted file:mr-3 file:rounded-lg file:border-0 file:bg-admin-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-admin-accent-bright"
            />
            <p className="mt-1 text-xs text-admin-muted">
              JPEG, PNG or WebP. The server rejects anything over its upload limit.
            </p>
            {errors.profile_image?.map((message) => (
              <p key={message} className="mt-1 text-xs text-red-300">
                {message}
              </p>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name" required errors={errors.name}>
            <input
              id="name"
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              required
              maxLength={150}
              className={fieldClasses}
            />
          </Field>

          <Field
            label="Position / title"
            htmlFor="position"
            required
            errors={errors.position}
            hint="Shown under the name on the public site, e.g. Club President."
          >
            <input
              id="position"
              value={values.position}
              onChange={(event) => set("position", event.target.value)}
              required
              maxLength={120}
              className={fieldClasses}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Short biography" htmlFor="bio" errors={errors.bio}>
              <textarea
                id="bio"
                value={values.bio}
                onChange={(event) => set("bio", event.target.value)}
                rows={3}
                className={fieldClasses}
              />
            </Field>
          </div>

          <Field label="Email" htmlFor="member_email" errors={errors.email}>
            <input
              id="member_email"
              type="email"
              value={values.email}
              onChange={(event) => set("email", event.target.value)}
              className={fieldClasses}
            />
          </Field>

          <Field label="Phone" htmlFor="member_phone" errors={errors.phone}>
            <input
              id="member_phone"
              type="tel"
              value={values.phone}
              onChange={(event) => set("phone", event.target.value)}
              className={fieldClasses}
            />
          </Field>

          <Field label="Facebook URL" htmlFor="facebook_url" errors={errors.facebook_url}>
            <input
              id="facebook_url"
              type="url"
              value={values.facebook_url}
              onChange={(event) => set("facebook_url", event.target.value)}
              placeholder="https://facebook.com/…"
              className={fieldClasses}
            />
          </Field>

          <Field label="Instagram URL" htmlFor="instagram_url" errors={errors.instagram_url}>
            <input
              id="instagram_url"
              type="url"
              value={values.instagram_url}
              onChange={(event) => set("instagram_url", event.target.value)}
              placeholder="https://instagram.com/…"
              className={fieldClasses}
            />
          </Field>

          <Field label="LinkedIn URL" htmlFor="linkedin_url" errors={errors.linkedin_url}>
            <input
              id="linkedin_url"
              type="url"
              value={values.linkedin_url}
              onChange={(event) => set("linkedin_url", event.target.value)}
              placeholder="https://linkedin.com/in/…"
              className={fieldClasses}
            />
          </Field>

          <Field
            label="Display order"
            htmlFor="display_order"
            errors={errors.display_order}
            hint="Lower numbers appear first."
          >
            <input
              id="display_order"
              type="number"
              min={0}
              value={values.display_order}
              onChange={(event) => set("display_order", Number(event.target.value))}
              className={fieldClasses}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={values.is_active}
            onChange={(event) => set("is_active", event.target.checked)}
            className="h-4 w-4 rounded border-admin-border bg-admin-bg"
          />
          Visible on the public website
        </label>

        <div className="flex justify-end gap-3 border-t border-admin-border pt-5">
          <AdminButton type="button" tone="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </AdminButton>
          <AdminButton type="submit" disabled={busy}>
            {busy ? "Saving…" : member ? "Save changes" : "Add member"}
          </AdminButton>
        </div>
      </form>
    </Modal>
  );
}
