import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatEventDate, type LeoEvent } from "@/app/components/events/event-card";
import { EventFacts, factIcons, type Fact } from "@/app/components/events/event-facts";
import { EventGallery, type EventPhoto } from "@/app/components/events/event-gallery";
import { EventHero } from "@/app/components/events/event-hero";
import { EventNav, type EventNavItem } from "@/app/components/events/event-nav";
import { EventStatement, EventStory } from "@/app/components/events/event-story";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { apiFetchOr, endpoints, fetchList, mediaUrl, query } from "@/app/lib/api";
import { overlayStatement, storyBlocks, storyParagraphs } from "@/app/lib/event-story";
import { site } from "@/app/lib/site";

/** The detail payload carries more than the card type needs. */
type EventDetail = LeoEvent & {
  start_time?: string | null;
  end_time?: string | null;
  organizer?: string | null;
  category?: { name: string } | null;
  registration_required?: boolean;
  registration_open?: boolean;
  registration_url?: string | null;
  registration_deadline?: string | null;
};

type GalleryRow = {
  id: number;
  title?: string | null;
  description?: string | null;
  image: string | null;
};

/** How many photographs the story may take before the gallery gets the rest. */
const STORY_PHOTOS = 3;

async function getEvent(slug: string) {
  return apiFetchOr<EventDetail | null>(`${endpoints.events}${slug}/`, null, {
    revalidate: false,
  });
}

/**
 * The event's own photographs.
 *
 * `GalleryImage` carries an optional link to an event, so an album uploaded
 * once serves both the gallery page and the event it belongs to. Titles are
 * generated from file names, so they serve as alternative text but are never
 * shown as captions — only a description an editor wrote counts as one.
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
      title: row.title?.trim() || null,
      caption: row.description?.trim() || null,
    }));
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

  const hero = mediaUrl(event.featured_image);
  const start = clock(event.start_time);
  const end = clock(event.end_time);
  const date = formatEventDate(event.event_date);

  // The photographs are divided between the three places that want them, so
  // the same picture never turns up twice on one page.
  const storyPhotos = photos.slice(0, STORY_PHOTOS);
  const afterStory = photos.slice(STORY_PHOTOS);
  const statement = overlayStatement(event.short_description);
  const bannerPhoto = statement ? (afterStory[0] ?? null) : null;
  const galleryPhotos = bannerPhoto ? afterStory.slice(1) : afterStory;

  const blocks = storyBlocks(
    storyParagraphs(event.description),
    Math.max(storyPhotos.length, 1),
  );

  const factCandidates: (Fact | null)[] = [
    { key: "date", label: "Date", value: date, icon: factIcons.date },
    start
      ? {
          key: "time",
          label: "Time",
          value: end ? `${start} – ${end}` : `From ${start}`,
          icon: factIcons.time,
        }
      : null,
    event.location
      ? {
          key: "location",
          label: "Location",
          value: event.location,
          icon: factIcons.location,
        }
      : null,
    event.organizer
      ? {
          key: "organizer",
          label: "Organised by",
          value: event.organizer,
          icon: factIcons.people,
        }
      : null,
    event.registration_required
      ? {
          key: "registration",
          label: "Registration",
          value: event.registration_open
            ? event.registration_deadline
              ? `Open until ${formatEventDate(event.registration_deadline)}`
              : "Open"
            : "Closed",
          icon: factIcons.ticket,
        }
      : null,
    {
      key: "phone",
      label: "Contact",
      value: site.phone,
      href: `tel:${site.phone.replace(/[^+\d]/g, "")}`,
      icon: factIcons.phone,
    },
    {
      key: "email",
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
      icon: factIcons.email,
    },
  ];
  const facts = factCandidates.filter((fact): fact is Fact => fact !== null);

  // Only sections that exist are offered, so no link scrolls to nothing.
  const navItems: EventNavItem[] = [
    blocks.length > 0 ? { id: "story", label: "The story" } : null,
    galleryPhotos.length > 0 ? { id: "gallery", label: "Gallery" } : null,
    { id: "details", label: "Details" },
  ].filter((item): item is EventNavItem => item !== null);

  const cta =
    event.registration_open && event.registration_url
      ? { href: event.registration_url, label: "Register now", external: true }
      : galleryPhotos.length > 0
        ? { href: "#gallery", label: "See the photographs" }
        : { href: "/join", label: "Join the club" };

  return (
    <>
      <EventHero
        title={event.title}
        image={hero}
        date={date}
        location={event.location}
        intro={event.short_description}
        upcoming={Boolean(event.is_upcoming)}
        cta={cta}
      />

      <EventNav items={navItems} />

      {blocks.length > 0 && (
        <section id="story" className="scroll-mt-32 bg-background py-16 sm:py-24">
          <div className="mx-auto max-w-[72rem] px-4">
            <Reveal className="mb-12 sm:mb-16">
              <SectionLabel>The story</SectionLabel>
            </Reveal>
            <EventStory blocks={blocks} photos={storyPhotos} />
          </div>
        </section>
      )}

      {statement && bannerPhoto && (
        <EventStatement photo={bannerPhoto} statement={statement} />
      )}

      {galleryPhotos.length > 0 && (
        <section id="gallery" className="scroll-mt-32 bg-surface-blue py-16 sm:py-24">
          <div className="mx-auto max-w-[72rem] px-4">
            <Reveal className="mb-10">
              <SectionLabel>Gallery</SectionLabel>
            </Reveal>
            <EventGallery photos={galleryPhotos} />
          </div>
        </section>
      )}

      <section id="details" className="scroll-mt-32 bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-[72rem] px-4">
          <Reveal className="mb-10">
            <SectionLabel>Event information</SectionLabel>
          </Reveal>
          <EventFacts facts={facts} />

          <Reveal className="mt-12">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-leo-blue transition-colors duration-[var(--duration-fast)] hover:text-leo-blue-dark"
            >
              ← Back to all events
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
