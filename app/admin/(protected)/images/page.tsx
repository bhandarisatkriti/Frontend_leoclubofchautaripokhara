import type { Metadata } from "next";
import { ImagesClient } from "@/app/admin/(protected)/images/images-client";

export const metadata: Metadata = { title: "Website images" };

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">Website images</h2>
        <p className="mt-1 text-sm text-admin-muted">Images placed in fixed slots on the site, such as the homepage hero background and the About collage.</p>
      </div>
      <ImagesClient />
    </div>
  );
}
