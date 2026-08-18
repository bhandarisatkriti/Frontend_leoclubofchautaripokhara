import Link from "next/link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";
import { HeroBackground } from "@/app/components/home/hero-background";

const FALLBACK_HEADING = "Leadership, Experience, Opportunity";

const FALLBACK_DESCRIPTION =
  `Unlock your potential with the ${site.name}. Develop leadership skills, ` +
  `gain hands-on experience, and seize global opportunities — all while ` +
  `making a real difference. Join us and start your journey today!`;

/**
 * Split the headline so the final word can carry the accent colour.
 *
 * Purely presentational — the words themselves are whatever the club profile
 * holds. A one-word headline keeps its single word in the accent, and blank
 * input never reaches here (the caller falls back first).
 */
function splitHeading(heading: string) {
  const words = heading.trim().split(/\s+/);
  const accent = words.pop() ?? heading;
  return { lead: words.join(" "), accent };
}

/**
 * Homepage hero. Copy comes from the club profile (Admin -> Website content)
 * and falls back to the club's reference wording when a field is blank, so the
 * hero always reads properly even before the profile is filled in.
 *
 * The section is pulled up under the site header (`-mt-16`), which renders
 * transparent over the photo on this route — see SiteHeader's `overlay` state.
 */
export function Hero({
  heading,
  description,
}: {
  heading?: string | null;
  description?: string | null;
} = {}) {
  const { lead, accent } = splitHeading(heading || FALLBACK_HEADING);

  return (
    <section className="relative isolate -mt-16 flex min-h-[36rem] items-center overflow-hidden pb-28 pt-32 sm:min-h-[42rem] sm:pb-32 sm:pt-36 lg:min-h-[calc(100svh-2.25rem)] lg:max-h-[52rem] lg:pb-28">
      <HeroBackground />

      <Container className="relative w-full">
        <div className="relative max-w-2xl">
          {/* Editorial margin rule, the anchor the copy hangs off. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-8 top-1 hidden w-px bg-linear-to-b from-leo-cyan/70 via-leo-blue/40 to-transparent lg:block lg:h-56"
          />

          <Reveal delay={stagger(0, 100)} distance={16}>
            <p className="flex items-center gap-3 text-label font-bold uppercase tracking-[0.22em] text-leo-cyan">
              <span
                aria-hidden
                className="h-px w-10 bg-linear-to-r from-leo-cyan to-leo-cyan/10"
              />
              {site.district}
            </p>
          </Reveal>

          <Reveal delay={stagger(1, 100)} distance={24}>
            <h1 className="mt-6 max-w-[13ch] font-display text-[clamp(2.75rem,6vw,4.75rem)] font-bold leading-[1.03] tracking-[-0.02em] text-white [text-shadow:0_2px_28px_rgba(6,20,47,0.55)]">
              {lead && <span>{lead} </span>}
              <span className="bg-linear-to-br from-leo-blue-light via-[#7dd3fc] to-leo-cyan bg-clip-text text-transparent">
                {accent}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={stagger(2, 100)}>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-on-navy-muted sm:text-[1.0625rem] sm:leading-[1.8]">
              {description || FALLBACK_DESCRIPTION}
            </p>
          </Reveal>

          <Reveal delay={stagger(3, 100)}>
            <div className="mt-10">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 rounded-full bg-linear-to-r from-leo-blue-dark via-leo-blue to-leo-blue-light py-2 pl-7 pr-2 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-glow-blue transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-navy"
              >
                Learn More
                <span
                  aria-hidden
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/18 transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:translate-x-1"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h13M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
