import Image from "next/image";
import { getSiteImage } from "@/app/lib/api";

/**
 * Hero backdrop. Uses whatever an administrator placed in the HERO slot
 * (Admin → Website images) and falls back to the checked-in Charter Night
 * cover photo when none is set, so the hero is never blank.
 *
 * The scrim is built from several layers rather than one gradient: the copy
 * needs near-solid navy behind it, the overlaid navigation needs its own band
 * at the very top, and the members on the right of the photo need to stay
 * visible. One gradient cannot do all three without washing the photo out.
 */
export async function HeroBackground() {
  const placed = await getSiteImage("HERO");

  const src = placed?.image ?? "/images/hero/charter-night-cover.jpg";
  const alt =
    placed?.alt_text ||
    placed?.title ||
    "Leo Club of Chautari Pokhara members at their 6th Charter Night ceremony";

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="animate-hero-zoom object-cover object-[center_30%] sm:object-[center_24%] lg:object-[center_20%]"
      />

      {/* Base darkening. The charter-night photo is bright — a white ceiling
          and a lit banner directly behind the headline — so a directional
          gradient alone cannot hold contrast; the flat layer does that, and the
          gradients below shape it. */}
      <div aria-hidden className="absolute inset-0 bg-surface-navy/55" />

      {/* Weighted to the left, where the copy sits, and easing off over the
          group on the right so the members stay clearly visible. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(100deg,rgba(6,20,47,0.94)_0%,rgba(6,20,47,0.82)_28%,rgba(6,20,47,0.62)_54%,rgba(6,20,47,0.24)_78%,rgba(6,20,47,0.05)_100%)]"
      />

      {/* Below lg the copy spans most of the width, past the point where the
          gradient above has thinned out. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-surface-navy/35 lg:hidden"
      />

      {/* Band behind the overlaid navigation. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-surface-navy/85 via-surface-navy/25 to-transparent"
      />

      {/* Fine diagonal hatch — barely visible, but it keeps the flat scrim from
          reading as a dead grey wash on large displays. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay bg-[repeating-linear-gradient(135deg,#ffffff_0px,#ffffff_1px,transparent_1px,transparent_7px)]"
      />

      {/* Cool highlight drifting over the right side of the frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/4 h-96 w-96 animate-float-slower rounded-full bg-leo-cyan/20 blur-[110px]"
      />

      {/* The About section overlaps the hero with a rounded top edge; this fade
          keeps the seam soft instead of a hard photo-to-white cut. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-surface-navy via-surface-navy/45 to-transparent"
      />
    </>
  );
}
