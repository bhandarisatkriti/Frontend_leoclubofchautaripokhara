import type { Metadata } from "next";
import { ApiForm, type Field } from "@/app/components/api-form";
import { PageHeader } from "@/app/components/page-header";
import { endpoints } from "@/app/lib/api";
import { site } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Membership",
  description: `Join ${site.name} — membership is open to young people aged 12–30 in and around Pokhara.`,
};

/**
 * Field names match `MembershipApplicationCreateSerializer` on the backend.
 * Hints mirror its validation rules so applicants see them before submitting.
 */
const fields: readonly Field[] = [
  { name: "full_name", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  {
    name: "date_of_birth",
    label: "Date of birth",
    type: "date",
    required: true,
    hint: "You must be at least 12 years old to apply.",
  },
  { name: "address", label: "Address", required: true, full: true },
  { name: "education", label: "Education" },
  { name: "occupation", label: "Occupation / Institution" },
  {
    name: "skills",
    label: "Skills",
    type: "textarea",
    placeholder: "e.g. event coordination, design, public speaking",
  },
  {
    name: "previous_experience",
    label: "Previous volunteering experience",
    type: "textarea",
  },
  {
    name: "social_media",
    label: "Social media profile",
    full: true,
    placeholder: "Facebook or Instagram link (optional)",
  },
  {
    name: "reason_for_joining",
    label: "Why do you want to join?",
    type: "textarea",
    required: true,
    hint: "Please write at least 20 characters.",
  },
];

const benefits = [
  "Lead and run real service projects in your own community.",
  "Training, district events, and leadership roles within LDC 325 J.",
  "A network of Leos and Lions across Nepal and worldwide.",
];

export default function MembershipPage() {
  return (
    <>
      <PageHeader
        title="Become a Leo"
        description="Membership is open to young people aged 12–30 living in or around Pokhara. Fill in the form and our membership team will get back to you."
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold tracking-tight">Membership application</h2>
          <p className="mt-2 text-sm text-muted">
            Fields marked <span className="text-leo-red">*</span> are required.
          </p>
          <div className="mt-6">
            <ApiForm
              endpoint={endpoints.memberships}
              fields={fields}
              submitLabel="Submit application"
              successMessage="Application received — we will contact you about the next steps."
            />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
              Why join
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-2">
                  <span aria-hidden className="text-leo-red">
                    ▸
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-leo-violet">
              {site.motto}
            </p>
            <p className="mt-2 text-sm text-muted">
              Serving Pokhara since {site.established} under {site.district}.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
