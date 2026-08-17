import Image from "next/image";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";

const emblem = [
  {
    part: "The tree",
    meaning: "Growth and the environment.",
    icon: (
      <path d="M50 8 L68 40 H58 L74 62 H60 L60 92 H40 L40 62 H26 L42 40 H32 Z" />
    ),
    tone: "text-leo-blue bg-leo-blue/10",
  },
  {
    part: "The two figures",
    meaning: "Nobody serves alone.",
    icon: (
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="8" />
    ),
    tone: "text-leo-indigo bg-leo-indigo/10",
  },
  {
    part: "The lion mark",
    meaning: "Our link to Lions Clubs International.",
    icon: (
      <text x="50" y="62" textAnchor="middle" fontSize="42" fontWeight="700">
        L
      </text>
    ),
    tone: "text-leo-cyan bg-leo-cyan/10",
  },
];

export function WhoWeAre() {
  return (
    <section className="bg-surface-blue py-16 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal direction="right" className="relative mx-auto h-[340px] w-full max-w-md sm:h-[400px]">
            <div className="absolute left-0 top-4 h-[80%] w-[62%] overflow-hidden rounded-2xl shadow-soft-lg">
              <Image
                src="/images/about/members-uniform.jpg"
                alt="Leo Club of Chautari Pokhara members"
                fill
                sizes="(max-width: 1024px) 55vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="absolute right-0 top-0 h-[45%] w-[46%] overflow-hidden rounded-2xl border-4 border-surface-blue shadow-soft-lg">
              <Image
                src="/images/about/youth-camp.jpg"
                alt="Leos at a youth camp"
                fill
                sizes="(max-width: 1024px) 30vw, 16vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-4 h-[42%] w-[50%] overflow-hidden rounded-2xl border-4 border-surface-blue shadow-soft-lg">
              <Image
                src="/images/gallery/club-activities.jpg"
                alt="Leos at a club session"
                fill
                sizes="(max-width: 1024px) 32vw, 18vw"
                className="object-cover"
              />
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
                {site.district}. Chartered in {site.established} and
                sponsored by the {site.sponsoringClub}, we bring together
                young people aged 12–30 who want to give their time to the
                place they come from.
              </p>

              <div className="mt-6 inline-flex items-center gap-4 rounded-xl border border-border bg-background px-5 py-4 shadow-soft-sm">
                <span className="text-3xl font-bold text-leo-blue">
                  {new Date().getFullYear() - site.established}+
                </span>
                <span className="max-w-[10rem] text-xs leading-snug text-muted">
                  years of continuous service to the Pokhara community
                </span>
              </div>
            </Reveal>

            <Reveal delay={stagger(1)} className="mt-8 grid grid-cols-3 gap-3">
              {emblem.map((item) => (
                <div key={item.part} className="rounded-xl border border-border bg-background p-3 text-center shadow-soft-sm">
                  <span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg ${item.tone}`}>
                    <svg width="18" height="18" viewBox="0 0 100 100" fill="currentColor">
                      {item.icon}
                    </svg>
                  </span>
                  <p className="mt-2 text-[11px] font-semibold leading-tight">{item.part}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-muted">{item.meaning}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
