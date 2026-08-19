import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/app/components/page-header";
import { EventCard, type LeoEvent } from "@/app/components/events/event-card";
import { ViewTabs } from "@/app/components/events/view-tabs";
import { Container } from "@/app/components/ui/container";
import { Pagination } from "@/app/components/ui/pagination";
import { Reveal } from "@/app/components/ui/reveal";
import { apiFetchOr, endpoints, query, type Paginated } from "@/app/lib/api";
import { stagger } from "@/app/lib/motion";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past service projects run by the club.",
};

/** Divides by two, three and four, so the grid's last row always fills. */
const PAGE_SIZE = 12;

/**
 * Event index: a grid of cards, three or four to a row, paginated.
 *
 * Same shape as the article index, because the two are the same kind of page
 * and there is no reason for a reader to have to relearn one after the other.
 * The order is the backend's own — most recent date first — so paging forward
 * walks steadily back through the club's calendar. Which events are still
 * ahead is carried by the badge on the card rather than by position, since
 * that stays true whichever page you are on.
 */
export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Math.floor(Number(pageParam)) || 1);

  const data = await apiFetchOr<Paginated<LeoEvent> | LeoEvent[]>(
    `${endpoints.events}${query({ page, page_size: PAGE_SIZE })}`,
    [],
  );

  const events = Array.isArray(data) ? data : data.results;
  const total = Array.isArray(data) ? data.length : data.count;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className="bg-surface-blue py-14 sm:py-20">
      <Container size="wide">
        <Reveal className="flex justify-end">
          <ViewTabs />
        </Reveal>

        <div className="mt-8">
          {events.length === 0 ? (
            /* Past the last page the API 404s and the fallback empties, which
               would otherwise strand a reader on a blank page with no way back. */
            page > 1 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-muted">
                  There are no events on this page.
                </p>
                <Link
                  href="/events"
                  className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-leo-blue hover:underline"
                >
                  Back to the first page
                </Link>
              </div>
            ) : (
              <EmptyState message="Events will appear here once they are published from the backend." />
            )
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {events.map((event, i) => (
                  <Reveal key={event.id} delay={stagger(i, 60)} className="h-full">
                    <EventCard event={event} />
                  </Reveal>
                ))}
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                basePath="/events"
                className="mt-12"
              />
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
