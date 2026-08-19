import Image from "next/image";
import { Reveal } from "@/app/components/ui/reveal";
import type { StoryBlock } from "@/app/lib/event-story";
import type { EventPhoto } from "@/app/components/events/event-gallery";

/**
 * The event's account of itself, told as alternating panels.
 *
 * Each block of text is paired with one of the event's own photographs, and the
 * sides swap on every step. That alternation is the whole point: a column of
 * text with pictures beneath it reads as a document, whereas a picture that
 * changes side as you scroll reads as a story being told.
 *
 * Photographs here are `object-contain` on a tinted ground rather than
 * `object-cover`. Event photographs are group shots — cropping them to fill a
 * fixed frame reliably cuts people out at the edges, which is worse than a
 * little letterboxing.
 */
export function EventStory({
  blocks,
  photos,
}: {
  blocks: StoryBlock[];
  photos: EventPhoto[];
}) {
  if (blocks.length === 0) return null;

  return (
    <div className="space-y-16 sm:space-y-24">
      {blocks.map((block, i) => {
        const photo = photos[i] ?? null;
        const reversed = i % 2 === 1;

        // Without a photograph the text keeps a reading measure and centres,
        // rather than stretching across a column meant to hold two things.
        if (!photo) {
          return (
            <Reveal key={i} className="mx-auto max-w-[46rem]">
              <div className="space-y-5 text-base leading-[1.9] text-muted">
                {block.paragraphs.map((paragraph, j) => (
                  <p key={j}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          );
        }

        return (
          <div
            key={i}
            className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
          >
            <Reveal
              direction={reversed ? "left" : "right"}
              className={reversed ? "lg:order-2" : undefined}
            >
              <div className="group relative aspect-4/3 overflow-hidden rounded-2xl border border-border bg-surface shadow-soft-md">
                <Image
                  src={photo.src}
                  alt={photo.title ?? ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="object-contain transition-[scale] duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-[1.03]"
                />
              </div>
            </Reveal>

            <Reveal
              direction={reversed ? "right" : "left"}
              delay={90}
              className={reversed ? "lg:order-1" : undefined}
            >
              <div className="space-y-5 text-base leading-[1.9] text-muted">
                {block.paragraphs.map((paragraph, j) => (
                  <p key={j}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

/**
 * A full-bleed photograph carrying one line of the event's own summary.
 *
 * Used once, as a break between story panels. More than once and it stops
 * being a pause and becomes the rhythm.
 */
export function EventStatement({
  photo,
  statement,
}: {
  photo: EventPhoto;
  statement: string;
}) {
  return (
    <section className="relative isolate flex min-h-[24rem] items-center overflow-hidden sm:min-h-[30rem]">
      <Image
        src={photo.src}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-r from-surface-navy/92 via-surface-navy/70 to-surface-navy/35"
      />

      <div className="mx-auto w-full max-w-[72rem] px-4">
        <Reveal>
          <p className="max-w-2xl font-display text-[clamp(1.375rem,2.8vw,2.125rem)] font-bold leading-[1.3] tracking-tight text-balance text-white">
            {statement}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
