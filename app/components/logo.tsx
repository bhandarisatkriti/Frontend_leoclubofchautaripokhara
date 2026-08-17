import Image from "next/image";
import { site } from "@/app/lib/site";

/** The official club emblem — public/logo.png. */
export function Logo({
  size = 44,
  variant = "default",
  withWordmark = false,
}: {
  size?: number;
  variant?: "default" | "mono-light";
  withWordmark?: boolean;
}) {
  const mono = variant === "mono-light";

  return (
    <span className="inline-flex shrink-0 items-center gap-3">
      <span
        className={`relative inline-flex shrink-0 overflow-hidden rounded-full bg-white shadow-soft-sm ${
          mono ? "ring-1 ring-white/25" : ""
        }`}
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt={`${site.name} emblem`}
          fill
          sizes={`${size}px`}
          className="object-cover"
          priority
        />
      </span>

      {withWordmark && (
        <span
          className={`text-lg font-bold tracking-tight ${mono ? "text-on-navy" : "text-foreground"}`}
        >
          {site.shortName}
        </span>
      )}
    </span>
  );
}
