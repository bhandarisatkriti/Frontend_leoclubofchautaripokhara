"use client";

import { SingletonForm } from "@/app/components/admin/singleton-form";

/**
 * Contact details are stored on the singleton `ClubInformation` record, which
 * already powers the public header, footer and contact page — so editing here
 * updates all of them.
 */
export function ContactClient() {
  return (
    <SingletonForm
      path="club"
      emptyMessage="No club profile exists yet. Fill this in and save to create it — the public website will then use these details instead of the built-in fallbacks."
      sections={[
        {
          title: "Organisation",
          description: "Shown in the site header, footer and page metadata.",
          fields: [
            { name: "name", label: "Club name", required: true },
            { name: "established_year", label: "Established year", type: "number" },
            { name: "logo", label: "Club logo", type: "image", hint: "Replaces the emblem in the header and footer." },
            { name: "is_active", label: "This is the live profile", type: "checkbox" },
          ],
        },
        {
          title: "Contact details",
          description: "Used by the top bar, footer and contact page.",
          fields: [
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone", type: "tel" },
            { name: "address", label: "Address", full: true },
            { name: "website", label: "Website", type: "url", placeholder: "https://…" },
          ],
        },
        {
          title: "Social profiles",
          description: "Blank fields are hidden from the website rather than linking nowhere.",
          fields: [
            { name: "facebook_url", label: "Facebook URL", type: "url" },
            { name: "instagram_url", label: "Instagram URL", type: "url" },
            { name: "linkedin_url", label: "LinkedIn URL", type: "url" },
            { name: "youtube_url", label: "YouTube URL", type: "url" },
          ],
        },
      ]}
    />
  );
}
