import type { Metadata } from "next";
import Image from "next/image";
import { EmptyState, PageHeader } from "@/app/components/page-header";
import { apiFetchOr, endpoints, mediaUrl, type Paginated } from "@/app/lib/api";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from our service projects and club activities.",
};

type Photo = {
  id: number;
  title?: string | null;
  caption?: string | null;
  image: string | null;
};

export default async function GalleryPage() {
  const data = await apiFetchOr<Paginated<Photo> | Photo[]>(
    endpoints.gallery,
    [],
  );
  const photos = (Array.isArray(data) ? data : data.results).filter(
    (photo) => photo.image,
  );

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Moments from our projects, camps, and club life in Pokhara."
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        {photos.length === 0 ? (
          <EmptyState message="Photos will appear here once they are uploaded from the backend." />
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => {
              const src = mediaUrl(photo.image)!;
              const alt = photo.title ?? photo.caption ?? "Club photo";
              return (
                <li
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {photo.caption && (
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {photo.caption}
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
