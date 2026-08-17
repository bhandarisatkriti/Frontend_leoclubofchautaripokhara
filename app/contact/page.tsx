import type { Metadata } from "next";
import { ApiForm, type Field } from "@/app/components/api-form";
import { PageHeader } from "@/app/components/page-header";
import { endpoints } from "@/app/lib/api";
import { site } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} in Pokhara, Nepal.`,
};

const fields: readonly Field[] = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "subject", label: "Subject", required: true },
  { name: "message", label: "Message", type: "textarea", required: true },
];

export default function ContactPage() {
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
                <span className="font-medium">{site.address}</span>
              </li>
              <li>
                <span className="block text-muted">Email</span>
                <a href={`mailto:${site.email}`} className="font-medium hover:text-leo-red">
                  {site.email}
                </a>
              </li>
              <li>
                <span className="block text-muted">Phone</span>
                <a
                  href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                  className="font-medium hover:text-leo-red"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <span className="block text-muted">District</span>
                <span className="font-medium">{site.district}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
