"use client";

import { useEffect, useState } from "react";

export type EventNavItem = { id: string; label: string };

/**
 * Sticky in-page navigation for a long event page.
 *
 * Sections are passed in rather than assumed, because which ones exist depends
 * on what the event actually has — an event with no photographs should not
 * offer a Gallery link that scrolls nowhere.
 *
 * The highlight is resolved from scroll position rather than by an
 * IntersectionObserver. An observer only reports sections that are crossing its
 * band, so scrolling back above the first section left nothing intersecting and
 * the highlight stuck on whichever section was last seen. Asking "which section
 * have I most recently passed" always has an answer, including at the very top
 * and the very bottom of the page.
 */
export function EventNav({ items }: { items: EventNavItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length < 2) return;

    let ticking = false;

    const resolve = () => {
      ticking = false;
      const sections = items
        .map((item) => document.getElementById(item.id))
        .filter((node): node is HTMLElement => Boolean(node));
      if (!sections.length) return;

      // A section counts as current once its top passes a third of the way up
      // the viewport — roughly where a heading sits when you are reading it.
      const line = window.innerHeight * 0.35;

      // The last section at or above the line, defaulting to the first while
      // still above them all.
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section;
      }

      // At the very bottom the final section may never reach the line, so the
      // last item wins outright.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      setActive(atBottom ? sections[sections.length - 1].id : current.id);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(resolve);
    };

    resolve();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      /* Sits directly under the site header, which is why the offset matches
         the scroll-padding set on <html>. */
      className="sticky top-[var(--header-h,4.5rem)] z-30 border-y border-border bg-background/85 backdrop-blur"
    >
      <div className="mx-auto flex max-w-[72rem] gap-1 overflow-x-auto px-4 py-2.5">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={active === item.id ? "true" : undefined}
            className={`shrink-0 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-[var(--duration-fast)] ${
              active === item.id
                ? "bg-leo-blue text-white"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
