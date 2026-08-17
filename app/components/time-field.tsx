"use client";

import { useState } from "react";

/**
 * Time chooser for event start/end times.
 *
 * `<input type="time">` makes you type hour, minute and AM/PM as separate
 * segments, which is fiddly for something that is nearly always a round time.
 * This offers a list at 15-minute steps labelled in 12-hour form, so a start
 * time is one click. Anything off the grid is still reachable through
 * "Other time…", which reveals the native input — so no capability is lost.
 */

const STEP_MINUTES = 15;

const OPTIONS = Array.from(
  { length: (24 * 60) / STEP_MINUTES },
  (_, index) => {
    const minutes = index * STEP_MINUTES;
    const hour24 = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return {
      value: `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      label: `${hour12}:${String(minute).padStart(2, "0")} ${hour24 < 12 ? "AM" : "PM"}`,
    };
  },
);

/** The API returns "14:30:00"; the controls here work in "14:30". */
function normalize(value: string): string {
  return value.slice(0, 5);
}

export function TimeField({
  id,
  value,
  onValueChange,
  required = false,
  className = "",
}: {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  className?: string;
}) {
  const current = normalize(value);
  const onGrid = current === "" || OPTIONS.some((option) => option.value === current);

  // Start in free-entry mode when an existing value is not on the 15-minute
  // grid, so editing an event saved at 09:07 does not silently round it.
  const [freeEntry, setFreeEntry] = useState(!onGrid);

  if (freeEntry) {
    return (
      <div className="mt-1.5 flex items-center gap-2">
        <input
          id={id}
          type="time"
          required={required}
          value={current}
          onChange={(event) => onValueChange(event.target.value)}
          onClick={(event) => {
            try {
              event.currentTarget.showPicker?.();
            } catch {
              /* no picker available */
            }
          }}
          className={`${className} mt-0 flex-1`}
        />
        <button
          type="button"
          onClick={() => setFreeEntry(false)}
          className="shrink-0 whitespace-nowrap text-xs font-semibold text-admin-accent-bright hover:underline"
        >
          Use list
        </button>
      </div>
    );
  }

  return (
    <select
      id={id}
      required={required}
      value={current}
      onChange={(event) => {
        if (event.target.value === "__other__") {
          setFreeEntry(true);
          return;
        }
        onValueChange(event.target.value);
      }}
      className={className}
    >
      <option value="">Not set</option>
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
      <option value="__other__">Other time…</option>
    </select>
  );
}
