"use client";

import { useRef, useState } from "react";
import { type Member } from "@/app/components/team/team-card";
import { TeamMemberModal } from "@/app/components/team/team-member-modal";
import { MediaImage } from "@/app/components/ui/media-image";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { mediaUrl } from "@/app/lib/api";
import { stagger } from "@/app/lib/motion";

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

// Must match the literal `duration-[320ms]` below — Tailwind classes have to be
// static strings for its build-time scanner to pick them up, so this can't be
// interpolated from POP_MS.
const POP_MS = 320;

function TeamGridCard({
  member,
  featured = false,
  onSelect,
}: {
  member: Member;
  featured?: boolean;
  onSelect: (member: Member) => void;
}) {
  const photo = mediaUrl(member.profile_image);
  const [popped, setPopped] = useState(false);
  // Tracks whether the photo actually rendered, not just whether a URL
  // exists — a record can have `profile_image` set to a path that 404s, in
  // which case MediaImage already falls back to initials on the card, but
  // the URL string alone would still look "truthy" to a naive click gate.
  const [photoBroken, setPhotoBroken] = useState(false);
  const cardRef = useRef<HTMLElement | null>(null);

  function handleClick() {
    setPopped(true);
    window.setTimeout(() => setPopped(false), POP_MS);
    // Members without a real, working uploaded photo only have the initials
    // fallback — nothing to show larger, so clicking them just plays the pop
    // and doesn't open an empty lightbox.
    if (photo && !photoBroken) onSelect(member);
  }

  // A light 3D tilt that follows the cursor — mutating the DOM node's style
  // directly rather than routing every mousemove through React state, since
  // that would re-render on every pixel of cursor movement for no benefit
  // (nothing else about the card depends on the tilt angle).
  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 10;
    const rotateX = (0.5 - py) * 10;
    node.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  }

  function handleMouseLeave() {
    if (cardRef.current) cardRef.current.style.transform = "";
  }

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex h-full flex-col overflow-hidden rounded-[20px] bg-white text-center shadow-soft-lg ring-1 ring-black/[0.04] transition-[transform,box-shadow] duration-200 ease-out will-change-transform hover:shadow-glow-blue"
    >
      {featured && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-linear-to-r from-leo-blue-dark to-leo-blue px-3.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-soft-sm">
          {member.position}
        </span>
      )}

      {/* Photo sits inside a white mat (padding on every side) instead of
          bleeding to the card's own edges — its own rounded corners, rather
          than borrowing the card's. */}
      <div className="p-3 sm:p-4">
        <button
          type="button"
          onClick={handleClick}
          aria-label={photo && !photoBroken ? `View ${member.name}'s photo` : member.name}
          className="relative block aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-leo-blue"
        >
          <MediaImage
            src={photo}
            alt={member.name}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 26vw, 18vw"
            className="object-cover object-top transition-transform duration-[320ms] ease-[var(--ease-premium)] group-hover:scale-[1.15]"
            // Inline style, not a Tailwind class: `group-hover:scale-[1.15]`
            // has higher specificity than a plain `.scale-*` class, so while
            // the mouse is hovering (the normal case for a real click) the
            // hover rule would otherwise mask the pop entirely. An inline
            // style always wins over any class, hover or not.
            style={popped ? { scale: "1.35" } : undefined}
            onError={() => setPhotoBroken(true)}
            fallback={
              <span className="flex h-full items-center justify-center bg-surface-navy text-3xl font-bold text-white/90">
                {initials(member.name)}
              </span>
            }
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-5 pt-1 transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:-translate-y-1 sm:px-5">
        <h3
          className={`font-bold tracking-tight text-foreground transition-colors duration-[var(--duration-fast)] group-hover:text-leo-blue ${
            featured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
          }`}
        >
          {member.name}
        </h3>
        <span aria-hidden className="mt-2 h-0.5 w-8 rounded-full bg-leo-blue/60" />
        <p className="mt-2 text-sm text-muted">{member.position}</p>
      </div>
    </article>
  );
}

export function TeamGrid({ members }: { members: Member[] }) {
  // The API already returns members sorted by `(display_order, name)`
  // server-side (apps/team/models.py) — this sort is belt-and-suspenders so
  // the layout is still correct if that ever changes, not the only thing
  // enforcing it. Ties keep the API's relative order (a stable sort), so an
  // admin's `display_order` value is what actually controls the layout —
  // no role-keyword guessing, no hardcoded names.
  const sorted = [...members].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );
  const topRow = sorted.slice(0, 2);
  const rest = sorted.slice(2);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <section className="relative overflow-hidden bg-surface-blue py-16 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 animate-float-slower rounded-full bg-leo-blue/10 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-leo-cyan/10 blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 h-72 w-72 rounded-full bg-leo-blue/8 blur-3xl" />
        <Motif variant="dots" tone="blue" className="opacity-[0.06]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-leo-blue">
            <span aria-hidden className="h-px w-8 bg-leo-blue/50" />
            Our People
            <span aria-hidden className="h-px w-8 bg-leo-blue/50" />
          </span>
          <h2 className="mt-4 text-h2 font-bold tracking-tight text-foreground">
            Meet Our Leadership
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            The dedicated Leos leading Leo Club of Chautari Pokhara this year
            — serving with purpose, integrity, and heart.
          </p>
        </Reveal>

        {topRow.length > 0 && (
          <div
            className={
              topRow.length === 1
                ? "mx-auto mt-14 max-w-xs"
                : "mx-auto mt-14 grid max-w-2xl gap-8 sm:grid-cols-2"
            }
          >
            {topRow.map((member, i) => (
              <Reveal key={member.id} delay={stagger(i, 100)}>
                <TeamGridCard member={member} featured onSelect={setSelectedMember} />
              </Reveal>
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {rest.map((member, i) => (
              <Reveal key={member.id} as="li" delay={stagger(i, 80)} className="list-none">
                <TeamGridCard member={member} onSelect={setSelectedMember} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>

      {selectedMember && (
        <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </section>
  );
}
