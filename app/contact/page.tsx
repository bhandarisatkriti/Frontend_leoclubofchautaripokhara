import type { Metadata } from "next";
import { ApiForm, type Field } from "@/app/components/api-form";
import { PageHeader } from "@/app/components/page-header";
import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { endpoints } from "@/app/lib/api";
import { stagger } from "@/app/lib/motion";
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

const contactMethods = [
  {
    label: "Address",
    value: site.address,
    icon: (
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Zm0-8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
    ),
  },
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    icon: <path d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1.4 2 6.6 5.5L18.6 6H5.4ZM19 8.2l-6.4 5.3a1 1 0 0 1-1.2 0L5 8.2V18h14V8.2Z" />,
  },
  {
    label: "Phone",
    value: site.phone,
    href: `tel:${site.phone.replace(/[^+\d]/g, "")}`,
    icon: (
      <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.5 3 3 3.4 2.5 4 2.5h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" />
    ),
  },
  {
    label: "District",
    value: site.district,
    icon: <path d="M6 3h1.5v18H6V3Zm1.5 1.5h11l-3 4 3 4h-11v-8Z" />,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="Contact"
        title="We would love to hear from you"
        description="Questions, project ideas, or partnership proposals — reach out any time."
      />

      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <ApiForm
              endpoint={endpoints.contact}
              fields={fields}
              submitLabel="Send message"
              successMessage="Thank you — your message has been sent. We will reply soon."
            />
          </Reveal>

          <aside className="space-y-6">
            <Reveal direction="left">
              <div className="rounded-xl border border-border bg-surface p-6 shadow-soft-sm">
                <h2 className="section-label text-muted">Reach us directly</h2>
                <ul className="mt-5 space-y-4 text-sm">
                  {contactMethods.map((method, i) => (
                    <Reveal key={method.label} delay={stagger(i)} as="li" className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-leo-blue/10 text-leo-blue">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          {method.icon}
                        </svg>
                      </span>
                      <span>
                        <span className="block text-muted">{method.label}</span>
                        {method.href ? (
                          <a
                            href={method.href}
                            className="font-medium transition-colors duration-[var(--duration-fast)] hover:text-leo-blue"
                          >
                            {method.value}
                          </a>
                        ) : (
                          <span className="font-medium">{method.value}</span>
                        )}
                      </span>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal direction="left" delay={stagger(1)}>
              <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-border">
                <Motif variant="rings" tone="blue" />
              </div>
            </Reveal>
          </aside>
        </div>
      </Container>
    </>
  );
}
