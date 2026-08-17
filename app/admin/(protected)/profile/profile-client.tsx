"use client";

import { useState } from "react";
import { useToast } from "@/app/components/admin/toast";
import { AdminButton, Field, fieldClasses } from "@/app/components/admin/ui";
import { ApiError, adminApi } from "@/app/lib/admin/client";
import type { AdminUser } from "@/app/lib/admin/types";

export function ProfileClient({ user }: { user: AdminUser }) {
  const toast = useToast();

  const [fullName, setFullName] = useState(user.full_name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string[]>>({});

  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string[]>>({});

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileBusy(true);
    setProfileErrors({});
    try {
      await adminApi.patch("auth/me", { full_name: fullName, phone });
      toast.success("Your profile was updated.");
    } catch (error) {
      if (error instanceof ApiError) {
        setProfileErrors(error.fieldErrors);
        toast.error(error.message);
      } else {
        toast.error("Could not update your profile.");
      }
    } finally {
      setProfileBusy(false);
    }
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setPasswordBusy(true);
    setPasswordErrors({});
    try {
      await adminApi.post("auth/password/change", {
        current_password: data.get("current_password"),
        new_password: data.get("new_password"),
      });
      form.reset();
      toast.success("Your password was changed.");
    } catch (error) {
      if (error instanceof ApiError) {
        setPasswordErrors(error.fieldErrors);
        toast.error(error.message);
      } else {
        toast.error("Could not change your password.");
      }
    } finally {
      setPasswordBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        onSubmit={saveProfile}
        className="space-y-5 rounded-xl border border-admin-border bg-admin-card p-6"
      >
        <div>
          <h3 className="font-semibold">Your details</h3>
          <p className="mt-1 text-sm text-admin-muted">
            The email address and permission level are managed by a superuser and
            cannot be changed here.
          </p>
        </div>

        <Field label="Email" htmlFor="profile_email">
          <input
            id="profile_email"
            value={user.email}
            readOnly
            className={`${fieldClasses} cursor-not-allowed opacity-60`}
          />
        </Field>

        <Field
          label="Full name"
          htmlFor="profile_name"
          errors={profileErrors.full_name}
        >
          <input
            id="profile_name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className={fieldClasses}
          />
        </Field>

        <Field label="Phone" htmlFor="profile_phone" errors={profileErrors.phone}>
          <input
            id="profile_phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={fieldClasses}
          />
        </Field>

        <p className="text-xs text-admin-muted">
          Access level: {user.is_superuser ? "Superuser" : "Staff"}
        </p>

        <AdminButton type="submit" disabled={profileBusy}>
          {profileBusy ? "Saving…" : "Save profile"}
        </AdminButton>
      </form>

      <form
        onSubmit={changePassword}
        className="space-y-5 rounded-xl border border-admin-border bg-admin-card p-6"
      >
        <div>
          <h3 className="font-semibold">Change password</h3>
          <p className="mt-1 text-sm text-admin-muted">
            At least 10 characters, not entirely numeric, and not a commonly used
            password.
          </p>
        </div>

        <Field
          label="Current password"
          htmlFor="current_password"
          required
          errors={passwordErrors.current_password}
        >
          <input
            id="current_password"
            name="current_password"
            type="password"
            autoComplete="current-password"
            required
            className={fieldClasses}
          />
        </Field>

        <Field
          label="New password"
          htmlFor="new_password"
          required
          errors={passwordErrors.new_password}
        >
          <input
            id="new_password"
            name="new_password"
            type="password"
            autoComplete="new-password"
            required
            className={fieldClasses}
          />
        </Field>

        <AdminButton type="submit" disabled={passwordBusy}>
          {passwordBusy ? "Changing…" : "Change password"}
        </AdminButton>
      </form>
    </div>
  );
}
