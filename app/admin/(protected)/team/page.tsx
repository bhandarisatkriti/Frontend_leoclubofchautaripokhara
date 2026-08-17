import type { Metadata } from "next";
import { TeamManager } from "@/app/admin/(protected)/team/team-manager";

export const metadata: Metadata = { title: "Team management" };

export default function AdminTeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">Team members</h2>
        <p className="mt-1 text-sm text-admin-muted">
          Changes here appear on the public Team page and the homepage team
          preview within a minute.
        </p>
      </div>
      <TeamManager />
    </div>
  );
}
