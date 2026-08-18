import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";

const iconToneClasses = {
  blue: "text-leo-blue-light",
  navy: "text-white",
  cyan: "text-leo-cyan",
} as const;

const benefits = [
  {
    title: "Leadership Development",
    body: "Take on real responsibility — plan, lead, and run service projects from the ground up.",
    icon: <path d="M12 2 2 8.5 12 15l10-6.5L12 2Zm0 10.7L2 6.2v11.6l10 6.2 10-6.2V6.2l-10 6.5Z" />,
    tone: "blue" as const,
  },
  {
    title: "Community Service",
    body: "Hands-on work in health, education, and the environment across Pokhara.",
    icon: <path d="M12 21s-7-4.35-9.5-8.5C.7 8.9 2.4 5 6 5c2 0 3.3 1 4 2 .7-1 2-2 4-2 3.6 0 5.3 3.9 3.5 7.5C19 16.65 12 21 12 21Z" />,
    tone: "navy" as const,
  },
  {
    title: "Skill Development",
    body: "Training sessions and workshops that build practical, transferable skills.",
    icon: <path d="M12 3 2 8l10 5 8-4v6h2V8L12 3Zm-6 9.2V16c0 2 3 4 6 4s6-2 6-4v-2.8l-6 3-6-3Z" />,
    tone: "cyan" as const,
  },
  {
    title: "Networking",
    body: "Connect with Leos and Lions across Nepal and around the world.",
    icon: <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 12c-2.7 0-6 1.4-6 4v4h9v-4c0-1.3-.5-2.4-1.4-3.2A9 9 0 0 0 6 12Zm12 0c-.5 0-1.2.05-2 .2A5 5 0 0 1 18 16v4h6v-4c0-2.6-3.3-4-6-4Z" />,
    tone: "blue" as const,
  },
  {
    title: "Global Opportunities",
    body: "District events, camps, and conventions within LDC 325 J and beyond.",
    icon: <path d="M12 2 2 8.5 12 15l10-6.5L12 2Zm0 10.7L2 6.2v11.6l10 6.2 10-6.2V6.2l-10 6.5Z" />,
    tone: "navy" as const,
  },
  {
    title: "Personal Growth",
    body: "Build confidence and character through service alongside people who care.",
    icon: <path d="M12 2 7 10h3l-4 7h4v5h4v-5h4l-4-7h3L12 2Z" />,
    tone: "cyan" as const,
  },
];

export function WhyJoinSection() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#06142F_0%,#0A1F44_100%)] px-6 py-12 text-on-navy sm:px-10 sm:py-14">
          <Motif variant="grid" tone="navy" className="opacity-30" />

          <div className="relative">
            <Reveal className="max-w-2xl">
              <SectionLabel tone="cyan">Our impact</SectionLabel>
              <h2 className="mt-3 text-h2 font-bold tracking-tight text-balance">
                What being a Leo means in practice
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {benefits.map((benefit, i) => (
                <Reveal
                  key={benefit.title}
                  delay={stagger(i)}
                  className="group relative px-4 xl:border-r xl:border-white/10 xl:last:border-r-0"
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-[translate,background-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:-translate-y-1 group-hover:bg-white/20 ${iconToneClasses[benefit.tone]}`}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      {benefit.icon}
                    </svg>
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-on-navy-muted">{benefit.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
