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
    statement: "Develop young leaders through service and friendship.",
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
    statement: "A generation of confident leaders, built through service.",
  },
];

const toneClasses = {
  blue: {
    badge: "bg-linear-to-br from-leo-blue-dark to-leo-blue text-white shadow-glow-blue",
    bar: "from-leo-blue-dark to-leo-blue",
    border: "hover:border-leo-blue/40",
    label: "text-leo-blue-light",
  },
  cyan: {
    badge: "bg-linear-to-br from-leo-blue to-leo-cyan text-white shadow-[0_18px_45px_-10px_rgba(56,189,248,0.35)]",
    bar: "from-leo-blue to-leo-cyan",
    border: "hover:border-leo-cyan/40",
    label: "text-leo-cyan",
  },
} as const;

export function MissionVision() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#06142F_0%,#0A1F44_100%)] py-16 text-on-navy sm:py-24">
      <Motif variant="grid" tone="navy" className="opacity-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-leo-blue/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-leo-cyan/10 blur-3xl"
      />

      <Container className="relative">
        <Reveal className="text-center">
          <SectionLabel tone="cyan">Our Purpose</SectionLabel>
          <h2 className="mt-3 text-h2 font-bold tracking-tight text-white">
            What We Stand For
          </h2>
        </Reveal>

        <div className="relative mt-12 grid gap-6 sm:grid-cols-2">
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-surface-navy text-xs font-bold text-on-navy-muted sm:flex"
          >
            &amp;
          </span>

          {panels.map((panel, i) => {
            const tone = toneClasses[panel.tone];
            return (
              <Reveal
                key={panel.label}
                delay={i * 150}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-soft-md backdrop-blur-sm transition-[transform,border-color,background-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1.5 hover:bg-white/[0.08] sm:p-10 ${tone.border}`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${tone.bar}`}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 text-white/[0.04] transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-110"
                >
                  <svg width="140" height="140" viewBox="0 0 24 24" fill="currentColor">
                    {panel.icon}
                  </svg>
                </span>

                <span className="absolute right-5 top-4 text-xs font-bold text-white/20">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className={`relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-105 ${tone.badge}`}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {panel.icon}
                  </svg>
                </span>
                <p className={`relative mt-5 text-xs font-bold uppercase tracking-[0.16em] ${tone.label}`}>
                  {panel.label}
                </p>
                <p className="relative mx-auto mt-4 max-w-sm text-xl font-semibold leading-snug text-balance text-white sm:text-2xl">
                  {panel.statement}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
