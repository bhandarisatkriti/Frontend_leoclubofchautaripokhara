import Link from "next/link";
import { HeroBackground } from "@/app/components/home/hero-background";
import { site } from "@/app/lib/site";

/**
 * The masthead of the site: an editorial spread, not a centred hero stack.
 *
 * The composition is deliberately asymmetric — an oversized indented word
 * column on the left, the club photograph cut on a slant from the right, and
 * publication-style metadata pinned to the edges. The signature element is
 * that metadata: real coordinates, the charter year and the district, set the
 * way a printed masthead would carry them.
 *
 * The three words are what LEO actually stands for, so the headline states the
 * organisation's own identity rather than marketing copy. `description` stays
 * admin-editable through the club profile.
 */

/** The Leo triad — the club's identity, and the spine of the composition. */
const triad = [
  { word: "Leadership", indent: "lg:ml-0" },
  { word: "Experience", indent: "lg:ml-[7%]" },
  { word: "Opportunity", indent: "lg:ml-[14%]" },
];

/** Pokhara, to the minute. Real coordinates, set like a printed masthead. */
const coordinates = "28°13′N 83°59′E";

/** Site index — the rows light up when the matching nav item is hovered. */
const index = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export function Hero({ description }: { description?: string | null } = {}) {
  return (
    <section className="relative isolate -mt-24 flex min-h-[42rem] flex-col justify-center overflow-hidden bg-surface-navy pb-16 pt-32 sm:min-h-[46rem] sm:pt-36 lg:min-h-[calc(100svh-1rem)] lg:max-h-[54rem] lg:pb-20">
      {/* Photograph, cut on a slant and bled off the right edge. */}
      <div
        className="hero-cut hero-wipe absolute inset-y-0 right-0 w-full lg:w-[58%]"
        style={{ ["--rise-delay" as string]: "620ms" }}
      >
        <HeroBackground />
      </div>

      {/* Vertical metadata rail, pinned to the left edge. */}
      <div
        className="hero-rise pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 lg:block"
        style={{ ["--rise-delay" as string]: "300ms" }}
      >
        <p className="hero-rail text-[11px] font-semibold uppercase tracking-[0.42em] text-on-navy-muted/70">
          {site.district}
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[92rem] px-6 sm:px-10 lg:px-16">
        {/* --------------------------------------------------- word column -- */}
        <div className="max-w-4xl">
          <p
            className="hero-rise flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.34em] text-leo-cyan"
            style={{ ["--rise-delay" as string]: "160ms" }}
          >
            <span aria-hidden className="h-px w-8 bg-leo-cyan/70" />
            Leo Club · Chautari Pokhara
          </p>

          <h1 className="mt-7 font-display leading-[0.86] tracking-[-0.035em] text-white">
            <span className="sr-only">
              Leadership, Experience, Opportunity — {site.name}
            </span>
            {triad.map((line, i) => (
              <span
                key={line.word}
                aria-hidden
                className={`hero-rise block text-[clamp(3.1rem,11vw,9rem)] ${line.indent} ${
                  i === 2 ? "text-leo-blue-light" : ""
                }`}
                style={{ ["--rise-delay" as string]: `${260 + i * 110}ms` }}
              >
                {line.word}
              </span>
            ))}
          </h1>

          <span
            aria-hidden
            className="hero-rule mt-9 block h-px w-40 bg-linear-to-r from-leo-cyan to-transparent"
            style={{ ["--rise-delay" as string]: "640ms" }}
          />

          <p
            className="hero-rise mt-7 max-w-md text-[0.9375rem] leading-[1.85] text-on-navy-muted"
            style={{ ["--rise-delay" as string]: "700ms" }}
          >
            {description ||
              `A youth service club in Pokhara, chartered ${site.established}. We plan and run the projects ourselves — health, education and the environment.`}
          </p>

          {/* CTA arrives last. */}
          <div
            className="hero-rise mt-10"
            style={{ ["--rise-delay" as string]: "880ms" }}
          >
            <Link
              href="/join"
              className="group relative inline-flex items-center gap-5 overflow-hidden border border-white/25 py-4 pl-7 pr-5 text-[11px] font-bold uppercase tracking-[0.26em] text-white transition-colors duration-[var(--duration-base)] hover:border-leo-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-navy"
            >
              {/* Fill sweeps in from the left behind the label. */}
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 bg-leo-blue transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-x-100"
              />
              <span className="relative">Join now</span>
              <span
                aria-hidden
                className="relative h-px w-8 bg-current transition-[width] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:w-12"
              />
            </Link>
          </div>
        </div>

        {/* ------------------------------------------------------- index ---- */}
        <nav
          aria-label="Site sections"
          className="hero-rise mt-14 hidden lg:absolute lg:bottom-0 lg:right-16 lg:mt-0 lg:block"
          style={{ ["--rise-delay" as string]: "820ms" }}
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-on-navy-muted/60">
            Index
          </p>
          <ul className="space-y-1.5">
            {index.map((entry, i) => (
              <li key={entry.href} data-hero-index={entry.href}>
                <Link
                  href={entry.href}
                  className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-on-navy-muted hover:text-white"
                >
                  <span className="tabular-nums opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="hero-index-rule h-px w-8 bg-current"
                  />
                  {entry.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* ---------------------------------------------------- masthead ------ */}
      <div
        className="hero-rise relative mx-auto mt-16 w-full max-w-[92rem] px-6 sm:px-10 lg:px-16"
        style={{ ["--rise-delay" as string]: "940ms" }}
      >
        <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-white/12 pt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-on-navy-muted/80 sm:gap-x-14">
          {[
            ["Location", "Pokhara, Nepal"],
            ["Coordinates", coordinates],
            ["Chartered", String(site.established)],
            ["District", "LDC 325 J"],
          ].map(([term, value]) => (
            <div key={term} className="flex items-baseline gap-2.5">
              <dt className="text-on-navy-muted/45">{term}</dt>
              <dd className="text-white/85">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
