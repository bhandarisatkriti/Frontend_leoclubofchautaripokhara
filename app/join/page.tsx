import type { Metadata } from "next";
import { MembershipForm } from "@/app/components/membership-form";
import { PageHeader } from "@/app/components/page-header";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Join",
  description: `Join ${site.name} — membership is open to young people aged 12–30 in and around Pokhara.`,
};

const benefits = [
  "Lead and run real service projects in your own community.",
  "Training, district events, and leadership roles within LDC 325 J.",
  "A network of Leos and Lions across Nepal and worldwide.",
];

export default function JoinPage() {
  return (
    <>
      <PageHeader
        kicker="Become a Leo"
        title="Join Leo Club of Chautari Pokhara"
        description="Take the first step toward leadership, service, and meaningful community impact. Complete the membership application below."
      />

      {/* Soft ground behind the form cards, the way a Google Form sits on a
          tinted page rather than plain white. */}
      <section className="bg-surface-blue py-12 sm:py-16">
        <Container>
          <Reveal delay={stagger(0)}>
            <MembershipForm />
          </Reveal>
        </Container>
      </section>

      <Container className="py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal delay={stagger(0)}>
            <div className="h-full rounded-xl border border-border bg-surface p-6 shadow-soft-sm">
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

          <Reveal delay={stagger(1)}>
            <div className="flex h-full flex-col justify-center rounded-xl border border-border p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-leo-blue">
                {site.motto}
              </p>
              <p className="mt-2 text-sm text-muted">
                Serving Pokhara since {site.established} under {site.district}.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </>
  );
}
