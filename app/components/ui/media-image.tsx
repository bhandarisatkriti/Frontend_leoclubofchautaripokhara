"use client";

import { useState } from "react";
import Image from "next/image";
import { Motif, type MotifTone, type MotifVariant } from "@/app/components/ui/motif";

/**
 * `next/image` in `fill` mode, with a graceful `Motif` fallback both when
 * there's no image URL at all AND when the URL 404s (e.g. a backend record
 * points at a media file that was never uploaded, or got wiped from disk) —
 * the bare `<Image>` used to just render the browser's broken-image icon in
 * that second case.
 */
export function MediaImage({
  src,
  alt,
  sizes,
  className = "",
  style,
  motifVariant = "dots",
  motifTone = "blue",
  fallback,
  priority,
  onError,
}: {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  className?: string;
  style?: React.CSSProperties;
  motifVariant?: MotifVariant;
  motifTone?: MotifTone;
  /** Overrides the default bare `Motif` fallback, e.g. to also show initials. */
  fallback?: React.ReactNode;
  priority?: boolean;
  /** Notifies the parent when the URL 404s, in case it needs to react too (e.g. gate a "view larger" action) — this component's own fallback rendering is unaffected either way. */
  onError?: () => void;
}) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return fallback ?? <Motif variant={motifVariant} tone={motifTone} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={style}
      onError={() => {
        setBroken(true);
        onError?.();
      }}
    />
  );
}
