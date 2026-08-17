import type { Metadata } from "next";
import Image from "next/image";
import { EmptyState, PageHeader } from "@/app/components/page-header";
import { apiFetchOr, endpoints, mediaUrl, type Paginated } from "@/app/lib/api";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past service projects run by the club.",
};

type LeoEvent = {
  id: number;
  title: string;
  description: string;
  date: string;
  location?: string | null;
  image: string | null;
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

export default async function EventsPage() {
  const data = await apiFetchOr<Paginated<LeoEvent> | LeoEvent[]>(
    endpoints.events,
    [],
  );
  const events = Array.isArray(data) ? data : data.results;

  return (
    <>
      <PageHeader
        title="Events"
        description="Service projects, camps, and club gatherings — upcoming and past."
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        {events.length === 0 ? (
          <EmptyState message="Events will appear here once they are published from the backend." />
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const image = mediaUrl(event.image);
              return (
                <li
                  key={event.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface"
                >
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
                      {formatDate(event.date)}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">{event.title}</h2>
                    {event.location && (
                      <p className="mt-1 text-sm text-muted">{event.location}</p>
                    )}
                    <p className="mt-3 text-sm text-muted">{event.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
