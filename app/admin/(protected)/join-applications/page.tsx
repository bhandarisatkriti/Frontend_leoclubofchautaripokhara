import type { Metadata } from "next";
import { ApplicationsClient } from "@/app/admin/(protected)/join-applications/applications-client";

export const metadata: Metadata = { title: "Join applications" };

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">Join applications</h2>
        <p className="mt-1 text-sm text-admin-muted">Applications submitted through the public Join Now form. Personal data — handle with care.</p>
      </div>
      <ApplicationsClient />
    </div>
  );
}
