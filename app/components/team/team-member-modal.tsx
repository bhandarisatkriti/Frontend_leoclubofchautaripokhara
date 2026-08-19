"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { type Member } from "@/app/components/team/team-card";
import { initials } from "@/app/components/team/team-grid";
import { mediaUrl } from "@/app/lib/api";

type Phase = "open" | "closing";

/**
 * Full-photo lightbox for a team member, opened from `TeamGrid`. Mirrors the
 * open/close/backdrop conventions already established by `JoinNowPopup`
 * (same animation tokens, same scrollbar-safe body lock, same outside-click
 * pattern) rather than inventing a second one.
 */
export function TeamMemberModal({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("open");
  const [broken, setBroken] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const photo = mediaUrl(member.profile_image);

  const close = useCallback(() => {
    setPhase((current) => (current === "open" ? "closing" : current));
  }, []);

  // Unmount once the exit animation has played.
  useEffect(() => {
    if (phase !== "closing") return;
    const timer = window.setTimeout(onClose, 200);
    return () => window.clearTimeout(timer);
  }, [phase, onClose]);

  // Freeze the page behind the modal; hand the scrollbar's width to the body
  // as padding so removing it doesn't shift the page sideways.
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  const closing = phase === "closing";

  return createPortal(
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center overflow-y-auto overscroll-contain bg-[rgba(3,10,26,0.82)] p-4 backdrop-blur-sm sm:p-8 ${
        closing ? "animate-backdrop-out" : "animate-fade-in"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="fixed right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors duration-[var(--duration-fast)] hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-navy sm:right-6 sm:top-6"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name}'s photo`}
        tabIndex={-1}
        className={`relative my-auto flex max-w-[90vw] flex-col items-center outline-none ${
          closing ? "animate-modal-out" : "animate-modal-in"
        }`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {photo && !broken ? (
          // Natural intrinsic size + object-contain is the point here;
          // next/image's fill mode needs a pre-sized container, which
          // defeats that.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={member.name}
            onError={() => setBroken(true)}
            className="max-h-[70vh] max-w-[90vw] rounded-2xl object-contain shadow-[0_30px_80px_-20px_rgba(3,10,26,0.6)] sm:max-h-[75vh]"
          />
        ) : (
          <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-leo-blue text-5xl font-bold text-white shadow-[0_30px_80px_-20px_rgba(3,10,26,0.6)] sm:h-64 sm:w-64">
            {initials(member.name)}
          </div>
        )}

        <div className="mt-5 text-center">
          <h3 className="text-lg font-bold text-white sm:text-xl">{member.name}</h3>
          <p className="mt-1 text-sm text-white/70">{member.position}</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
