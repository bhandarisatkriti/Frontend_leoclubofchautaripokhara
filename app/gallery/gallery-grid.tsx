"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Lightbox } from "@/app/components/ui/lightbox";
import { Reveal } from "@/app/components/ui/reveal";
import { stagger } from "@/app/lib/motion";

/** A gallery photo with an already-resolved, directly usable image URL. */
export type ResolvedPhoto = {
  id: string | number;
  src: string;
  title?: string | null;
  caption?: string | null;
  category?: string | null;
};

const aspectPresets = ["aspect-square", "aspect-[3/4]", "aspect-[4/5]", "aspect-[5/4]"];

export function GalleryGrid({ photos }: { photos: ResolvedPhoto[] }) {
  const categories = useMemo(
    () =>
      Array.from(
        new Set(photos.map((photo) => photo.category).filter((c): c is string => Boolean(c))),
      ),
    [photos],
  );

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory
    ? photos.filter((photo) => photo.category === activeCategory)
    : photos;

  const lightboxPhotos = filtered.map((photo) => ({
    src: photo.src,
    alt: photo.title ?? photo.caption ?? "Club photo",
    caption: photo.caption,
  }));

  return (
    <div>
      {categories.length >= 2 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-[var(--duration-fast)] ${
              activeCategory === null
                ? "bg-leo-blue text-white shadow-soft-sm"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-[var(--duration-fast)] ${
                activeCategory === category
                  ? "bg-leo-blue text-white shadow-soft-sm"
                  : "border border-border text-muted hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div
        key={activeCategory ?? "all"}
        className="columns-2 gap-4 sm:columns-3 lg:columns-4"
      >
        {filtered.map((photo, i) => {
          const alt = photo.title ?? photo.caption ?? "Club photo";
          const aspect = aspectPresets[i % aspectPresets.length];
          return (
            <Reveal key={photo.id} delay={stagger(i, 60, 360)} className="mb-4 break-inside-avoid">
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                className={`group relative block w-full overflow-hidden rounded-lg border border-border ${aspect}`}
              >
                <Image
                  src={photo.src}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,20,47,0.65),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                {photo.caption && (
                  <span className="absolute inset-x-0 bottom-0 translate-y-1 px-3 py-3 text-left text-xs text-white opacity-0 transition-[opacity,transform] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:translate-y-0 group-hover:opacity-100">
                    {photo.caption}
                  </span>
                )}
              </button>
            </Reveal>
          );
        })}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={lightboxPhotos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
