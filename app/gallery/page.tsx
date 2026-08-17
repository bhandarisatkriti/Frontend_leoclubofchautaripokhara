import type { Metadata } from "next";
import { PageHeader } from "@/app/components/page-header";
import { Container } from "@/app/components/ui/container";
import { apiFetchOr, endpoints, mediaUrl, type Paginated } from "@/app/lib/api";
import { localGalleryPhotos } from "@/app/lib/local-photos";
import { GalleryGrid, type ResolvedPhoto } from "@/app/gallery/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from our service projects and club activities.",
};

type BackendPhoto = {
  id: number;
  title?: string | null;
  caption?: string | null;
  description?: string | null;
  image: string | null;
  // The API nests the category; older fixtures used a plain string.
  category?: string | { name: string } | null;
};

function categoryName(category: BackendPhoto["category"]): string | null {
  if (!category) return null;
  return typeof category === "string" ? category : category.name;
}

export default async function GalleryPage() {
  const data = await apiFetchOr<Paginated<BackendPhoto> | BackendPhoto[]>(
    endpoints.gallery,
    [],
  );
  const backendPhotos: ResolvedPhoto[] = (Array.isArray(data) ? data : data.results)
    .filter((photo) => photo.image)
    .map((photo) => ({
      id: photo.id,
      src: mediaUrl(photo.image)!,
      title: photo.title,
      caption: photo.description ?? photo.title,
      category: categoryName(photo.category),
    }));

  // The Django gallery is authoritative once an administrator has put photos
  // in it; the checked-in set in app/lib/local-photos.ts is the fallback for a
  // fresh or unreachable backend. Concatenating the two would show every photo
  // twice, since they are the same pictures.
  const photos: ResolvedPhoto[] = backendPhotos.length
    ? backendPhotos
    : localGalleryPhotos;

  return (
    <>
      <PageHeader
        kicker="Gallery"
        title="Moments from club life"
        description="Photos from our projects, camps, and club life in Pokhara."
      />

      <Container className="py-16 sm:py-20">
        <GalleryGrid photos={photos} />
      </Container>
    </>
  );
}
