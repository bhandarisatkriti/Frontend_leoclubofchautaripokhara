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
  /**
   * Whether the backend still counts this as upcoming. Usually derived from
   * the date, but an editor can override it, so trust this over the date.
   */
  is_upcoming?: boolean;
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

/**
 * One event, as a card in the index grid.
 *
 * Shaped to match the article card so the two indexes read as the same site:
 * same proportions, same type scale, same hover. What is specific to an event
 * stays — the date tile on the photograph, and the badge marking one that is
 * still ahead.
 */
export function EventCard({ event }: { event: LeoEvent }) {
  const image = mediaUrl(event.featured_image);
  const parsed = new Date(event.event_date);
  const hasDate = !Number.isNaN(parsed.valueOf());
  // The backend honours an editor's override, so prefer it over the date.
  const upcoming = event.is_upcoming ?? (hasDate && parsed.valueOf() >= Date.now());

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-soft-sm transition-[translate,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-leo-blue/30 hover:shadow-soft-md"
    >
      <div className="relative aspect-16/10 shrink-0 overflow-hidden bg-surface">
        {image ? (
          <Image
            src={image}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-[scale] duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-[1.04]"
          />
        ) : (
          <Motif variant="waves" tone="blue" />
        )}

        {upcoming && (
          <span className="absolute left-3 top-3 rounded-full bg-leo-blue px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-soft-sm">
            Upcoming
          </span>
        )}

        {hasDate && (
          <div className="absolute bottom-3 left-3 flex flex-col items-center rounded-lg bg-background/95 px-2.5 py-1 shadow-soft-sm">
            <span className="text-base font-bold leading-none text-leo-blue">
              {dayFormat.format(parsed)}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-muted">
              {monthFormat.format(parsed)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1rem] font-bold leading-snug tracking-tight text-balance transition-colors duration-[var(--duration-fast)] group-hover:text-leo-blue">
          {event.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
          <span className="text-leo-blue">{formatEventDate(event.event_date)}</span>
          {event.location && (
            <span className="flex items-center gap-3 text-muted">
              <span aria-hidden className="h-3 w-px bg-current opacity-30" />
              {event.location}
            </span>
          )}
        </div>

        {(event.short_description || event.description) && (
          <p className="mt-2.5 line-clamp-3 text-[0.8125rem] leading-relaxed text-muted">
            {event.short_description || event.description}
          </p>
        )}

        {/* Pushed to the foot so every card in a row shares one baseline. */}
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-leo-blue">
          View details
          <span
            aria-hidden
            className="transition-[translate] duration-[var(--duration-fast)] group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
