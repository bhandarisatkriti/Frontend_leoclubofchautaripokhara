import Image from "next/image";
import Link from "next/link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";

export function AboutHero() {
  return (
    <section className="relative flex min-h-[440px] items-end overflow-hidden pb-12 pt-28 sm:min-h-[520px] sm:pb-16">
      <Image
        src="/images/gallery/leo-gathering.jpg"
        alt="Leo Club of Chautari Pokhara members together"
        fill
        priority
        sizes="100vw"
        className="animate-hero-zoom object-cover object-top"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,20,47,0.55)_0%,rgba(6,20,47,0.78)_65%,rgba(6,20,47,0.94)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-leo-blue/20 blur-3xl"
      />

      <Container className="relative">
        <Reveal delay={stagger(0, 100)}>
          <nav aria-label="Breadcrumb" className="text-xs text-on-navy-muted">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">About</span>
          </nav>
        </Reveal>

        <Reveal delay={stagger(1, 100)}>
          <SectionLabel tone="cyan">About Us</SectionLabel>
        </Reveal>

        <Reveal delay={stagger(2, 100)} distance={24}>
          <h1 className="mt-3 max-w-2xl text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-balance text-white">
            Driven by Service.
            <br />
            Built for{" "}
            <span className="bg-linear-to-r from-leo-blue-light to-leo-cyan bg-clip-text text-transparent">
              Leadership.
            </span>
            <br />
            Connected by Community.
          </h1>
        </Reveal>

        <Reveal delay={stagger(3, 100)}>
          <div className="mt-4 h-1 w-14 rounded-full bg-linear-to-r from-leo-blue-dark to-leo-blue" />
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-on-navy-muted sm:text-base">
            Discover the story, purpose, and people behind Leo Club of
            Chautari Pokhara.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
