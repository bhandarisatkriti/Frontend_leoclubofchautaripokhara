import Image from "next/image";
import { Logo } from "@/app/components/logo";
import { ButtonLink } from "@/app/components/ui/button-link";
import { solidBlueButton } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";

function GradientWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-linear-to-r from-leo-blue-light to-leo-cyan bg-clip-text text-transparent">
      {children}
    </span>
  );
}

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-surface-navy pb-24 pt-24 sm:pb-32 sm:pt-28">
      <div className="absolute inset-y-0 right-0 hidden w-[58%] overflow-hidden sm:block">
        <Image
          src="/images/gallery/leo-gathering.jpg"
          alt="Leo Club of Chautari Pokhara members together"
          fill
          priority
          sizes="58vw"
          className="animate-hero-zoom object-cover object-top"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,#06142F_0%,#06142F_5%,rgba(6,20,47,0.55)_37%,rgba(6,20,47,0.05)_67%)]"
        />
      </div>
      <div className="absolute inset-0 sm:hidden">
        <Image
          src="/images/gallery/leo-gathering.jpg"
          alt="Leo Club of Chautari Pokhara members together"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div aria-hidden className="absolute inset-0 bg-surface-navy/85" />
      </div>

      <Container className="relative">
        <Reveal delay={stagger(0, 100)}>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-4">
            <Logo size={22} />
            <span className="text-[11px] font-bold uppercase tracking-wide text-on-navy-muted">
              {site.name}
            </span>
          </div>
        </Reveal>

        <Reveal delay={stagger(1, 100)} distance={24}>
          <h1 className="mt-5 max-w-xl text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-balance text-white">
            Driven by <GradientWord>Service</GradientWord>.
            <br />
            Built for <GradientWord>Leadership</GradientWord>.
            <br />
            Connected by <GradientWord>Community</GradientWord>.
          </h1>
        </Reveal>

        <Reveal delay={stagger(2, 100)}>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-on-navy-muted sm:text-base">
            Discover the story, purpose, and people behind {site.name}.
          </p>
        </Reveal>

        <Reveal delay={stagger(3, 100)}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#who-we-are" className={solidBlueButton}>
              Discover Our Story
            </a>
            <ButtonLink
              href="/gallery"
              variant="outline"
              withArrow
              className="border-white/25 text-white hover:border-white/60 hover:bg-white/10 hover:text-white"
            >
              Explore Our Gallery
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={stagger(4, 100)}>
          <a
            href="#who-we-are"
            className="mt-14 inline-flex flex-col items-start gap-2 text-[11px] font-bold uppercase tracking-widest text-on-navy-muted transition-colors duration-[var(--duration-fast)] hover:text-white"
          >
            Scroll to Explore
            <svg
              aria-hidden
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </Reveal>
      </Container>

      <svg
        aria-hidden
        className="absolute inset-x-0 -bottom-1 h-14 w-full text-surface-blue sm:h-20"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,100 C480,0 960,0 1440,100 L1440,100 L0,100 Z" />
      </svg>
    </section>
  );
}
