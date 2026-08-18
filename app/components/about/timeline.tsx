import Image from "next/image";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";
import { milestones, site } from "@/app/lib/site";

const timelinePhotos = [
  "/images/gallery/leo-gathering.jpg",
  "/images/about/youth-camp.jpg",
  "/images/gallery/club-activities.jpg",
];

export function Timeline() {
  return (
    <section id="story" className="bg-background py-16 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <SectionLabel>Our Story</SectionLabel>
            <h2 className="mt-3 text-h2 font-bold tracking-tight text-balance">
              More Than Two Decades of Service
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              From a small beginning in {site.established} to the impact we create
              today, our journey is built on passion, teamwork, and the desire to
              serve Pokhara.
            </p>
          </Reveal>

          <div className="relative">
            <span
              aria-hidden
              className="absolute left-[16.5%] right-[16.5%] top-12 hidden h-px bg-border sm:block sm:top-14"
            />
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              {milestones.map((milestone, i) => (
                <Reveal key={milestone.year} delay={stagger(i)} className="text-center">
                  <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full shadow-soft-md sm:h-28 sm:w-28">
                    <Image
                      src={timelinePhotos[i]}
                      alt={milestone.title}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <span className="relative z-10 -mt-3.5 mb-3 inline-flex h-8 min-w-8 items-center justify-center whitespace-nowrap rounded-full border-4 border-background bg-leo-blue px-1.5 text-[10px] font-bold text-white sm:h-9 sm:min-w-9">
                    {milestone.year}
                  </span>
                  <p className="text-sm font-semibold">{milestone.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {milestone.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
