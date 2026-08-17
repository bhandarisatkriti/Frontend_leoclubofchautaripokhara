import Image from "next/image";
import Link from "next/link";
import { formatEventDate, type LeoEvent } from "@/app/components/events/event-card";
import { Motif } from "@/app/components/ui/motif";
import { mediaUrl } from "@/app/lib/api";

const dayFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric" });
const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "short" });

export function FeaturedEventCard({ event }: { event: LeoEvent }) {
  const image = mediaUrl(event.image);
  const parsed = new Date(event.date);
  const hasDate = !Number.isNaN(parsed.valueOf());

  return (
    <Link
      href={`/events/${event.id}`}
      className="group relative flex h-full min-h-[380px] flex-col justify-end overflow-hidden rounded-xl border border-border shadow-soft-sm transition-shadow duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:shadow-soft-lg"
    >
      <div className="absolute inset-0">
        {image ? (
          <Image
            src={image}
            alt={event.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-105"
          />
        ) : (
          <Motif variant="waves" tone="blue" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
      </div>

      {hasDate && (
        <div className="absolute left-5 top-5 flex flex-col items-center rounded-lg bg-white px-3 py-1.5 shadow-soft-sm">
          <span className="text-lg font-bold leading-none text-leo-blue">
            {dayFormat.format(parsed)}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            {monthFormat.format(parsed)}
          </span>
        </div>
      )}

      <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
        Featured
      </span>

      <div className="relative p-6 text-white sm:p-8">
        <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{event.title}</h3>
        <p className="mt-2 text-sm text-white/80">{formatEventDate(event.date)}</p>
        {event.location && <p className="mt-1 text-sm text-white/70">{event.location}</p>}
      </div>
    </Link>
  );
}

export function CompactEventItem({ event }: { event: LeoEvent }) {
  const image = mediaUrl(event.image);
  const parsed = new Date(event.date);
  const hasDate = !Number.isNaN(parsed.valueOf());

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-soft-sm transition-[transform,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-leo-blue/30 hover:shadow-soft-md"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
        {image ? (
          <Image
            src={image}
            alt={event.title}
            fill
            sizes="64px"
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-110"
          />
        ) : (
          <Motif variant="dots" tone="blue" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-leo-blue">
          {hasDate ? formatEventDate(event.date) : event.date}
        </p>
        <h4 className="mt-1 truncate font-semibold">{event.title}</h4>
        {event.location && <p className="mt-0.5 truncate text-sm text-muted">{event.location}</p>}
      </div>
      <span
        aria-hidden
        className="shrink-0 text-leo-blue transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
