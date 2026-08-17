import type { Metadata } from "next";
import { ApiForm, type Field } from "@/app/components/api-form";
import { PageHeader } from "@/app/components/page-header";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { endpoints } from "@/app/lib/api";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Join",
  description: `Join ${site.name} — membership is open to young people aged 12–30 in and around Pokhara.`,
};

const fields: readonly Field[] = [
  { name: "full_name", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "date_of_birth", label: "Date of birth", type: "date", required: true },
  { name: "address", label: "Address", required: true },
  { name: "occupation", label: "Occupation / Institution" },
  {
    name: "motivation",
    label: "Why do you want to join?",
    type: "textarea",
    required: true,
  },
];

const benefits = [
  "Lead and run real service projects in your own community.",
  "Training, district events, and leadership roles within LDC 325 J.",
  "A network of Leos and Lions across Nepal and worldwide.",
];

const steps = [
  { title: "Submit your application", body: "Fill in the form below with your details and motivation." },
  { title: "We'll get in touch", body: "Our membership team reviews applications and follows up." },
  { title: "Join a project", body: "Start serving alongside the club on your first project." },
];

export default function JoinPage() {
  return (
    <>
      <PageHeader
        kicker="Become a Leo"
        title="Join the club"
        description="Membership is open to young people aged 12–30 living in or around Pokhara. Fill in the form and our membership team will get back to you."
      />

      <Container className="py-16 sm:py-20">
        <Reveal className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative rounded-xl border border-border bg-surface p-5">
              <span className="section-label text-leo-blue">Step {i + 1}</span>
              <h2 className="mt-2 font-semibold">{step.title}</h2>
              <p className="mt-1 text-sm text-muted">{step.body}</p>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute right-[-14px] top-1/2 hidden -translate-y-1/2 text-lg text-border sm:block"
                >
                  →
                </span>
              )}
            </div>
          ))}
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal delay={stagger(0)}>
              <h2 className="text-h3 font-bold tracking-tight">Membership application</h2>
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
            </Reveal>
          </div>

          <aside className="space-y-6">
            <Reveal direction="left" delay={stagger(1)}>
              <div className="rounded-xl border border-border bg-surface p-6 shadow-soft-sm">
                <h2 className="section-label text-muted">Why join</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2">
                      <span aria-hidden className="text-leo-blue">
                        ▸
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal direction="left" delay={stagger(2)}>
              <div className="rounded-xl border border-border p-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-leo-violet">
                  {site.motto}
                </p>
                <p className="mt-2 text-sm text-muted">
                  Serving Pokhara since {site.established} under {site.district}.
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </Container>
    </>
  );
}
