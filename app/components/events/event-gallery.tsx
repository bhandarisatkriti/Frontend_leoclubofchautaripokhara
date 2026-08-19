"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "@/app/components/ui/lightbox";
import { Reveal } from "@/app/components/ui/reveal";
import { stagger } from "@/app/lib/motion";

export type EventPhoto = {
  id: number;
  src: string;
  title: string | null;
  caption: string | null;
};

/**
 * A repeating rhythm of tile sizes. Every fifth photograph takes two columns
 * and two rows, the one after it a double column — enough variation that the
 * grid reads as a composition rather than a contact sheet, while staying a
 * plain CSS grid, so nothing reflows after load and rows never leave holes.
 */
function spanFor(index: number): string {
  const position = index % 6;
  if (position === 0) return "sm:col-span-2 sm:row-span-2";
  if (position === 3) return "sm:col-span-2";
  return "";
}

/**
 * The event's photographs.
 *
 * `object-cover` is right here — these are uniform tiles and the eye reads the
 * grid as a whole — but the aspect ratios are kept close to the source's own so
 * a group photograph is trimmed rather than gutted. Anything the crop hides is
 * a click away in the lightbox, which shows the whole frame.
 */
export function EventGallery({ photos }: { photos: EventPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <ul className="grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {photos.map((photo, i) => (
          <Reveal
            key={photo.id}
            as="li"
            delay={stagger(i, 50)}
            className={`list-none ${spanFor(i)}`}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open photograph${photo.title ? `: ${photo.title}` : ""}`}
              className="group relative block h-full w-full overflow-hidden rounded-xl border border-border bg-surface shadow-soft-sm transition-[translate,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-leo-blue/40 hover:shadow-soft-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue focus-visible:ring-offset-2"
            >
              <Image
                src={photo.src}
                alt={photo.title ?? ""}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-[scale] duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-[1.07]"
              />

              {/* A wash and a cue on hover, so it is obvious the tile opens. */}
              <span
                aria-hidden
                className="absolute inset-0 bg-surface-navy/0 transition-colors duration-[var(--duration-base)] group-hover:bg-surface-navy/30"
              />
              <span
                aria-hidden
                className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-leo-blue opacity-0 transition-[opacity,translate] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:translate-y-0 group-hover:opacity-100 translate-y-2"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
                </svg>
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      {index !== null && (
        <Lightbox
          photos={photos.map((photo) => ({
            src: photo.src,
            alt: photo.title ?? "",
            // Only a caption an editor actually wrote. Titles are generated
            // from file names, so showing those would be visible noise.
            caption: photo.caption,
          }))}
          index={index}
          onClose={() => setIndex(null)}
          onNavigate={setIndex}
        />
      )}
    </>
  );
}
