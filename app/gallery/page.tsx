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
  image: string | null;
  category?: string | null;
};

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
      caption: photo.caption,
      category: photo.category,
    }));

  // Real uploaded club photos take priority over backend photos until the
  // gallery endpoint is populated — see the IMAGE PRIORITY note this mirrors
  // in app/lib/local-photos.ts.
  const photos: ResolvedPhoto[] = [...localGalleryPhotos, ...backendPhotos];

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
