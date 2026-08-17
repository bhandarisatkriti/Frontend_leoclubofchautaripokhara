import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";

const toneClasses = {
  blue: "text-leo-blue-light border-leo-blue/40",
  navy: "text-white border-white/30",
  cyan: "text-leo-cyan border-leo-cyan/40",
} as const;

const activities = [
  {
    title: "Community Service",
    body: "Hands-on work in health, education, and the environment across Pokhara.",
    icon: <path d="M12 21s-7-4.35-9.5-8.5C.7 8.9 2.4 5 6 5c2 0 3.3 1 4 2 .7-1 2-2 4-2 3.6 0 5.3 3.9 3.5 7.5C19 16.65 12 21 12 21Z" />,
    tone: "blue" as const,
  },
  {
    title: "Leadership Development",
    body: "Plan, lead, and run real service projects from the ground up.",
    icon: <path d="M12 2 2 8.5 12 15l10-6.5L12 2Zm0 10.7L2 6.2v11.6l10 6.2 10-6.2V6.2l-10 6.5Z" />,
    tone: "navy" as const,
  },
  {
    title: "Education & Youth",
    body: "Scholarships, stationery support, and skill sessions for students in local schools.",
    icon: <path d="M12 3 2 8l10 5 8-4v6h2V8L12 3Zm-6 9.2V16c0 2 3 4 6 4s6-2 6-4v-2.8l-6 3-6-3Z" />,
    tone: "cyan" as const,
  },
  {
    title: "Health & Wellbeing",
    body: "Blood donation drives, health camps, and awareness campaigns across the valley.",
    icon: <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.5 3 3 3.4 2.5 4 2.5h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" />,
    tone: "blue" as const,
  },
  {
    title: "Environment",
    body: "Tree plantation, clean-up campaigns, and conservation work.",
    icon: <path d="M12 2 7 10h3l-4 7h4v5h4v-5h4l-4-7h3L12 2Z" />,
    tone: "navy" as const,
  },
  {
    title: "Networking",
    body: "Connect with Leos and Lions across Nepal and around the world.",
    icon: <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 12c-2.7 0-6 1.4-6 4v4h9v-4c0-1.3-.5-2.4-1.4-3.2A9 9 0 0 0 6 12Zm12 0c-.5 0-1.2.05-2 .2A5 5 0 0 1 18 16v4h6v-4c0-2.6-3.3-4-6-4Z" />,
    tone: "cyan" as const,
  },
];

export function WhatWeDo() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#06142F_0%,#123566_100%)] py-16 text-on-navy sm:py-24">
      <Motif variant="dots" tone="navy" className="opacity-20" />

      <Container className="relative">
        <Reveal className="text-center">
          <SectionLabel tone="cyan">What We Do</SectionLabel>
          <h2 className="mt-3 text-h2 font-bold tracking-tight text-white">
            Where We Put Our Energy
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity, i) => (
            <Reveal
              key={activity.title}
              delay={stagger(i, 90)}
              className={`rounded-xl border-t-2 bg-white/5 p-6 backdrop-blur-sm transition-[transform,background-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:bg-white/10 ${
                i % 3 === 1 ? "sm:translate-y-4" : ""
              } ${toneClasses[activity.tone]}`}
            >
              <span className={toneClasses[activity.tone].split(" ")[0]}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  {activity.icon}
                </svg>
              </span>
              <h3 className="mt-3 font-semibold text-white">{activity.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-on-navy-muted">{activity.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
