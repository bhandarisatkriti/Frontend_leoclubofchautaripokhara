import type { Metadata } from "next";
import { CalendarView } from "@/app/components/events/calendar-view";
import { type LeoEvent } from "@/app/components/events/event-card";
import { ViewTabs } from "@/app/components/events/view-tabs";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { apiFetchOr, endpoints, type Paginated } from "@/app/lib/api";

export const metadata: Metadata = {
  title: "Events Calendar",
  description: "Browse club events by month.",
};

export default async function EventsCalendarPage() {
  const data = await apiFetchOr<Paginated<LeoEvent> | LeoEvent[]>(
    endpoints.events,
    [],
  );
  const events = Array.isArray(data) ? data : data.results;

  return (
    <>
      <Container size="narrow" className="py-16 sm:py-20">
        <Reveal className="flex justify-end">
          <ViewTabs />
        </Reveal>

        <Reveal className="mt-8 rounded-xl border border-border bg-surface p-4 shadow-soft-sm sm:p-6">
          <CalendarView events={events} />
        </Reveal>
      </Container>
    </>
  );
}
