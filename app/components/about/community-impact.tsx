import Image from "next/image";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { StatCounter } from "@/app/components/ui/stat-counter";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";
import { type ClubStats } from "@/app/components/home/stats-grid";

export function CommunityImpact({ clubStats }: { clubStats: ClubStats | null }) {
  const stats = [
    { label: "Years of Service", value: new Date().getFullYear() - site.established, suffix: "+" },
    { label: "Active Members", value: clubStats?.active_members ?? null },
    { label: "Projects Completed", value: clubStats?.projects_completed ?? null },
    { label: "Lives Impacted", value: clubStats?.lives_impacted ?? null, suffix: "+" },
  ];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#06142F_0%,#0A1F44_100%)] py-16 text-on-navy sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <Reveal direction="right" className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-soft-lg">
            <Image
              src="/images/about/community-service.jpg"
              alt="Leo Club members carrying out a community service activity"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(6,20,47,0.55)_100%)]"
            />
          </Reveal>

          <div>
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

            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <Reveal
                  key={stat.label}
                  delay={stagger(i)}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <p className="text-2xl font-bold tracking-tight text-white">
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
        </div>
      </Container>
    </section>
  );
}
