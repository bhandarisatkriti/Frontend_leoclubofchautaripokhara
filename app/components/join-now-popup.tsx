"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  splitHeadline,
  type JoinPopupConfig,
  type JoinPopupStat,
} from "@/app/lib/join-popup";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Where a dismissal is remembered. Wrapped because storage throws outright in
 * some privacy modes, and a popup that cannot remember a dismissal is a far
 * smaller problem than a homepage that fails to render.
 */
function dismissalStore(scope: JoinPopupConfig["dismissalScope"]): Storage | null {
  if (scope === "never") return null;
  try {
    return scope === "persistent" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

type Phase = "idle" | "open" | "closing" | "done";

/**
 * Membership conversion popup shown once per visit on the homepage.
 *
 * Everything it says, where it sends people, and how often it is allowed to
 * interrupt comes from `joinPopupConfig` — see app/lib/join-popup.ts. The CTA
 * points at the existing application route (/join, app/join/page.tsx); this
 * component holds no form and no submission logic of its own.
 */
export function JoinNowPopup({
  config,
  imageSrc,
  imageAlt,
  stats = [],
}: {
  config: JoinPopupConfig;
  imageSrc: string;
  imageAlt: string;
  stats?: JoinPopupStat[];
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const { before, accent, after } = splitHeadline(config);
  const visible = phase === "open" || phase === "closing";

  const close = useCallback(() => {
    setPhase((current) => (current === "open" ? "closing" : current));
    try {
      dismissalStore(config.dismissalScope)?.setItem(config.storageKey, "1");
    } catch {
      /* storage unavailable — the popup simply reappears next visit */
    }
  }, [config.dismissalScope, config.storageKey]);

  // Open after a short delay, unless this visitor has already dismissed it.
  useEffect(() => {
    if (!config.enabled) return;
    if (dismissalStore(config.dismissalScope)?.getItem(config.storageKey)) return;
    const timer = window.setTimeout(() => setPhase("open"), config.delayMs);
    return () => window.clearTimeout(timer);
  }, [config.enabled, config.delayMs, config.dismissalScope, config.storageKey]);

  // Unmount once the exit animation has played.
  useEffect(() => {
    if (phase !== "closing") return;
    const timer = window.setTimeout(() => setPhase("done"), 200);
    return () => window.clearTimeout(timer);
  }, [phase]);

  // Freeze the page behind the modal. The scrollbar's width is handed to the
  // body as padding so removing it does not shift the whole layout sideways.
  useEffect(() => {
    if (!visible) return;
    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [visible]);

  // Move focus into the dialog, and hand it back to whatever held it before.
  useEffect(() => {
    if (phase !== "open") return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => restoreFocusRef.current?.focus?.();
  }, [phase]);

  // Escape closes; Tab cycles inside the dialog rather than escaping into the
  // page behind it, which is still rendered and still focusable.
  useEffect(() => {
    if (phase !== "open") return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const targets = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!targets.length) return;

      const first = targets[0];
      const last = targets[targets.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [phase, close]);

  if (!visible) return null;

  const closing = phase === "closing";

  return createPortal(
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center overflow-y-auto overscroll-contain bg-[rgba(3,10,26,0.78)] p-3 backdrop-blur-md sm:p-6 ${
        closing ? "animate-backdrop-out" : "animate-fade-in"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-popup-title"
        aria-describedby="join-popup-description"
        tabIndex={-1}
        className={`relative my-auto flex max-h-[94svh] w-full max-w-[60rem] flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface-navy shadow-[0_40px_100px_-25px_rgba(3,10,26,0.9)] outline-none ${
          closing ? "animate-modal-out" : "animate-modal-in"
        }`}
      >
        {/* Thin accent line across the top. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 z-20 h-[3px] bg-linear-to-r from-leo-cyan via-leo-blue to-leo-indigo"
        />

        <button
          type="button"
          onClick={close}
          aria-label="Close membership invitation"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-surface-navy/70 text-white/70 backdrop-blur-sm transition-colors duration-[var(--duration-fast)] hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-navy sm:right-4 sm:top-4"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        <div className="grid min-h-0 flex-1 overflow-y-auto overscroll-contain lg:grid-cols-12">
          {/* -------------------------------------------------------------
              Left: the pitch and the primary action.
              On mobile the CTA is lifted above the benefits (order-2) so the
              headline and the button are both reachable without scrolling.
          ------------------------------------------------------------- */}
          <div className="flex flex-col gap-7 p-6 pt-8 sm:p-9 lg:col-span-7 lg:p-11">
            <div className="order-1">
              <div className="flex items-center gap-3">
                <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white shadow-soft-sm ring-1 ring-white/20">
                  <Image
                    src={config.logoSrc}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </span>
                <span className="rounded-full border border-leo-cyan/25 bg-leo-cyan/10 px-3 py-1 text-label font-bold uppercase tracking-[0.2em] text-leo-cyan">
                  {config.label}
                </span>
              </div>

              <h2
                id="join-popup-title"
                className="mt-6 font-display text-[clamp(1.9rem,4.4vw,2.85rem)] font-bold leading-[1.08] tracking-[-0.015em] text-white"
              >
                {before}
                {accent && (
                  <span className="bg-linear-to-r from-leo-cyan to-leo-blue-light bg-clip-text text-transparent">
                    {accent}
                  </span>
                )}
                {after}
              </h2>

              <p
                id="join-popup-description"
                className="mt-4 max-w-md text-sm leading-relaxed text-on-navy-muted sm:text-base"
              >
                {config.description}
              </p>
            </div>

            <div className="order-2 lg:order-3">
              <Link
                href={config.ctaHref}
                onClick={close}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-linear-to-r from-leo-blue-dark via-leo-blue to-leo-blue-light py-4 pl-8 pr-4 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-glow-blue transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-navy sm:w-auto sm:min-w-[17rem] sm:text-base"
              >
                {config.ctaLabel}
                <span
                  aria-hidden
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/18 transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:translate-x-1"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h13M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>

              {config.signInHref && (
                <p className="mt-4 text-sm text-on-navy-muted">
                  {config.signInPrompt}{" "}
                  <Link
                    href={config.signInHref}
                    onClick={close}
                    className="font-semibold text-leo-cyan underline decoration-leo-cyan/40 underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:decoration-leo-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-navy"
                  >
                    {config.signInLabel}
                  </Link>
                </p>
              )}
            </div>

            <ul className="order-3 space-y-3 lg:order-2">
              {config.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-sm text-on-navy sm:text-[0.9375rem]"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leo-cyan/15 text-leo-cyan"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* -------------------------------------------------------------
              Right: the supporting membership panel.
          ------------------------------------------------------------- */}
          <div className="relative flex flex-col gap-5 border-t border-white/10 bg-linear-to-b from-surface-navy-soft to-surface-navy-deep p-6 sm:p-9 lg:col-span-5 lg:border-l lg:border-t-0 lg:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-leo-cyan/15 blur-3xl"
            />

            <div className="relative">
              <p className="section-label text-leo-cyan">{config.panelLabel}</p>
              <p className="mt-3 text-sm text-on-navy-muted">{config.panelIntro}</p>
              <h3 className="mt-4 text-h3 font-bold tracking-tight text-white">
                {config.panelHeadline}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-on-navy-muted">
                {config.panelBody}
              </p>
            </div>

            <div className="relative mt-auto overflow-hidden rounded-2xl ring-1 ring-white/15">
              <div className="relative aspect-16/10">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 24rem"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-surface-navy/70 via-surface-navy/10 to-transparent"
                />
              </div>
            </div>

            {stats.length > 0 && (
              <dl className="relative flex flex-wrap gap-2">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex-1 basis-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                  >
                    <dt className="text-[11px] leading-tight text-on-navy-muted">
                      {stat.value === 1 && stat.one ? stat.one : stat.label}
                    </dt>
                    <dd className="mt-0.5 text-xl font-bold leading-none text-white">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
