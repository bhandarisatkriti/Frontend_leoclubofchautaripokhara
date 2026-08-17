"use client";

import { SingletonForm } from "@/app/components/admin/singleton-form";

/**
 * Website copy, stored on the same `ClubInformation` record as the contact
 * details. Only fields the public site actually renders are exposed — there is
 * no value in inventing form fields nothing reads.
 */
export function ContentClient() {
  return (
    <SingletonForm
      path="club"
      emptyMessage="No club profile exists yet. Saving this form creates it; until then the website falls back to its built-in copy."
      sections={[
        {
          title: "Hero section",
          description: "The headline block at the top of the homepage.",
          fields: [
            { name: "name", label: "Club name (hero heading)", required: true },
            {
              name: "tagline",
              label: "Tagline",
              hint: 'Shown as the motto, e.g. "Work Together".',
            },
            {
              name: "short_description",
              label: "Hero description",
              type: "textarea",
              hint: "The paragraph under the hero heading.",
            },
          ],
        },
        {
          title: "About section",
          description: "The “Who We Are” block on the homepage and About page.",
          fields: [
            {
              name: "full_description",
              label: "About text",
              type: "textarea",
              hint: "Separate paragraphs with a blank line.",
            },
          ],
        },
        {
          title: "Mission and vision",
          description: "The two cards in the “About us” section.",
          fields: [
            { name: "mission", label: "Mission statement", type: "textarea" },
            { name: "vision", label: "Vision statement", type: "textarea" },
          ],
        },
      ]}
    />
  );
}
