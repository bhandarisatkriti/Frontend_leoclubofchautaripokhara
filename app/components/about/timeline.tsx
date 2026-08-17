import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { milestones } from "@/app/lib/site";

export function Timeline() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <Container size="narrow">
        <Reveal className="text-center">
          <SectionLabel>Our Story</SectionLabel>
          <h2 className="mt-3 text-h2 font-bold tracking-tight">The Journey So Far</h2>
        </Reveal>

        <div className="relative mt-14">
          <span
            aria-hidden
            className="absolute left-4 top-0 h-full w-px bg-border sm:left-1/2 sm:-translate-x-1/2"
          />

          <div className="space-y-10 sm:space-y-14">
            {milestones.map((milestone, i) => (
              <Reveal
                key={milestone.year}
                direction={i % 2 === 0 ? "right" : "left"}
                className="relative sm:grid sm:grid-cols-2 sm:gap-10"
              >
                <span
                  aria-hidden
                  className="absolute left-4 top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-leo-blue shadow-[0_0_0_5px_rgba(30,94,255,0.15),0_0_20px_rgba(30,94,255,0.6)] sm:left-1/2"
                />

                {i % 2 === 0 ? (
                  <>
                    <div className="pl-12 sm:col-start-1 sm:pl-0 sm:pr-12 sm:text-right">
                      <TimelineCard milestone={milestone} />
                    </div>
                    <div />
                  </>
                ) : (
                  <>
                    <div className="hidden sm:col-start-1 sm:block" />
                    <div className="pl-12 sm:col-start-2 sm:pl-12">
                      <TimelineCard milestone={milestone} />
                    </div>
                  </>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function TimelineCard({
  milestone,
}: {
  milestone: (typeof milestones)[number];
}) {
  return (
    <div className="inline-block rounded-xl border border-border bg-surface p-5 shadow-soft-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-leo-blue">
        {milestone.year}
      </p>
      <h3 className="mt-1.5 font-semibold">{milestone.title}</h3>
      <p className="mt-1.5 text-sm text-muted">{milestone.description}</p>
    </div>
  );
}
