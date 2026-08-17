import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileClient } from "@/app/admin/(protected)/profile/profile-client";
import { getAdminUser } from "@/app/lib/admin/session";

export const metadata: Metadata = { title: "Admin profile" };

export default async function AdminProfilePage() {
  const user = await getAdminUser();
  // The layout already guarantees this; the check keeps the type non-null.
  if (!user) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">Admin profile</h2>
        <p className="mt-1 text-sm text-admin-muted">
          Your own account details and password.
        </p>
      </div>
      <ProfileClient user={user} />
    </div>
  );
}
