import Image from "next/image";
import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
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

function PhotoCard({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className: string;
  sizes: string;
}) {
  return (
    <div className={`absolute rounded-2xl bg-white p-1.5 shadow-soft-lg ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}

export function WhoWeAre() {
  return (
    <section id="who-we-are" className="relative overflow-hidden bg-surface-blue py-16 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute -left-6 -top-6 h-32 w-32 opacity-60 sm:h-40 sm:w-40">
        <Motif variant="dots" tone="blue" />
      </div>
      <div aria-hidden className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 opacity-50 sm:h-52 sm:w-52">
        <Motif variant="dots" tone="blue" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-[6%] top-10 h-72 w-72 rounded-full bg-leo-blue/15 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[22%] top-24 hidden h-64 w-64 rounded-full border border-leo-blue/25 sm:block"
      />

      <Container className="relative">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal
            direction="right"
            className="relative mx-auto h-[400px] w-full max-w-md sm:h-[460px]"
          >
            <PhotoCard
              src="/images/about/members-uniform.jpg"
              alt="Leo Club of Chautari Pokhara members"
              className="left-0 top-8 h-[72%] w-[64%]"
              sizes="(max-width: 1024px) 55vw, 30vw"
            />
            <PhotoCard
              src="/images/about/youth-camp.jpg"
              alt="Leos at a youth camp"
              className="right-0 top-0 h-[40%] w-[42%]"
              sizes="(max-width: 1024px) 26vw, 16vw"
            />
            <PhotoCard
              src="/images/about/community-service.jpg"
              alt="Leos carrying out a community service activity"
              className="bottom-2 right-4 h-[36%] w-[40%]"
              sizes="(max-width: 1024px) 26vw, 16vw"
            />

            <div className="absolute -bottom-5 left-1 flex items-center gap-3 rounded-xl bg-surface-navy px-5 py-4 text-white shadow-soft-lg">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-leo-blue-light">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="5" />
                  <path d="m8.5 13-1.5 8 5-3 5 3-1.5-8" />
                </svg>
              </span>
              <span>
                <span className="block text-2xl font-bold leading-none">
                  {new Date().getFullYear() - site.established}+
                </span>
                <span className="mt-1.5 block max-w-[7rem] text-[11px] leading-tight text-on-navy-muted">
                  Years of Service
                </span>
                <span aria-hidden className="mt-1.5 block h-0.5 w-6 rounded-full bg-leo-blue" />
              </span>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <SectionLabel>Who We Are</SectionLabel>
              <h2 className="mt-3 text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.08] tracking-tight text-foreground text-balance">
                Young People. Real Service.{" "}
                <span className="relative inline-block text-leo-blue">
                  Lasting Impact.
                  <svg
                    aria-hidden
                    viewBox="0 0 220 14"
                    preserveAspectRatio="none"
                    className="absolute -bottom-2 left-0 h-2.5 w-full text-leo-blue/60"
                  >
                    <path
                      d="M2 8c20-8 40-8 60 0s40 8 60 0 40-8 60 0 30 6 36 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
                A youth-led service club under{" "}
                <strong className="font-semibold text-foreground">{site.district}</strong>.
                Chartered in{" "}
                <strong className="font-semibold text-foreground">{site.established}</strong>.
                Built by young people aged 12–30 who give their time to the
                place they come from.
              </p>
            </Reveal>

            <Reveal delay={stagger(1)} className="mt-8 flex flex-wrap gap-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-center gap-2.5 rounded-xl border border-white/60 bg-white/70 px-4 py-3 shadow-soft-sm backdrop-blur-sm"
                >
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
