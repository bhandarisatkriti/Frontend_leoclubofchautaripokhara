"use client";

import { useState } from "react";
import Image from "next/image";
import type { Member } from "@/app/components/team/team-card";
import { mediaUrl } from "@/app/lib/api";

const RING_RADIUS = 47;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const RING_ARC = RING_CIRCUMFERENCE * 0.72;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function socialsFor(member: Member) {
  return (
    [
      member.facebook_url && { href: member.facebook_url, label: "Facebook" },
      member.instagram_url && { href: member.instagram_url, label: "Instagram" },
      member.linkedin_url && { href: member.linkedin_url, label: "LinkedIn" },
    ] as const
  ).filter((entry): entry is { href: string; label: string } => Boolean(entry));
}

export function TeamSpotlight({ members }: { members: Member[] }) {
  const [active, setActive] = useState(0);
  const [brokenPhotos, setBrokenPhotos] = useState<Set<number>>(new Set());
  const member = members[active];
  const photo = mediaUrl(member.profile_image);
  const showPhoto = Boolean(photo) && !brokenPhotos.has(member.id);
  const socials = socialsFor(member);

  function markBroken(id: number) {
    setBrokenPhotos((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-soft-sm sm:p-10 lg:p-12">
      <div key={active} className="flex animate-fade-in flex-col items-center gap-10 sm:flex-row sm:items-start sm:gap-14">
        <div className="relative h-64 w-64 shrink-0 sm:h-72 sm:w-72">
          <svg viewBox="0 0 100 100" aria-hidden className="absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] -rotate-90">
            <circle cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
            <circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={`${RING_ARC} ${RING_CIRCUMFERENCE - RING_ARC}`}
              className="text-leo-blue"
            />
          </svg>

          <div className="absolute inset-3 overflow-hidden rounded-full bg-surface-blue shadow-soft-md">
            {showPhoto ? (
              <Image
                src={photo!}
                alt={member.name}
                fill
                sizes="288px"
                className="object-cover"
                onError={() => markBroken(member.id)}
              />
            ) : (
              <span className="flex h-full items-center justify-center text-4xl font-bold text-leo-blue">
                {initials(member.name)}
              </span>
            )}
          </div>

          <span className="absolute bottom-1 right-1 flex h-14 w-14 items-center justify-center rounded-full bg-leo-blue-dark font-display text-lg font-bold text-white shadow-soft-md">
            {String(active + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <span className="inline-flex rounded-full bg-leo-blue px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            {member.position}
          </span>

          <h2 className="mt-5 font-display text-3xl font-bold text-balance text-foreground sm:text-4xl lg:text-5xl">
            {member.name}
          </h2>

          {member.bio && (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{member.bio}</p>
          )}

          <div className="mt-7 flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-leo-blue" />
            <span aria-hidden className="h-px flex-1 bg-border" />
          </div>

          {socials.length > 0 && (
            <div className="mt-5 flex justify-center gap-2 sm:justify-start">
              {socials.map((social, i) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on ${social.label}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-soft-sm transition-[transform,box-shadow] duration-[var(--duration-fast)] hover:-translate-y-0.5 ${
                    i % 2 === 0 ? "bg-leo-blue" : "bg-leo-blue-dark"
                  }`}
                >
                  {social.label[0]}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {members.length > 1 && (
        <div className="mt-10 flex gap-3 overflow-x-auto pb-1 sm:mt-12">
          {members.map((m, i) => {
            const thumb = mediaUrl(m.profile_image);
            const showThumb = Boolean(thumb) && !brokenPhotos.has(m.id);
            const isActive = i === active;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View ${m.name}`}
                aria-current={isActive}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 transition-[filter,border-color,transform] duration-[var(--duration-base)] ease-[var(--ease-premium)] ${
                  isActive
                    ? "scale-105 border-leo-blue grayscale-0"
                    : "border-transparent grayscale hover:grayscale-0"
                }`}
              >
                {showThumb ? (
                  <Image
                    src={thumb!}
                    alt={m.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                    onError={() => markBroken(m.id)}
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-surface-blue text-xs font-bold text-leo-blue">
                    {initials(m.name)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
