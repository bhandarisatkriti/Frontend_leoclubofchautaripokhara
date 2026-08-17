import type { Metadata } from "next";
import { GalleryClient } from "@/app/admin/(protected)/gallery/gallery-client";

export const metadata: Metadata = { title: "Gallery" };

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">Gallery</h2>
        <p className="mt-1 text-sm text-admin-muted">Uploaded photos appear on the public Gallery page; featured ones also show in the homepage strip.</p>
      </div>
      <GalleryClient />
    </div>
  );
}
