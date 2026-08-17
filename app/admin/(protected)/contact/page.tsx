import type { Metadata } from "next";
import { ContactClient } from "@/app/admin/(protected)/contact/contact-client";

export const metadata: Metadata = { title: "Contact information" };

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">Contact information</h2>
        <p className="mt-1 text-sm text-admin-muted">These details feed the top bar, footer and contact page. Nothing here is hardcoded in the frontend.</p>
      </div>
      <ContactClient />
    </div>
  );
}
