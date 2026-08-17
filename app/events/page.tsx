import type { Metadata } from "next";
import Image from "next/image";
import { EmptyState, PageHeader } from "@/app/components/page-header";
import { endpoints, fetchList, mediaUrl } from "@/app/lib/api";
import type { LeoEvent } from "@/app/lib/types";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past service projects run by the club.",
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? value : dateFormat.format(parsed);
}

/** "17:00:00" -> "17:00". Times are optional on all-day events. */
function formatTime(value: string | null) {
  return value ? value.slice(0, 5) : null;
}

function EventCard({ event }: { event: LeoEvent }) {
  const image = mediaUrl(event.featured_image);
  const start = formatTime(event.start_time);
  const end = formatTime(event.end_time);

  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="relative aspect-16/9 bg-linear-to-br from-leo-green/20 to-leo-violet/20">
        {image && (
          <Image
            src={image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-leo-red">
          {formatDate(event.event_date)}
          {start && ` · ${start}${end ? `–${end}` : ""}`}
        </p>
        <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
        {event.location && (
          <p className="mt-1 text-sm text-muted">{event.location}</p>
        )}
        {event.short_description && (
          <p className="mt-3 text-sm text-muted">{event.short_description}</p>
        )}
        {event.registration_open && event.registration_url && (
          <a
            href={event.registration_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-leo-violet hover:text-leo-red"
          >
            Register →
          </a>
        )}
      </div>
    </li>
  );
}

export default async function EventsPage() {
  // Two requests so each list is sorted the way it reads best: soonest-first
  // for what is coming up, most-recent-first for what has already happened.
  const [upcoming, past] = await Promise.all([
    fetchList<LeoEvent>(endpoints.events, {
      upcoming: true,
      ordering: "event_date",
      page_size: 24,
    }),
    fetchList<LeoEvent>(endpoints.events, {
      past: true,
      ordering: "-event_date",
      page_size: 12,
    }),
  ]);

  return (
    <>
      <PageHeader
        title="Events"
        description="Service projects, camps, and club gatherings — upcoming and past."
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        <section>
          <h2 className="text-xl font-bold tracking-tight">Upcoming</h2>
          {upcoming.length === 0 ? (
            <div className="mt-6">
              <EmptyState message="No upcoming events are scheduled right now. Check back soon." />
            </div>
          ) : (
            <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </ul>
          )}
        </section>

        {past.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold tracking-tight">Past events</h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
