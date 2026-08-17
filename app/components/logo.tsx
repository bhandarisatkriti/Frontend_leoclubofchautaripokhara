import Image from "next/image";
import { site } from "@/app/lib/site";

/**
 * The club emblem. Expects the artwork at public/logo.png.
 * The gradient ring stands in for the red/violet arcs while the image loads.
 */
export function Logo({ size = 44 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-leo-red to-leo-violet p-px"
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt={`${site.name} emblem`}
        width={size}
        height={size}
        priority
        className="h-full w-full rounded-full bg-white object-contain"
      />
    </span>
  );
}
