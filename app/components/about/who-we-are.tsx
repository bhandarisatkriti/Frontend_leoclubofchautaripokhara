import Image from "next/image";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";

const facts = [
  {
    label: `Since ${site.established}`,
    icon: <path d="M7 2v3M17 2v3M3.5 9h17M4 5h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />,
  },
  {
    label: site.district,
    icon: <path d="M20.6 12.6 13 20a1.4 1.4 0 0 1-2 0l-7.6-7.6a1.4 1.4 0 0 1-.4-1V5a1.4 1.4 0 0 1 1.4-1.4H12a1.4 1.4 0 0 1 1 .4l7.6 7.6a1.4 1.4 0 0 1 0 2ZM7.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />,
  },
  {
    label: "Pokhara, Nepal",
    icon: <path d="M12 22s7-6.6 7-12.5A7 7 0 0 0 5 9.5C5 15.4 12 22 12 22Zm0-9.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />,
  },
];

export function WhoWeAre() {
  return (
    <section id="who-we-are" className="bg-surface-blue py-16 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal direction="right" className="relative mx-auto h-[360px] w-full max-w-md sm:h-[420px]">
            <div className="absolute left-0 top-4 h-[78%] w-[70%] overflow-hidden rounded-2xl shadow-soft-lg">
              <Image
                src="/images/about/members-uniform.jpg"
                alt="Leo Club of Chautari Pokhara members"
                fill
                sizes="(max-width: 1024px) 60vw, 32vw"
                className="object-cover"
              />
            </div>
            <div className="absolute right-0 top-0 h-[48%] w-[42%] overflow-hidden rounded-2xl border-4 border-surface-blue shadow-soft-lg">
              <Image
                src="/images/about/youth-camp.jpg"
                alt="Leos at a youth camp"
                fill
                sizes="(max-width: 1024px) 28vw, 16vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-0 flex items-center gap-3 rounded-xl bg-surface-navy px-5 py-4 text-white shadow-soft-lg">
              <span className="text-2xl font-bold">
                {new Date().getFullYear() - site.established}+
              </span>
              <span className="max-w-[7rem] text-[11px] leading-tight text-on-navy-muted">
                Years of Service
              </span>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <SectionLabel>Who We Are</SectionLabel>
              <h2 className="mt-3 text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.08] tracking-tight text-foreground text-balance">
                Young People. Real Service.{" "}
                <span className="text-leo-blue">Lasting Impact.</span>
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
                {site.name} is a youth-led service club operating under{" "}
                <strong className="font-semibold text-foreground">{site.district}</strong>.
                Chartered in{" "}
                <strong className="font-semibold text-foreground">{site.established}</strong>{" "}
                and sponsored by the{" "}
                <strong className="font-semibold text-foreground">{site.sponsoringClub}</strong>,
                we bring together young people aged 12–30 who want to give their time to
                the place they come from.
              </p>
            </Reveal>

            <Reveal delay={stagger(1)} className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leo-blue/10 text-leo-blue">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {fact.icon}
                    </svg>
                  </span>
                  <span className="text-sm font-semibold text-foreground">{fact.label}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
