"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Motif } from "@/app/components/ui/motif";

/**
 * The opening of an event page: the photograph carries the screen, the words
 * sit over its darkest part.
 *
 * The image is oversized and drifts slightly against the scroll. That parallax
 * is deliberately small — a few dozen pixels — because the point is to make the
 * hero feel alive as you leave it, not to pull attention away from the title.
 * It is driven by a rAF-throttled scroll listener rather than a CSS trick so it
 * can be switched off outright for anyone who asked for reduced motion.
 */
export function EventHero({
  title,
  image,
  date,
  location,
  intro,
  upcoming,
  cta,
}: {
  title: string;
  image: string | null;
  date: string;
  location?: string | null;
  intro?: string | null;
  upcoming: boolean;
  cta: { href: string; label: string; external?: boolean } | null;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const node = frameRef.current;
      if (!node) return;
      const { top, height } = node.getBoundingClientRect();
      // 0 while the hero fills the screen, growing as it scrolls away.
      const progress = Math.min(1, Math.max(0, -top / Math.max(height, 1)));
      setOffset(progress * 80);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={frameRef}
      className="relative isolate flex min-h-[78vh] items-end overflow-hidden sm:min-h-[86vh]"
    >
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {/* Taller than the frame so the drift never exposes an edge. */}
        <div
          className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform"
          style={{ translate: `0 ${offset}px` }}
        >
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          ) : (
            <Motif variant="waves" tone="blue" />
          )}
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-surface-navy via-surface-navy/70 to-surface-navy/25" />
      </div>

      <div className="mx-auto w-full max-w-[72rem] px-4 pb-14 pt-32 sm:pb-20">
        <div className="hero-rise flex flex-wrap items-center gap-3" style={{ ["--rise-delay" as string]: "60ms" }}>
          {/* Only marked when it is still ahead. Labelling everything else
              "past" dates the page against itself — the date is right there. */}
          {upcoming && (
            <span className="rounded-full bg-leo-blue px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
              Upcoming
            </span>
          )}
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/85">
            {date}
          </span>
          {location && (
            <>
              <span aria-hidden className="h-3 w-px bg-white/30" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/85">
                {location}
              </span>
            </>
          )}
        </div>

        <h1
          className="hero-rise mt-5 max-w-4xl font-display text-[clamp(2.25rem,5.4vw,4.25rem)] font-bold leading-[1.03] tracking-[-0.025em] text-balance text-white"
          style={{ ["--rise-delay" as string]: "140ms" }}
        >
          {title}
        </h1>

        {intro && (
          <p
            className="hero-rise mt-6 max-w-2xl text-[1.0625rem] leading-[1.75] text-white/85"
            style={{ ["--rise-delay" as string]: "230ms" }}
          >
            {intro}
          </p>
        )}

        {cta && (
          <div className="hero-rise mt-9" style={{ ["--rise-delay" as string]: "320ms" }}>
            {cta.external ? (
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={ctaClasses}
              >
                {cta.label}
                <span aria-hidden>→</span>
              </a>
            ) : (
              <Link href={cta.href} className={ctaClasses}>
                {cta.label}
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const ctaClasses =
  "inline-flex items-center gap-2.5 rounded-full bg-leo-blue px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-glow-blue transition-[translate,background-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-leo-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-surface-navy";
