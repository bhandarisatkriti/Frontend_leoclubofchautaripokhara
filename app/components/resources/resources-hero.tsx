import Link from "next/link";
import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";

export function ResourcesHero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#06142F_0%,#0A1F44_100%)] py-20 text-on-navy sm:py-28">
      <Motif variant="dots" tone="navy" className="opacity-25" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-leo-blue/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-leo-violet/10 blur-3xl"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute left-[12%] top-16 hidden animate-float-slow text-leo-blue-light/25 sm:block"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5a2.5 2.5 0 0 0-2.5 2.5V4.5Z" />
        </svg>
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-[15%] top-24 hidden animate-float-slower text-leo-violet-light/20 sm:block"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2 4 5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5l-8-3Z" />
        </svg>
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-10 right-[28%] hidden animate-float-slow text-leo-cyan/20 sm:block"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Zm0-8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
        </svg>
      </span>

      <Container size="narrow" className="relative text-center">
        <Reveal delay={stagger(0, 100)}>
          <nav aria-label="Breadcrumb" className="text-xs text-on-navy-muted">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Resources</span>
          </nav>
        </Reveal>

        <Reveal delay={stagger(1, 100)}>
          <SectionLabel tone="cyan" className="mt-5 justify-center">
            Resources
          </SectionLabel>
        </Reveal>

        <Reveal delay={stagger(2, 100)} distance={24}>
          <h1 className="mt-3 text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-balance text-white">
            Everything You Need,{" "}
            <span className="bg-linear-to-r from-leo-blue-light to-leo-violet-light bg-clip-text text-transparent">
              All in One Place.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={stagger(3, 100)}>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-on-navy-muted sm:text-base">
            Explore useful Leo resources, directories, partner information,
            membership links, and tools for members and the community.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
