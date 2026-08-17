import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/app/components/page-header";
import { EventCard, type LeoEvent } from "@/app/components/events/event-card";
import { ViewTabs } from "@/app/components/events/view-tabs";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { apiFetchOr, endpoints, type Paginated } from "@/app/lib/api";
import { stagger } from "@/app/lib/motion";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past service projects run by the club.",
};

export default async function EventsPage() {
  const data = await apiFetchOr<Paginated<LeoEvent> | LeoEvent[]>(
    endpoints.events,
    [],
  );
  const events = [...(Array.isArray(data) ? data : data.results)].sort(
    (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf(),
  );

  // Server Component rendered fresh per request — reading the current time here is intentional.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const featuredIndex = events.findIndex((event) => new Date(event.date).valueOf() >= now);
  const featured = featuredIndex >= 0 ? events[featuredIndex] : null;
  const rest = featured ? events.filter((_, i) => i !== featuredIndex) : events;

  return (
    <>
      <PageHeader
        kicker="Events"
        title="Service projects &amp; club gatherings"
        description="Camps, drives, and get-togethers — upcoming and past."
      />

      <Container className="py-16 sm:py-20">
        <Reveal className="flex justify-end">
          <ViewTabs />
        </Reveal>

        <div className="mt-8">
          {events.length === 0 ? (
            <EmptyState message="Events will appear here once they are published from the backend." />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured && (
                <Reveal className="md:col-span-2 lg:col-span-3">
                  <EventCard event={featured} featured />
                </Reveal>
              )}
              {rest.map((event, i) => (
                <Reveal key={event.id} delay={stagger(i)}>
                  <EventCard event={event} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
