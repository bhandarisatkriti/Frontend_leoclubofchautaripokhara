const toneGradients = {
  red: "from-leo-red/15 to-leo-blue/15",
  indigo: "from-leo-indigo/12 to-leo-blue/18",
  blue: "from-leo-blue/15 to-leo-cyan/15",
  green: "from-leo-green/15 to-leo-blue/15",
  navy: "",
} as const;

const patternTone = {
  red: "text-leo-red",
  indigo: "text-leo-indigo",
  blue: "text-leo-blue",
  green: "text-leo-green",
  navy: "text-white",
} as const;

export type MotifVariant = "dots" | "rings" | "waves" | "grid" | "tree";
export type MotifTone = keyof typeof toneGradients;

/**
 * Abstract gradient-mesh + line-pattern background used everywhere a photo
 * slot has no real backend image yet. Parent must be `relative` — this fills
 * it with `absolute inset-0`, exactly the footprint next/image's `fill` mode
 * would use, so a real photo can drop in later with no layout change.
 */
export function Motif({
  variant = "dots",
  tone = "blue",
  className = "",
}: {
  variant?: MotifVariant;
  tone?: MotifTone;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden ${
        tone === "navy" ? "bg-surface-navy-soft" : `bg-linear-to-br ${toneGradients[tone]}`
      } ${className}`}
    >
      <div className={`absolute inset-0 ${patternTone[tone]} opacity-[0.16]`}>
        <Pattern variant={variant} />
      </div>
    </div>
  );
}

function Pattern({ variant }: { variant: MotifVariant }) {
  switch (variant) {
    case "dots":
      return (
        <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <pattern id="motif-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.6" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#motif-dots)" />
        </svg>
      );
    case "grid":
      return (
        <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <pattern id="motif-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#motif-grid)" />
        </svg>
      );
    case "rings":
      return (
        <svg
          className="absolute -right-10 -top-10 h-[140%] w-[140%]"
          viewBox="0 0 200 200"
          fill="none"
        >
          {[20, 45, 70, 95, 120].map((r) => (
            <circle key={r} cx="140" cy="60" r={r} stroke="currentColor" strokeWidth="1" />
          ))}
        </svg>
      );
    case "waves":
      return (
        <svg className="h-full w-full" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
          {[20, 60, 100, 140, 180].map((y) => (
            <path
              key={y}
              d={`M -20 ${y} Q 75 ${y - 30} 150 ${y} T 320 ${y}`}
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          ))}
        </svg>
      );
    case "tree":
      return (
        <svg
          className="absolute bottom-0 left-1/2 h-[80%] w-[80%] -translate-x-1/2"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M50 8 L68 40 H58 L74 62 H60 L60 92 H40 L40 62 H26 L42 40 H32 Z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return null;
  }
}
