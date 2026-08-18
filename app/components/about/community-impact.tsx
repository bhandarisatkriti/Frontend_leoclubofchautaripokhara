import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { StatCounter } from "@/app/components/ui/stat-counter";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";
import { type ClubStats } from "@/app/components/home/stats-grid";

export function CommunityImpact({ clubStats }: { clubStats: ClubStats | null }) {
  const stats = [
    {
      label: "Years of Service",
      value: new Date().getFullYear() - site.established,
      suffix: "+",
      icon: <path d="M7 2v3M17 2v3M3.5 9h17M4 5h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />,
    },
    {
      label: "Active Members",
      value: clubStats?.active_members ?? null,
      icon: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="10" r="2.3" /><path d="M2 21v-1a6 6 0 0 1 12 0v1" /><path d="M14 15.3A5 5 0 0 1 22 20v1" /></>,
    },
    {
      label: "Projects Completed",
      value: clubStats?.projects_completed ?? null,
      icon: <path d="M4 8V6a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />,
    },
    {
      label: "Lives Impacted",
      value: clubStats?.lives_impacted ?? null,
      suffix: "+",
      icon: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></>,
    },
  ];

  return (
    <section className="bg-surface-navy py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14">
          <Reveal>
            <SectionLabel tone="cyan">Our Impact</SectionLabel>
            <h2 className="mt-3 text-h2 font-bold tracking-tight text-white text-balance">
              Service That Reaches Beyond the Club
            </h2>
            <p className="mt-4 max-w-lg text-on-navy-muted">
              Every project we run — big or small — is a chance to make
              Pokhara a little better. Here&apos;s a snapshot of the journey
              so far.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={stagger(i)}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-leo-blue/15 text-leo-blue-light">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {stat.icon}
                  </svg>
                </span>
                <p className="mt-3 text-2xl font-bold tracking-tight text-white">
                  {stat.value !== null ? (
                    <StatCounter end={stat.value} suffix={stat.suffix ?? ""} />
                  ) : (
                    <span className="text-on-navy-muted" aria-label="Data coming soon">
                      —
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs text-on-navy-muted">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
