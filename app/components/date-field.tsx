"use client";

import { useEffect, useRef } from "react";

/**
 * A date input that opens its calendar when the field is clicked.
 *
 * `<input type="date">` already has a native picker, but Chrome and Edge only
 * open it from the small indicator icon — clicking the text simply puts the
 * caret there, which reads as "you have to type the date". `showPicker()` makes
 * the whole control open the calendar. Typing still works for anyone who
 * prefers it, and the native control keeps its locale, keyboard support and
 * mobile date wheels.
 *
 * `birthdate` bounds the calendar to plausible dates of birth, so it opens near
 * the right decade instead of the current month. The range mirrors the
 * backend's MINIMUM_AGE/MAXIMUM_AGE, which is the real validation.
 */
export function DateField({
  birthdate = false,
  className = "",
  ...rest
}: {
  birthdate?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = ref.current;
    if (!input || !birthdate) return;

    // Set after mount rather than during render: `new Date()` on the server and
    // on the client can straddle midnight and mismatch during hydration.
    const today = new Date();
    const iso = (yearsAgo: number) => {
      const date = new Date(today);
      date.setFullYear(date.getFullYear() - yearsAgo);
      return date.toISOString().slice(0, 10);
    };
    input.max = iso(12);
    input.min = iso(120);
  }, [birthdate]);

  function openPicker() {
    // Throws if the browser has no picker or the call is not user-activated;
    // in that case the field still behaves as a normal date input.
    try {
      ref.current?.showPicker?.();
    } catch {
      /* no picker available */
    }
  }

  return (
    <input
      {...rest}
      ref={ref}
      type="date"
      onClick={(event) => {
        rest.onClick?.(event);
        openPicker();
      }}
      onKeyDown={(event) => {
        rest.onKeyDown?.(event);
        // Keyboard users get the calendar on Enter/Space without it hijacking
        // Tab navigation the way opening on focus would.
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPicker();
        }
      }}
      // The native indicator is near-black, which disappears on the dark admin
      // panels; inverting it keeps it visible on both themes.
      className={`${className} cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100`}
    />
  );
}
