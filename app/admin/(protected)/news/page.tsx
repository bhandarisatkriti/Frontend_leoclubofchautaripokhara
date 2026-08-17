import type { Metadata } from "next";
import { NewsClient } from "@/app/admin/(protected)/news/news-client";

export const metadata: Metadata = { title: "News &amp; articles" };

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">News &amp; articles</h2>
        <p className="mt-1 text-sm text-admin-muted">Published articles appear on the public News page and the homepage news strip.</p>
      </div>
      <NewsClient />
    </div>
  );
}
