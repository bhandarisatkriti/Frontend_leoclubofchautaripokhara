import { site } from "@/app/lib/site";

/**
 * A slow-scrolling band of the club's own words, sitting directly under the
 * hero as the page's signature element.
 *
 * Every phrase is real: the Leo acronym, the club motto, the district and the
 * charter year. Nothing here is invented, and it carries no information a
 * visitor needs — it is deliberately decorative, so it is hidden from screen
 * readers and frozen for anyone who has asked for reduced motion (handled
 * globally in globals.css).
 */
const phrases = [
  "Leadership",
  "Experience",
  "Opportunity",
  site.motto,
  site.district,
  `Chartered ${site.established}`,
  "Serving Pokhara",
];

export function CreedBand() {
  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y border-white/10 bg-surface-navy py-4"
    >
      {/* Fade the ends so phrases enter and leave instead of being cut off. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-surface-navy to-transparent sm:w-28"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-surface-navy to-transparent sm:w-28"
      />

      <div className="flex w-max animate-marquee items-center">
        {/* Rendered twice so the -50% travel loops without a visible seam. */}
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {phrases.map((phrase) => (
              <li
                key={`${copy}-${phrase}`}
                className="flex items-center gap-6 px-6 text-sm font-bold uppercase tracking-[0.2em] text-on-navy-muted sm:gap-8 sm:px-8 sm:text-base"
              >
                {phrase}
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-leo-blue-light" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
