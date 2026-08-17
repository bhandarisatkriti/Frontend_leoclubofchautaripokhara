import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";

const panels = [
  {
    title: "Mission",
    body: "To empower the youth of Pokhara and beyond by developing their leadership skills, fostering a sense of community service, and inspiring them to become compassionate and responsible global citizens.",
    icon: (
      <>
        <path d="M4 15.5V20h4.5L19 9.5 14.5 5 4 15.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m13.2 6.3 4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Vision",
    body: "To create a network of young leaders who are dedicated to making a positive impact in their communities, contributing to a better, more inclusive world where every child has the opportunity to thrive.",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <rect x="9" y="9" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </>
    ),
  },
];

/** "About us" — the club's mission and vision statements. */
export function MissionVisionCards() {
  return (
    <section className="bg-surface-blue py-16 sm:py-20">
      <Container>
        <Reveal className="text-center">
          <h2 className="text-h2 font-bold tracking-tight text-leo-violet">
            About us
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted">
            The {site.name} empowers youth through leadership, service, and
            global connections.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 sm:gap-8">
          {panels.map((panel, i) => (
            <Reveal key={panel.title} delay={stagger(i, 120)}>
              <article className="h-full bg-background p-8 shadow-soft-md sm:p-10">
                <span className="flex h-11 w-11 items-center justify-center text-leo-violet">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                    {panel.icon}
                  </svg>
                </span>
                <h3 className="mt-6 text-lg font-bold tracking-tight">
                  {panel.title}
                </h3>
                <p className="mt-4 leading-relaxed text-muted">{panel.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
