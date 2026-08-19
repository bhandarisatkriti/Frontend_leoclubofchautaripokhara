import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { StatCounter } from "@/app/components/ui/stat-counter";
import { stagger } from "@/app/lib/motion";
import { impactFigures, site } from "@/app/lib/site";

/**
 * Icons for the club's declared figures, in the order `impactFigures` lists
 * them: people trained, projects run, places reached, organisations worked
 * alongside.
 */
const icons = [
  // Leaders — a group
  <path
    key="leaders"
    d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 0a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 8 11Zm0 2c-2.7 0-8 1.35-8 4v3h9.5v-3c0-1-.3-1.85-1.5-2.6A11 11 0 0 0 8 13Zm8 0c-.4 0-.85 0-1.35.06A5.6 5.6 0 0 1 16.5 17v3H24v-3c0-2.65-5.3-4-8-4Z"
  />,
  // Works — a heart
  <path
    key="works"
    d="M12 21s-7-4.35-9.5-8.5C.7 8.9 2.4 5 6 5c2 0 3.3 1 4 2 .7-1 2-2 4-2 3.6 0 5.3 3.9 3.5 7.5C19 16.65 12 21 12 21Z"
  />,
  // Regions — a map pin
  <path
    key="regions"
    d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Zm0-8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
  />,
  // Partners — a star
  <path
    key="partners"
    d="M12 2 14.7 8 21 8.7 16.3 13l1.3 6.3L12 16.4 6.4 19.3 7.7 13 3 8.7 9.3 8Z"
  />,
];

/**
 * The club's reach, as a navy band between two lighter sections.
 *
 * These figures are declared in `site.ts` rather than counted from the
 * database — see the note there. The numbers count up as the band scrolls
 * into view, the same `StatCounter` the About section already uses, so the
 * two sets of figures behave identically even though they come from
 * different places.
 */
export function ImpactBand() {
  // Derived rather than written down, so the heading cannot drift from the
  // charter year the rest of the site quotes.
  const years = new Date().getFullYear() - site.established;

  return (
    <section className="relative overflow-hidden bg-surface-navy py-16 text-white sm:py-20">
      <Motif variant="grid" tone="navy" className="opacity-25" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-leo-blue/20 blur-3xl"
      />

      <Container className="relative">
        {/* Introduced like every other band. Without a line of its own the
            figures arrived out of nowhere between two titled sections. */}
        <Reveal className="mb-12 max-w-xl">
          <p className="section-label text-leo-cyan">Where it adds up</p>
          <h2 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-[1.15] tracking-tight text-balance">
            {years} years of service, in figures
          </h2>
        </Reveal>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {impactFigures.map((figure, i) => (
            <Reveal
              key={figure.label}
              as="li"
              delay={stagger(i, 110)}
              className="list-none"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-leo-blue text-white shadow-glow-blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    {icons[i]}
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-none tracking-tight">
                    <StatCounter end={figure.value} suffix={figure.suffix} />
                  </p>
                  <p className="mt-1.5 text-sm text-on-navy-muted">
                    {figure.label}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
