import { ButtonLink } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";
import { HeroBackground } from "@/app/components/home/hero-background";

export function Hero() {
  return (
    <section className="relative min-h-[520px] overflow-hidden pb-14 pt-10 sm:min-h-[600px] sm:pb-16 sm:pt-12 lg:min-h-[680px] lg:pb-20">
      <HeroBackground />

      <Container className="relative flex min-h-[440px] flex-col justify-center sm:min-h-[520px] lg:min-h-[600px]">
        <div className="max-w-[460px]">
          <Reveal delay={stagger(0, 100)}>
            <span className="inline-flex rounded-full bg-linear-to-r from-leo-blue-dark to-leo-blue px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-soft-sm">
              {site.motto}
            </span>
          </Reveal>

          <Reveal delay={stagger(1, 100)} distance={24}>
            <h1 className="mt-4 text-[clamp(2.5rem,5.5vw,3.75rem)] font-bold leading-[0.98] tracking-tight text-balance text-white">
              Leadership,
              <br />
              Experience,
              <br />
              <span className="bg-linear-to-r from-leo-cyan to-leo-blue-light bg-clip-text text-transparent">
                Opportunity.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={stagger(2, 100)}>
            <p className="mt-4 max-w-[440px] text-sm leading-relaxed text-on-navy-muted sm:text-[15px]">
              We are young people from Pokhara who give our time to the
              community — through service projects in health, education, and
              the environment.
            </p>
          </Reveal>

          <Reveal delay={stagger(3, 100)}>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ButtonLink href="/about" variant="primary" size="sm" withArrow>
                Explore More
              </ButtonLink>
              <ButtonLink
                href="/events"
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:border-white/70 hover:bg-white/10 hover:text-white"
              >
                See Our Events
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={stagger(4, 100)}>
            <div aria-hidden className="mt-6 flex items-center gap-2 text-white/40">
              <span className="h-px w-6 bg-current" />
              <span className="h-1.5 w-1.5 rounded-full bg-leo-cyan" />
              <span className="h-px w-6 bg-current" />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
