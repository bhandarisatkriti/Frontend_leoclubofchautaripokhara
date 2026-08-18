import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";

const panels = [
  {
    label: "Our Mission",
    tone: "blue" as const,
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </>
    ),
    statement:
      "To develop the leadership abilities of young people through community service and international friendship, in the spirit of Lions Clubs International.",
  },
  {
    label: "Our Vision",
    tone: "cyan" as const,
    icon: (
      <>
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    statement:
      "A generation of confident young leaders in Pokhara, empowered through service to build a stronger, more compassionate community.",
  },
];

const toneClasses = {
  blue: "bg-leo-blue/15 text-leo-blue-light",
  cyan: "bg-leo-cyan/15 text-leo-cyan",
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
          <SectionLabel tone="cyan">Our Purpose</SectionLabel>
          <h2 className="mt-3 text-h2 font-bold tracking-tight text-white">
            What We Stand For
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {panels.map((panel, i) => (
            <Reveal
              key={panel.label}
              delay={i * 150}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm sm:p-10"
            >
              <span
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${toneClasses[panel.tone]}`}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
