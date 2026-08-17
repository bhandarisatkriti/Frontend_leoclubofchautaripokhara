import Image from "next/image";
import { ButtonLink } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { site } from "@/app/lib/site";
import { StatsGrid, type ClubStats } from "@/app/components/home/stats-grid";

export function AboutSection({ clubStats }: { clubStats: ClubStats | null }) {
  return (
    <section className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-background pb-10 pt-10 sm:-mt-14 sm:rounded-t-[3rem] sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1fr_0.95fr] lg:items-center">
          <Reveal direction="right" className="relative mx-auto h-[260px] w-full max-w-xs sm:h-[300px]">
            <div className="absolute left-0 top-0 h-full w-[68%] overflow-hidden rounded-2xl shadow-soft-md">
              <Image
                src="/images/about/members-uniform.jpg"
                alt="Leo Club of Chautari Pokhara members"
                fill
                sizes="(max-width: 1024px) 45vw, 22vw"
                className="object-cover"
              />
            </div>
            <div className="absolute right-1 top-1 h-[42%] w-[46%] overflow-hidden rounded-xl border-2 border-background shadow-soft-md">
              <Image
                src="/images/about/community-service.jpg"
                alt="Club members carrying out a community service activity"
                fill
                sizes="(max-width: 1024px) 22vw, 12vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-0 h-[46%] w-[52%] overflow-hidden rounded-xl border-2 border-background shadow-soft-md">
              <Image
                src="/images/about/youth-camp.jpg"
                alt="Leos at a youth camp"
                fill
                sizes="(max-width: 1024px) 26vw, 14vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal>
            <SectionLabel>Who We Are</SectionLabel>
            <h2 className="mt-2.5 text-[clamp(2rem,3vw,3rem)] font-bold leading-[1.05] tracking-tight text-balance">
              Empowering Youth,{" "}
              <span className="text-leo-blue">Building Leaders</span>
            </h2>
            <p className="mt-3 max-w-[460px] text-base leading-relaxed text-muted">
              {site.name} is a youth-led service club operating under{" "}
              {site.district}. Chartered in {site.established}, we bring
              together young people who want to give their time to the place
              they come from — through service projects in health, education,
              and the environment.
            </p>
            <div className="mt-5">
              <ButtonLink href="/about" variant="primary" size="sm" withArrow>
                Discover Our Story
              </ButtonLink>
            </div>
          </Reveal>

          <StatsGrid clubStats={clubStats} />
        </div>
      </Container>
    </section>
  );
}
