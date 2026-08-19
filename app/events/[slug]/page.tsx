import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatEventDate, type LeoEvent } from "@/app/components/events/event-card";
import { EventGallery, type EventPhoto } from "@/app/components/events/event-gallery";
import { SectionLabel } from "@/app/components/ui/section-label";
import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { apiFetchOr, endpoints, fetchList, mediaUrl, query } from "@/app/lib/api";

type GalleryRow = {
  id: number;
  title?: string | null;
  description?: string | null;
  image: string | null;
};

async function getEvent(slug: string) {
  return apiFetchOr<LeoEvent | null>(`${endpoints.events}${slug}/`, null, {
    revalidate: false,
  });
}

/**
 * The event's own photographs.
 *
 * `GalleryImage` carries an optional link to an event, so an album uploaded
 * once serves both the gallery page and the event it belongs to — there is no
 * separate per-event upload to keep in step. Filtering by slug rather than id
 * keeps this to a single request.
 */
async function getEventPhotos(slug: string): Promise<EventPhoto[]> {
  const rows = await fetchList<GalleryRow>(
    `${endpoints.gallery}${query({ event: slug, page_size: 60, ordering: "display_order" })}`,
  );
  return rows
    .filter((row) => row.image)
    .map((row) => ({
      id: row.id,
      src: mediaUrl(row.image)!,
      title: row.title ?? null,
      caption: row.description ?? row.title ?? null,
    }));
}

export async function generateMetadata({
  params,
}: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  return event
    ? { title: event.title, description: event.short_description ?? undefined }
    : { title: "Event" };
}

export default async function EventDetailPage({
  params,
}: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const [event, photos] = await Promise.all([
    getEvent(slug),
    getEventPhotos(slug),
  ]);
  if (!event) notFound();

  const image = mediaUrl(event.featured_image);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative aspect-21/9 sm:aspect-3/1">
          {image ? (
            <Image src={image} alt={event.title} fill sizes="100vw" className="object-cover" priority />
          ) : (
            <Motif variant="waves" tone="blue" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
        </div>
        <Container className="absolute inset-x-0 bottom-0 pb-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
              {formatEventDate(event.event_date)}
            </p>
            <h1 className="mt-2 max-w-3xl text-h1 font-bold tracking-tight text-white">
              {event.title}
            </h1>
          </Reveal>
        </Container>
      </section>

      <Container size="narrow" className="py-16 sm:py-20">
        <Reveal>
          <Link
            href="/events"
            className="text-sm font-semibold text-leo-blue transition-colors duration-[var(--duration-fast)] hover:text-leo-blue-dark"
          >
            ← Back to events
          </Link>

          {event.location && (
            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-muted">
              {event.location}
            </p>
          )}
          <p className="mt-4 text-lead text-foreground">
            {event.description || event.short_description}
          </p>
        </Reveal>

        {photos.length > 0 && (
          <div className="mt-14 border-t border-border pt-10">
            <Reveal>
              <SectionLabel>Photographs</SectionLabel>
              <p className="mt-2 text-sm text-muted">
                {photos.length} photo{photos.length === 1 ? "" : "s"} from this
                event. Select one to view it larger.
              </p>
            </Reveal>
            <div className="mt-7">
              <EventGallery photos={photos} />
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
