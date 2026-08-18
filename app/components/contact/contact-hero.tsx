import Link from "next/link";
import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-surface-navy py-16 sm:py-20">
      <Motif variant="waves" tone="navy" className="opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-leo-blue/15 blur-3xl"
      />

      <Container className="relative">
        <Reveal delay={stagger(0, 100)}>
          <nav aria-label="Breadcrumb" className="text-xs text-on-navy-muted">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Contact</span>
          </nav>
        </Reveal>

        <Reveal delay={stagger(1, 100)} distance={20}>
          <SectionLabel tone="cyan" className="mt-5">
            Get In Touch
          </SectionLabel>
          <h1 className="mt-3 max-w-xl text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-tight text-balance text-white">
            We&apos;d Love to Hear From You
          </h1>
        </Reveal>

        <Reveal delay={stagger(2, 100)}>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-on-navy-muted sm:text-base">
            Have a question, an idea for a project, or want to get involved?
            Send us a message and our team will get back to you.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
