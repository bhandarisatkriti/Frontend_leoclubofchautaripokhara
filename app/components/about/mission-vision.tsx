import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";

const panels = [
  {
    label: "Our Mission",
    tone: "blue" as const,
    icon: (
      <path d="M12 2 2 8.5 12 15l10-6.5L12 2Zm0 10.7L2 6.2v11.6l10 6.2 10-6.2V6.2l-10 6.5Z" />
    ),
    statement:
      "To develop the leadership abilities of young people through community service and international friendship, in the spirit of Lions Clubs International.",
  },
  {
    label: "Our Vision",
    tone: "violet" as const,
    icon: <path d="M12 2 7 10h3l-4 7h4v5h4v-5h4l-4-7h3L12 2Z" />,
    statement:
      "A generation of confident young leaders in Pokhara, empowered through service to build a stronger, more compassionate community.",
  },
];

const toneClasses = {
  blue: "bg-leo-blue/15 text-leo-blue-light",
  violet: "bg-leo-violet/15 text-leo-violet-light",
} as const;

export function MissionVision() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#06142F_0%,#0A1F44_100%)] py-16 text-on-navy sm:py-24">
      <Motif variant="grid" tone="navy" className="opacity-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-leo-blue/10 blur-3xl"
      />

      <Container className="relative">
        <Reveal className="text-center">
          <SectionLabel tone="cyan">Purpose</SectionLabel>
          <h2 className="mt-3 text-h2 font-bold tracking-tight text-white">
            What We Stand For
          </h2>
        </Reveal>

        <div className="relative mt-12 grid gap-10 sm:grid-cols-2 sm:gap-0">
          <span
            aria-hidden
            className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-linear-to-b from-transparent via-white/15 to-transparent sm:block"
          />
          {panels.map((panel, i) => (
            <Reveal key={panel.label} delay={i * 150} className="px-0 text-center sm:px-10">
              <span
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${toneClasses[panel.tone]}`}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  {panel.icon}
                </svg>
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-on-navy-muted">
                {panel.label}
              </p>
              <p className="mx-auto mt-4 max-w-sm text-xl font-semibold leading-snug text-balance text-white sm:text-2xl">
                {panel.statement}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
