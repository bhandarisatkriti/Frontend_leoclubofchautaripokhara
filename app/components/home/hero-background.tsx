import Image from "next/image";

/** The club's real Charter Night cover photo, with a readable gradient scrim for the hero copy. */
export function HeroBackground() {
  return (
    <>
      <Image
        src="/images/hero/charter-night-cover.jpg"
        alt="Leo Club of Chautari Pokhara members at their 6th Charter Night ceremony"
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
      {/* Gentle bottom fade so the curved section below reads cleanly against the photo. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-surface-navy/50 to-transparent"
      />
    </>
  );
}
