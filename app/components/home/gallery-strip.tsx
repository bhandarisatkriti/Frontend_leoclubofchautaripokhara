import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";
import { type ResolvedPhoto } from "@/app/gallery/gallery-grid";

function GalleryTile({
  photo,
  className = "",
  sizes,
}: {
  photo: ResolvedPhoto;
  className?: string;
  sizes: string;
}) {
  return (
    <Link
      href="/gallery"
      className={`group relative block overflow-hidden rounded-[20px] border border-white/10 shadow-soft-md ${className}`}
    >
      <Image
        src={photo.src}
        alt={photo.title ?? photo.caption ?? "Club photo"}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-[1.04]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,20,47,0.75),rgba(6,20,47,0.05)_55%,transparent)] opacity-70 transition-opacity duration-300 group-hover:opacity-95"
      />
      {photo.caption && (
        <span className="absolute inset-x-0 bottom-0 translate-y-1.5 p-3.5 text-xs font-semibold text-white opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:text-sm">
          {photo.caption}
        </span>
      )}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/0 transition-[box-shadow] duration-300 group-hover:ring-white/20"
      />
    </Link>
  );
}

export function GalleryStrip({ photos }: { photos: ResolvedPhoto[] }) {
  if (photos.length === 0) return null;

  const [featured, second, third, fourth] = photos;

  return (
    <section className="bg-background py-10 sm:py-14 lg:py-16">
      <Container size="wide">
        <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(135deg,#06142F_0%,#0A1F44_55%,#123566_100%)] px-6 py-14 shadow-soft-lg sm:rounded-[32px] sm:px-10 lg:px-12 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.18),transparent_35%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-leo-blue/10 blur-3xl"
          />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_3fr] lg:items-center lg:gap-12">
            <Reveal direction="left">
              <SectionLabel tone="cyan">Gallery Highlights</SectionLabel>
              <h2 className="mt-3 text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.08] tracking-tight text-white">
                Moments{" "}
                <span className="bg-linear-to-r from-leo-blue-light to-leo-violet-light bg-clip-text text-transparent">
                  That Define Us
                </span>
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-on-navy-muted">
                A glimpse into our service, leadership, friendship, and
                community impact.
              </p>
              <div className="mt-5">
                <ButtonLink href="/gallery" variant="primary" size="sm" withArrow>
                  View Full Gallery
                </ButtonLink>
              </div>
            </Reveal>

            <div>
              <div className="grid grid-cols-2 gap-3 sm:h-[300px] sm:grid-cols-[1.5fr_1fr] sm:grid-rows-2">
                {featured && (
                  <Reveal
                    delay={stagger(0)}
                    className="col-span-2 aspect-[16/10] sm:col-span-1 sm:row-span-2 sm:aspect-auto sm:h-full"
                  >
                    <GalleryTile
                      photo={featured}
                      className="h-full"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 55vw, 32vw"
                    />
                  </Reveal>
                )}
                {second && (
                  <Reveal delay={stagger(1)} className="aspect-square sm:aspect-auto sm:h-full">
                    <GalleryTile
                      photo={second}
                      className="h-full"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 27vw, 16vw"
                    />
                  </Reveal>
                )}
                {third && (
                  <Reveal delay={stagger(2)} className="aspect-square sm:aspect-auto sm:h-full">
                    <GalleryTile
                      photo={third}
                      className="h-full"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 27vw, 16vw"
                    />
                  </Reveal>
                )}
              </div>

              {fourth && (
                <Reveal delay={stagger(3)} className="mt-3 hidden aspect-[21/6] sm:block">
                  <GalleryTile
                    photo={fourth}
                    className="h-full"
                    sizes="(max-width: 1024px) 82vw, 48vw"
                  />
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
