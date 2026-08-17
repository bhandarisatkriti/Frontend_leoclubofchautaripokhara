import type { Metadata } from "next";
import { ApiForm, type Field } from "@/app/components/api-form";
import { PageHeader } from "@/app/components/page-header";
import { endpoints, getClubInformation } from "@/app/lib/api";
import { clubProfile, site } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} in Pokhara, Nepal.`,
};

/**
 * Field names match `ContactMessageCreateSerializer` on the backend.
 * Hints mirror its validation rules.
 */
const fields: readonly Field[] = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "subject", label: "Subject", required: true, full: true },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    required: true,
    hint: "Please write at least 10 characters.",
  },
];

export default async function ContactPage() {
  const club = clubProfile(await getClubInformation());

  return (
    <>
      <PageHeader
        title="Contact us"
        description="Questions, project ideas, or partnership proposals — we would love to hear from you."
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ApiForm
            endpoint={endpoints.contact}
            fields={fields}
            submitLabel="Send message"
            successMessage="Thank you — your message has been sent. We will reply soon."
          />
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
              Reach us directly
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="block text-muted">Address</span>
                <span className="font-medium">{club.address}</span>
              </li>
              <li>
                <span className="block text-muted">Email</span>
                <a
                  href={`mailto:${club.email}`}
                  className="font-medium hover:text-leo-red"
                >
                  {club.email}
                </a>
              </li>
              <li>
                <span className="block text-muted">Phone</span>
                <a
                  href={`tel:${club.phone.replace(/[^+\d]/g, "")}`}
                  className="font-medium hover:text-leo-red"
                >
                  {club.phone}
                </a>
              </li>
              <li>
                <span className="block text-muted">District</span>
                <span className="font-medium">{club.district}</span>
              </li>
            </ul>

            {club.socials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                {club.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-muted hover:text-leo-red"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
