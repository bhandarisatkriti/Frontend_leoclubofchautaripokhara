"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/app/lib/use-prefers-reduced-motion";

/**
 * Counts up from 0 to `end` once it scrolls into view. Only ever wraps a
 * real, already-known number (e.g. years of service) — never a placeholder.
 */
export function StatCounter({
  end,
  prefix = "",
  suffix = "",
  duration = 1400,
}: {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion) return;

    // Same hazard as Reveal: a tile already scrolled past never intersects, so
    // the counter would sit on 0 forever. Show the real figure straight away.
    if (node.getBoundingClientRect().bottom <= 0) {
      started.current = true;
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.unobserve(node);

        const startTime = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(eased * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration, reduceMotion]);

  return (
    <span ref={ref}>
      {prefix}
      {reduceMotion ? end : value}
      {suffix}
    </span>
  );
}
