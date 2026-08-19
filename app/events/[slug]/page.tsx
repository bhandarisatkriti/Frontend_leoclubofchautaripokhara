import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatEventDate, type LeoEvent } from "@/app/components/events/event-card";
import { EventGallery, type EventPhoto } from "@/app/components/events/event-gallery";
import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { apiFetchOr, endpoints, fetchList, mediaUrl, query } from "@/app/lib/api";

/** The detail payload carries more than the card type needs. */
type EventDetail = LeoEvent & {
  start_time?: string | null;
  end_time?: string | null;
  organizer?: string | null;
  category?: { name: string } | null;
  registration_open?: boolean;
  registration_url?: string | null;
};

type GalleryRow = {
  id: number;
  title?: string | null;
  description?: string | null;
  image: string | null;
};

async function getEvent(slug: string) {
  return apiFetchOr<EventDetail | null>(`${endpoints.events}${slug}/`, null, {
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

/**
 * Split body copy into paragraphs on blank lines.
 *
 * Text pasted into the admin as one run-on block stays one paragraph — the
 * measure set on the container is what carries readability there — but copy
 * written with breaks keeps them instead of being flattened into a wall.
 */
function paragraphs(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n|\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/** "09:00:00" -> "09:00" */
const clock = (value?: string | null) => (value ? value.slice(0, 5) : null);

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
  const body = paragraphs(event.description ?? "");
  const lead = event.short_description?.trim();
  const start = clock(event.start_time);
  const end = clock(event.end_time);

  const facts = [
    { label: "Date", value: formatEventDate(event.event_date) },
    { label: "Time", value: start ? (end ? `${start} – ${end}` : start) : null },
    { label: "Location", value: event.location || null },
    { label: "Organised by", value: event.organizer || null },
    { label: "Category", value: event.category?.name ?? null },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <>
      {/* Full-bleed opener. The photograph is the event's own, so it earns the
          width; the gradient is what keeps the title legible over any of them. */}
      <section className="relative isolate overflow-hidden">
        <div className="relative h-[52vh] min-h-[22rem] w-full sm:h-[62vh]">
          {image ? (
            <Image
              src={image}
              alt={event.title}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          ) : (
            <Motif variant="waves" tone="blue" />
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-surface-navy via-surface-navy/55 to-surface-navy/10"
          />
        </div>

        <Container size="wide" className="absolute inset-x-0 bottom-0 pb-10 sm:pb-14">
          <Reveal className="mx-auto max-w-[60rem]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-leo-blue px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                {event.is_upcoming ? "Upcoming" : "Past event"}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/85">
                {formatEventDate(event.event_date)}
              </span>
            </div>
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[1.06] tracking-[-0.02em] text-balance text-white">
              {event.title}
            </h1>
          </Reveal>
        </Container>
      </section>

      <Container size="wide" className="py-12 sm:py-16">
        <Reveal className="mx-auto max-w-[60rem]">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-leo-blue transition-colors duration-[var(--duration-fast)] hover:text-leo-blue-dark"
          >
            ← Back to events
          </Link>
        </Reveal>

        {/* Copy and facts sit side by side so the page uses its width, while the
            text itself keeps a readable measure rather than running edge to
            edge. The photographs below share the copy column's left edge, which
            is what makes the two read as one article rather than two blocks. */}
        <div className="mx-auto mt-10 grid max-w-[60rem] gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
          <div className="min-w-0">
            {lead && (
              <Reveal>
                <p className="text-lead font-medium text-foreground">
                  {lead}
                </p>
              </Reveal>
            )}

            {body.length > 0 && (
              <Reveal delay={80}>
                <div
                  className={`space-y-5 text-base leading-[1.9] text-muted ${
                    lead ? "mt-7 border-t border-border pt-7" : ""
                  }`}
                >
                  {body.map((part, i) => (
                    <p key={i}>{part}</p>
                  ))}
                </div>
              </Reveal>
            )}

            {photos.length > 0 && (
              <div className="mt-14 border-t border-border pt-10">
                <Reveal>
                  <SectionLabel>Photographs</SectionLabel>
                </Reveal>
                <div className="mt-6">
                  <EventGallery photos={photos} />
                </div>
              </div>
            )}
          </div>

          {facts.length > 0 && (
            <Reveal direction="left" as="aside" className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft-sm">
                <SectionLabel>Details</SectionLabel>
                <dl className="mt-5 space-y-4">
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-foreground">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {event.registration_open && event.registration_url && (
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center rounded-lg bg-leo-blue px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-[var(--duration-fast)] hover:bg-leo-blue-dark"
                  >
                    Register
                  </a>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </>
  );
}
