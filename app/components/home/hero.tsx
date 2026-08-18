import Link from "next/link";
import { HeroBackground } from "@/app/components/home/hero-background";
import { site } from "@/app/lib/site";

/**
 * Homepage masthead.
 *
 * The photograph is full-bleed behind a left-weighted scrim, so the copy always
 * has a dark field to sit on and never collides with faces in the picture. An
 * earlier version cut the photo on a slant beside the text; the two fought each
 * other at most widths, which is what made the composition read as broken.
 *
 * The signature is the editorial metadata: real Pokhara coordinates, the
 * charter year and the district, ruled off along the bottom the way a printed
 * masthead carries them.
 *
 * The three words are what LEO stands for, so the headline states the club's
 * own identity. `description` stays admin-editable through the club profile.
 */

const triad = ["Leadership", "Experience", "Opportunity"];

/** Pokhara, to the minute. */
const masthead: [string, string][] = [
  ["Location", "Pokhara, Nepal"],
  ["Coordinates", "28°13′N 83°59′E"],
  ["Chartered", String(site.established)],
  ["District", "LDC 325 J"],
];

export function Hero({ description }: { description?: string | null } = {}) {
  return (
    <section className="relative isolate flex min-h-[38rem] flex-col justify-end overflow-hidden bg-surface-navy pb-10 pt-24 sm:min-h-[44rem] sm:pt-28 lg:min-h-[calc(100svh-1rem)] lg:max-h-[56rem] lg:pb-12">
      {/* Photograph, full width behind everything. */}
      <div className="absolute inset-0 -z-10">
        <HeroBackground />
      </div>

      {/* District, set vertically down the outer edge. */}
      <p
        aria-hidden
        className="hero-rail hero-rise pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/35 xl:block"
        style={{ ["--rise-delay" as string]: "700ms" }}
      >
        {site.district}
      </p>

      <div className="mx-auto w-full max-w-[92rem] px-6 sm:px-10 lg:px-16">
        {/* ------------------------------------------------------- copy ---- */}
        <div className="max-w-3xl">
          <p
            className="hero-rise flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-leo-cyan"
            style={{ ["--rise-delay" as string]: "120ms" }}
          >
            <span aria-hidden className="h-px w-10 bg-leo-cyan/70" />
            Leo Club of Chautari Pokhara
          </p>

          <h1 className="mt-6 font-display leading-[0.94] tracking-[-0.03em] text-white">
            <span className="sr-only">
              Leadership, Experience, Opportunity — {site.name}
            </span>
            {triad.map((word, i) => (
              <span
                key={word}
                aria-hidden
                className={`hero-rise block text-[clamp(2.6rem,7.4vw,6rem)] ${
                  i === 2 ? "text-leo-blue-light" : ""
                }`}
                style={{ ["--rise-delay" as string]: `${220 + i * 110}ms` }}
              >
                {word}
                {i < 2 && "."}
              </span>
            ))}
          </h1>

          {description && (
            <p
              className="hero-rise mt-7 max-w-xl text-[0.9375rem] leading-[1.85] text-white/75"
              style={{ ["--rise-delay" as string]: "580ms" }}
            >
              {description}
            </p>
          )}

          {/* Primary and secondary actions. */}
          <div
            className="hero-rise mt-9 flex flex-wrap items-center gap-4"
            style={{ ["--rise-delay" as string]: "700ms" }}
          >
            <Link
              href="/join"
              className="group relative inline-flex items-center overflow-hidden border border-white/30 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition-colors duration-[var(--duration-base)] hover:border-leo-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-navy"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 bg-leo-blue transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-x-100"
              />
              <span className="relative">Join now</span>
            </Link>

            <Link
              href="/about"
              className="group inline-flex items-center py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70 transition-colors duration-[var(--duration-base)] hover:text-white"
            >
              Explore our work
            </Link>
          </div>
        </div>

        {/* --------------------------------------------------- masthead ---- */}
        <dl
          className="hero-rise mt-14 flex flex-wrap items-baseline gap-x-10 gap-y-3 border-t border-white/15 pt-5 text-[10px] font-semibold uppercase tracking-[0.22em] sm:gap-x-16 lg:mt-20"
          style={{ ["--rise-delay" as string]: "840ms" }}
        >
          {masthead.map(([term, value]) => (
            <div key={term} className="flex items-baseline gap-2.5">
              <dt className="text-white/40">{term}</dt>
              <dd className="text-white/85">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
