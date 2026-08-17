import type { Metadata } from "next";
import { PageHeader } from "@/app/components/page-header";
import { ButtonLink } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Clubs",
  description: "What a Leo club is, and where this club sits in the Lions/Leo district structure.",
};

const structure = [
  { label: "International Association of Lions Clubs", detail: "The parent global service organisation." },
  { label: site.district, detail: "Our Leo district, coordinating clubs across the region." },
  { label: site.shortName, detail: "This club — chartered in " + site.established + "." },
];

export default function ClubsPage() {
  return (
    <>
      <PageHeader
        kicker="Our structure"
        title="Part of a global service movement"
        description="What a Leo club is, and where we fit within the wider Lions and Leo network."
      />

      <Container size="narrow" className="py-16 sm:py-20">
        <Reveal>
          <SectionLabel>What is a Leo club?</SectionLabel>
          <p className="mt-3 text-lead text-foreground">
            Leo clubs are the youth service arm of Lions Clubs International — one
            of the world&apos;s largest volunteer service organisations. Leo stands
            for <strong>Leadership</strong>, <strong>Experience</strong>, and{" "}
            <strong>Opportunity</strong>, the three things members build through
            hands-on community service.
          </p>
          <p className="mt-4 text-muted">
            Membership is open to young people aged 12–30, and every Leo club
            operates under the guidance of a sponsoring Lions club — giving
            members a direct link to a global network of volunteers.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <SectionLabel>Where we fit</SectionLabel>
          <h2 className="mt-3 text-h3 font-bold tracking-tight">Our place in the structure</h2>
        </Reveal>

        <div className="relative mt-10 space-y-0">
          {structure.map((node, i) => (
            <Reveal key={node.label} delay={stagger(i, 120)}>
              <div className="relative flex gap-5 pb-10 last:pb-0">
                {i < structure.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[15px] top-8 h-full w-px bg-border"
                  />
                )}
                <span
                  className={`relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                    i === structure.length - 1 ? "bg-leo-blue" : "bg-leo-blue-dark"
                  }`}
                >
                  {i + 1}
                </span>
                <div
                  className={`flex-1 rounded-xl border p-5 shadow-soft-sm ${
                    i === structure.length - 1
                      ? "border-leo-blue/30 bg-leo-blue/5"
                      : "border-border bg-surface"
                  }`}
                >
                  <p className="font-semibold">{node.label}</p>
                  <p className="mt-1 text-sm text-muted">{node.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {site.sponsoringClub && (
          <Reveal className="mt-4 rounded-xl border border-border bg-surface p-5 text-sm text-muted">
            Sponsored by {site.sponsoringClub}.
          </Reveal>
        )}

        <Reveal className="mt-14 rounded-xl border border-border bg-surface p-8 text-center shadow-soft-sm">
          <h2 className="text-h3 font-bold tracking-tight">Want to be part of it?</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Membership is open to young people aged 12–30 in and around Pokhara.
          </p>
          <div className="mt-6">
            <ButtonLink href="/join" variant="primary" withArrow>
              Become a Leo
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
