import Image from "next/image";
import { getSiteImage } from "@/app/lib/api";

/**
 * Hero backdrop. Uses whatever an administrator placed in the HERO slot
 * (Admin → Website images) and falls back to the checked-in Charter Night
 * cover photo when none is set, so the hero is never blank.
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
        className="animate-hero-zoom object-cover object-[center_30%] sm:object-[center_22%] lg:object-[center_18%]"
      />
      {/* Left-to-right scrim: strong navy behind the copy, easing off so members are clearly visible on the right. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,20,47,0.96)_0%,rgba(10,31,68,0.82)_40%,rgba(18,53,102,0.35)_70%,rgba(18,53,102,0.08)_100%)]"
      />
      {/* Below sm, the copy column spans most of the width, so the gradient's lighter
          right side sits behind text — add a flat tint so it stays readable there too. */}
      <div aria-hidden className="absolute inset-0 bg-surface-navy/55 sm:hidden" />
      {/* Gentle bottom fade so the curved section below reads cleanly against the photo. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-surface-navy/50 to-transparent"
      />
    </>
  );
}
