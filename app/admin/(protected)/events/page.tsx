import type { Metadata } from "next";
import { EventsClient } from "@/app/admin/(protected)/events/events-client";

export const metadata: Metadata = { title: "Events" };

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">Events</h2>
        <p className="mt-1 text-sm text-admin-muted">Published events appear on the public Events page, calendar and homepage. Drafts stay hidden.</p>
      </div>
      <EventsClient />
    </div>
  );
}
