import type { Metadata } from "next";
import { Container } from "@/app/components/ui/container";
import { endpoints, fetchList, mediaUrl } from "@/app/lib/api";
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
  // The gallery endpoint pages at 24 (LargeResultsSetPagination), so without
  // an explicit page size this page silently showed only the first 24 photos
  // and dropped whole albums off the filter bar. 200 is the endpoint's
  // `max_page_size`; past that this needs real pagination rather than a bigger
  // number.
  const data = await fetchList<BackendPhoto>(endpoints.gallery, { page_size: 200 });
  const backendPhotos: ResolvedPhoto[] = data
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
    <Container className="py-16 sm:py-20">
      <GalleryGrid photos={photos} />
    </Container>
  );
}
