import { Reveal } from "@/app/components/ui/reveal";
import { StatCounter } from "@/app/components/ui/stat-counter";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";

/**
 * Optional headline figures from `/api/club/`. The backend does not expose
 * these yet, so they stay optional and the tiles fall back to counts the API
 * really does return.
 */
export type ClubStats = {
  active_members?: number | null;
  projects_completed?: number | null;
  lives_impacted?: number | null;
};

/** Totals taken from the paginated list endpoints the homepage already loads. */
export type ClubCounts = {
  members?: number | null;
  events?: number | null;
  photos?: number | null;
};

const icons = {
  // Years of service — award/badge
  service: <path d="M12 2 14.7 8 21 8.7 16.3 13l1.3 6.3L12 16.4 6.4 19.3 7.7 13 3 8.7 9.3 8Z" />,
  // Active members — two people
  members: <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 0a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 8 11Zm0 2c-2.7 0-8 1.35-8 4v3h9.5v-3c0-1-.3-1.85-1.5-2.6A11 11 0 0 0 8 13Zm8 0c-.4 0-.85 0-1.35.06A5.6 5.6 0 0 1 16.5 17v3H24v-3c0-2.65-5.3-4-8-4Z" />,
  // Events held — clipboard check
  events: (
    <path d="M9 2h6a1 1 0 0 1 1 1v1h2a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2V3a1 1 0 0 1 1-1Zm0 2v1h6V4H9Zm-.7 9.7 1.4-1.4 1.6 1.6 3.9-3.9 1.4 1.4-5.3 5.3Z" />
  ),
  // Photos shared — camera
  photos: (
    <path d="M9 4h6l1.2 2H20a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3.8L9 4Zm3 4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
  ),
  // Lives impacted — heart
  impact: <path d="M12 21s-7-4.35-9.5-8.5C.7 8.9 2.4 5 6 5c2 0 3.3 1 4 2 .7-1 2-2 4-2 3.6 0 5.3 3.9 3.5 7.5C19 16.65 12 21 12 21Z" />,
} as const;

/**
 * Headline figures for the About section.
 *
 * Only tiles backed by a real number are rendered — a row of "—" placeholders
 * reads as broken, and inventing figures for a real organisation is not an
 * option. Members / events / photos come from the list endpoints' `count`;
 * years of service is derived from the charter year.
 */
export function StatsGrid({
  clubStats,
  counts,
}: {
  clubStats?: ClubStats | null;
  counts?: ClubCounts;
}) {
  const candidates = [
    {
      label: "Years of Service",
      icon: icons.service,
      value: new Date().getFullYear() - site.established,
      suffix: "+",
    },
    {
      label: "Active Members",
      one: "Active Member",
      icon: icons.members,
      value: counts?.members ?? clubStats?.active_members ?? null,
    },
    {
      label: "Events Held",
      one: "Event Held",
      icon: icons.events,
      value: counts?.events ?? clubStats?.projects_completed ?? null,
    },
    {
      label: "Photos Shared",
      one: "Photo Shared",
      icon: icons.photos,
      value: counts?.photos ?? null,
    },
    {
      label: "Lives Impacted",
      icon: icons.impact,
      value: clubStats?.lives_impacted ?? null,
      suffix: "+",
    },
  ];

  const stats = candidates
    .filter((stat): stat is typeof stat & { value: number } =>
      typeof stat.value === "number" && stat.value > 0,
    )
    .slice(0, 4);

  if (!stats.length) return null;

  // Flex-wrap rather than a fixed 4-column grid: the number of tiles depends on
  // how much content exists, and empty grid columns leave an obvious dead gap.
  // Tiles keep a consistent size and simply wrap as more figures appear.
  return (
    <div className="flex flex-wrap gap-3 sm:gap-4">
      {stats.map((stat, i) => (
        <Reveal
          key={stat.label}
          delay={stagger(i)}
          className="group min-w-[9.5rem] flex-1 basis-40 rounded-2xl border border-border bg-surface p-5 shadow-soft-sm transition-[transform,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-leo-blue/30 hover:shadow-soft-md sm:max-w-[15rem]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-leo-blue/10 text-leo-blue transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-110">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              {stat.icon}
            </svg>
          </span>
          <p className="mt-4 text-3xl font-bold leading-none tracking-tight sm:text-4xl">
            <StatCounter end={stat.value} suffix={stat.suffix ?? ""} />
          </p>
          <p className="mt-2 text-sm leading-snug text-muted">
            {stat.value === 1 && "one" in stat && stat.one ? stat.one : stat.label}
          </p>
        </Reveal>
      ))}
    </div>
  );
}
