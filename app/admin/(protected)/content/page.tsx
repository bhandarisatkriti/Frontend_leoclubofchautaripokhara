import type { Metadata } from "next";
import { ContentClient } from "@/app/admin/(protected)/content/content-client";

export const metadata: Metadata = { title: "Website content" };

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">Website content</h2>
        <p className="mt-1 text-sm text-admin-muted">Headline copy for the homepage. Leaving a field blank makes the site fall back to its built-in text.</p>
      </div>
      <ContentClient />
    </div>
  );
}
