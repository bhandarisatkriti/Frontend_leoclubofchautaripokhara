import Image from "next/image";
import Link from "next/link";
import { Motif } from "@/app/components/ui/motif";
import { mediaUrl } from "@/app/lib/api";

/**
 * Mirrors `EventListSerializer` on the backend. List rows carry
 * `short_description`; the full `description` only comes back from the detail
 * endpoint, so it is optional here.
 */
export type LeoEvent = {
  id: number;
  title: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  event_date: string;
  location?: string | null;
  featured_image: string | null;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const dayFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric" });
const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "short" });

export function formatEventDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? value : dateFormat.format(parsed);
}

export function EventCard({
  event,
  featured = false,
}: {
  event: LeoEvent;
  featured?: boolean;
}) {
  const image = mediaUrl(event.featured_image);
  const parsed = new Date(event.event_date);
  const hasDate = !Number.isNaN(parsed.valueOf());

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-soft-sm transition-[transform,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-leo-blue/30 hover:shadow-soft-md ${
        featured ? "lg:col-span-2 lg:flex-row" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden ${featured ? "aspect-16/9 lg:aspect-auto lg:w-1/2" : "aspect-16/9"}`}
      >
        {image ? (
          <Image
            src={image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-105"
          />
        ) : (
          <Motif variant="waves" tone="blue" />
        )}
        {featured && (
          <span className="absolute left-4 top-4 rounded-full bg-leo-blue-dark px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-soft-sm">
            Upcoming
          </span>
        )}
        {hasDate && (
          <div className="absolute bottom-4 left-4 flex flex-col items-center rounded-lg bg-background/95 px-3 py-1.5 shadow-soft-sm transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:-translate-y-1">
            <span className="text-lg font-bold leading-none text-leo-blue">
              {dayFormat.format(parsed)}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
              {monthFormat.format(parsed)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-leo-blue">
          {formatEventDate(event.event_date)}
        </p>
        <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
        {event.location && <p className="mt-1 text-sm text-muted">{event.location}</p>}
        <p className="mt-3 line-clamp-3 text-sm text-muted">
          {event.short_description || event.description}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-leo-blue">
          View details
          <span
            aria-hidden
            className="inline-block transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
