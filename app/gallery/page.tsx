import type { Metadata } from "next";
import Image from "next/image";
import { EmptyState, PageHeader } from "@/app/components/page-header";
import { endpoints, fetchList, mediaUrl } from "@/app/lib/api";
import type { GalleryCategory, GalleryImage } from "@/app/lib/types";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from our service projects and club activities.",
};

/** `?category=<slug>` filters the grid; the backend does the filtering. */
type SearchParams = Promise<{ category?: string }>;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category } = await searchParams;

  const [photos, categories] = await Promise.all([
    fetchList<GalleryImage>(endpoints.gallery, { category, page_size: 48 }),
    fetchList<GalleryCategory>(endpoints.galleryCategories),
  ]);

  const active = categories.find((item) => item.slug === category);

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Moments from our projects, camps, and club life in Pokhara."
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        {categories.length > 0 && (
          <nav className="mb-8 flex flex-wrap gap-2" aria-label="Filter by album">
            <FilterLink href="/gallery" label="All" active={!active} />
            {categories.map((item) => (
              <FilterLink
                key={item.id}
                href={`/gallery?category=${item.slug}`}
                label={`${item.name} (${item.image_count})`}
                active={active?.slug === item.slug}
              />
            ))}
          </nav>
        )}

        {photos.length === 0 ? (
          <EmptyState
            message={
              category
                ? "No photos in this album yet."
                : "Photos will appear here once they are uploaded from the backend."
            }
          />
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => {
              const src = mediaUrl(photo.image);
              if (!src) return null;
              return (
                <li
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                >
                  <Image
                    src={src}
                    alt={photo.title || "Club photo"}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {(photo.description || photo.title) && (
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {photo.description || photo.title}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "rounded-full bg-leo-red px-4 py-1.5 text-sm font-semibold text-white"
          : "rounded-full border border-border px-4 py-1.5 text-sm text-muted hover:border-leo-violet hover:text-leo-violet"
      }
    >
      {label}
    </a>
  );
}
