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
 * The photographs attached to one event.
 *
 * Deliberately not the `/gallery` grid: that one carries a category filter bar
 * and staggered aspect ratios, both of which are noise here — every photo on
 * this page already belongs to the same event, so a plain uniform grid reads
 * better and keeps the page about the event rather than about browsing.
 */
export function EventGallery({ photos }: { photos: EventPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {photos.map((photo, i) => (
          <Reveal
            key={photo.id}
            as="li"
            delay={stagger(i, 60)}
            className="list-none"
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open photo${photo.title ? `: ${photo.title}` : ""}`}
              className="group relative block w-full overflow-hidden rounded-xl border border-border bg-surface shadow-soft-sm transition-[translate,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-leo-blue/30 hover:shadow-soft-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue"
            >
              <span className="relative block aspect-4/3">
                <Image
                  src={photo.src}
                  alt={photo.title ?? ""}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-[scale] duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-[1.05]"
                />
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
