import Image from "next/image";
import { ButtonLink } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { whoWeAreParagraphs } from "@/app/lib/site";
import {
  StatsGrid,
  type ClubCounts,
  type ClubStats,
} from "@/app/components/home/stats-grid";

/**
 * The club's own description, edited from the Django admin
 * (ClubInformation.full_description, falling back to short_description).
 */
export type ClubAbout = {
  full_description?: string | null;
  short_description?: string | null;
};

/** The collage. One portrait anchor plus two smaller supporting frames. */
const collage = [
  {
    src: "/images/about/members-uniform.jpg",
    alt: "Leo Club of Chautari Pokhara members in club uniform",
    className: "absolute inset-y-0 left-0 w-[64%] rounded-[22px]",
    sizes: "(max-width: 1024px) 60vw, 27vw",
  },
  {
    src: "/images/about/community-service.jpg",
    alt: "Club members carrying out a community service activity",
    className: "absolute right-0 top-[6%] h-[40%] w-[46%] rounded-[18px]",
    sizes: "(max-width: 1024px) 40vw, 18vw",
  },
  {
    src: "/images/about/youth-camp.jpg",
    alt: "Leos gathered at a district youth camp",
    className: "absolute bottom-[6%] right-0 h-[44%] w-[52%] rounded-[18px]",
    sizes: "(max-width: 1024px) 45vw, 20vw",
  },
];

export function AboutSection({
  clubStats,
  club,
  counts,
}: {
  clubStats?: ClubStats | null;
  club?: ClubAbout | null;
  counts?: ClubCounts;
}) {
  const paragraphs = whoWeAreParagraphs(
    club?.full_description || club?.short_description,
  );

  return (
    <section className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-background pb-20 pt-20 sm:-mt-14 sm:rounded-t-[3rem] sm:pb-24 sm:pt-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Media ------------------------------------------------------- */}
          <Reveal
            direction="right"
            className="relative mx-auto w-full max-w-[420px] lg:col-span-5 lg:mx-0 lg:max-w-none"
          >
            {/* Soft accent glow, purely decorative. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-leo-blue/15 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-10 right-0 h-44 w-44 rounded-full bg-leo-indigo/20 blur-3xl"
            />

            <div className="relative aspect-4/5 w-full sm:aspect-[5/4] lg:aspect-4/5">
              {collage.map((frame) => (
                <div
                  key={frame.src}
                  className={`${frame.className} group overflow-hidden shadow-soft-md ring-4 ring-background transition-[translate,scale,box-shadow] duration-[var(--duration-slow)] ease-[var(--ease-premium)] hover:z-10 hover:scale-[1.03] hover:shadow-soft-lg`}
                >
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    fill
                    sizes={frame.sizes}
                    className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </Reveal>

          {/* Copy -------------------------------------------------------- */}
          <Reveal className="lg:col-span-7">
            <SectionLabel>Who we are</SectionLabel>
            <h2 className="mt-3 text-[clamp(2.25rem,4vw,3.5rem)] font-bold leading-[1.02] tracking-tight text-balance">
              Empowering youth, building leaders
            </h2>

            {/* Short accent rule to anchor the heading to the copy. */}
            <div
              aria-hidden
              className="mt-5 h-1 w-14 rounded-full bg-linear-to-r from-leo-blue to-leo-indigo"
            />

            <div className="mt-6 max-w-[60ch] space-y-4">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className={
                    i === 0
                      ? "text-lg leading-relaxed text-foreground/90"
                      : "text-base leading-relaxed text-muted"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-7">
              <ButtonLink href="/about" variant="primary" size="md" withArrow>
                Discover Our Story
              </ButtonLink>
            </div>

            {/* Headline figures sit with the copy rather than in a full-width
                band: the number of tiles varies with how much content exists,
                and a sparse full-width row reads as unfinished. */}
            <div className="mt-9 border-t border-border pt-8">
              <StatsGrid clubStats={clubStats} counts={counts} />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
