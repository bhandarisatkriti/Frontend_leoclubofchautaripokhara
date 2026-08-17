import { Reveal } from "@/app/components/ui/reveal";
import { StatCounter } from "@/app/components/ui/stat-counter";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";

export type ClubStats = {
  active_members?: number | null;
  projects_completed?: number | null;
  lives_impacted?: number | null;
};

const icons = {
  // Years of service — award/badge
  service: <path d="M12 2 14.7 8 21 8.7 16.3 13l1.3 6.3L12 16.4 6.4 19.3 7.7 13 3 8.7 9.3 8Z" />,
  // Active members — two people
  members: <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 0a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 8 11Zm0 2c-2.7 0-8 1.35-8 4v3h9.5v-3c0-1-.3-1.85-1.5-2.6A11 11 0 0 0 8 13Zm8 0c-.4 0-.85 0-1.35.06A5.6 5.6 0 0 1 16.5 17v3H24v-3c0-2.65-5.3-4-8-4Z" />,
  // Projects completed — clipboard check
  projects: (
    <path d="M9 2h6a1 1 0 0 1 1 1v1h2a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2V3a1 1 0 0 1 1-1Zm0 2v1h6V4H9Zm-.7 9.7 1.4-1.4 1.6 1.6 3.9-3.9 1.4 1.4-5.3 5.3Z" />
  ),
  // Lives impacted — heart
  impact: <path d="M12 21s-7-4.35-9.5-8.5C.7 8.9 2.4 5 6 5c2 0 3.3 1 4 2 .7-1 2-2 4-2 3.6 0 5.3 3.9 3.5 7.5C19 16.65 12 21 12 21Z" />,
} as const;

export function StatsGrid({ clubStats }: { clubStats: ClubStats | null }) {
  const stats = [
    {
      label: "Years of Service",
      icon: icons.service,
      value: new Date().getFullYear() - site.established,
      suffix: "+",
    },
    { label: "Active Members", icon: icons.members, value: clubStats?.active_members ?? null },
    { label: "Projects Completed", icon: icons.projects, value: clubStats?.projects_completed ?? null },
    { label: "Lives Impacted", icon: icons.impact, value: clubStats?.lives_impacted ?? null, suffix: "+" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, i) => (
        <Reveal
          key={stat.label}
          delay={stagger(i)}
          className="rounded-[20px] border border-border bg-surface p-4 shadow-soft-sm transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:shadow-soft-md"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-leo-blue/10 text-leo-blue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              {stat.icon}
            </svg>
          </span>
          <p className="mt-2.5 text-xl font-bold tracking-tight">
            {stat.value !== null ? (
              <StatCounter end={stat.value} suffix={stat.suffix ?? ""} />
            ) : (
              <span className="text-muted" aria-label="Data coming soon">
                —
              </span>
            )}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-muted">{stat.label}</p>
        </Reveal>
      ))}
    </div>
  );
}
