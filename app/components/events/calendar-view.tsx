"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatEventDate, type LeoEvent } from "@/app/components/events/event-card";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function CalendarView({ events }: { events: LeoEvent[] }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selected, setSelected] = useState<Date | null>(null);

  const parsedEvents = useMemo(
    () =>
      events
        .map((event) => ({ event, date: new Date(event.event_date) }))
        .filter((entry) => !Number.isNaN(entry.date.valueOf())),
    [events],
  );

  const monthLabel = cursor.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const cells = useMemo(() => {
    const firstWeekday = cursor.getDay();
    const totalDays = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const list: (Date | null)[] = Array.from({ length: firstWeekday }, () => null);
    for (let d = 1; d <= totalDays; d++) {
      list.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    }
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [cursor]);

  const eventsForSelected = selected
    ? parsedEvents.filter((entry) => sameDay(entry.date, selected))
    : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          aria-label="Previous month"
          className="rounded-full border border-border p-2.5 transition-colors duration-[var(--duration-fast)] hover:bg-surface"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold">{monthLabel}</h2>
        <button
          type="button"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          aria-label="Next month"
          className="rounded-full border border-border p-2.5 transition-colors duration-[var(--duration-fast)] hover:bg-surface"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-muted">
        {weekdayLabels.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`blank-${i}`} />;
          const dayEvents = parsedEvents.filter((entry) => sameDay(entry.date, date));
          const isSelected = selected !== null && sameDay(date, selected);
          const isToday = sameDay(date, new Date());
          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => setSelected(date)}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors duration-[var(--duration-fast)] ${
                isSelected
                  ? "bg-leo-blue text-white"
                  : isToday
                    ? "border border-leo-blue text-leo-blue"
                    : "hover:bg-surface"
              }`}
            >
              {date.getDate()}
              {dayEvents.length > 0 && (
                <span
                  aria-hidden
                  className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-leo-violet"}`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {!selected ? (
          <p className="text-sm text-muted">Select a day to see what&apos;s happening.</p>
        ) : eventsForSelected.length === 0 ? (
          <p className="text-sm text-muted">
            No events on {selected.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}.
          </p>
        ) : (
          <ul className="space-y-3">
            {eventsForSelected.map(({ event }) => (
              <li key={event.id}>
                <Link
                  href={`/events/${event.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-border bg-surface p-4 transition-colors duration-[var(--duration-fast)] hover:border-leo-blue/30"
                >
                  <span>
                    <span className="block font-semibold">{event.title}</span>
                    <span className="block text-sm text-muted">{formatEventDate(event.event_date)}</span>
                  </span>
                  <span
                    aria-hidden
                    className="text-leo-blue transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
