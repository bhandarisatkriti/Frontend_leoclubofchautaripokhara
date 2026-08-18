import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";

const values = [
  {
    word: "Leadership",
    body: "Taking initiative and guiding real projects.",
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0 1 16 0v1" /></>,
  },
  {
    word: "Experience",
    body: "Learning by doing, one project at a time.",
    icon: <><path d="M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 1-2-2V5Z" /><path d="M20 5a2 2 0 0 0-2-2h-5v18h5a2 2 0 0 0 2-2V5Z" /></>,
  },
  {
    word: "Opportunity",
    body: "Open doors for growth and connection.",
    icon: <path d="m12 2 2.9 6.6L22 9.3l-5 4.9 1.2 7.1L12 17.8 5.8 21.3 7 14.2 2 9.3l7.1-.7L12 2Z" />,
  },
  {
    word: "Service",
    body: "Putting the community's needs first.",
    icon: <path d="M12 21s-7-4.35-9.5-8.5C.7 8.9 2.4 5 6 5c2 0 3.3 1 4 2 .7-1 2-2 4-2 3.6 0 5.3 3.9 3.5 7.5C19 16.65 12 21 12 21Z" />,
  },
  {
    word: "Fellowship",
    body: "Friendship built through shared purpose.",
    icon: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="10" r="2.3" /><path d="M2 21v-1a6 6 0 0 1 12 0v1" /><path d="M14 15.3A5 5 0 0 1 22 20v1" /></>,
  },
  {
    word: "Responsibility",
    body: "Following through on every commitment.",
    icon: <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />,
  },
] as const;

export function CoreValues() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <Container size="narrow">
        <Reveal className="text-center">
          <SectionLabel>Our Values</SectionLabel>
          <h2 className="mt-3 text-h2 font-bold tracking-tight">The Values That Guide Us</h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {values.map((value, i) => (
            <Reveal
              key={value.word}
              delay={stagger(i, 90)}
              className="rounded-xl border border-border bg-surface p-5 shadow-soft-sm transition-[transform,box-shadow] duration-[var(--duration-base)] hover:-translate-y-1 hover:shadow-soft-md"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-leo-blue/10 text-leo-blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {value.icon}
                  </svg>
                </span>
                <span className="text-xs font-bold text-border">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-4 text-base font-bold tracking-tight">{value.word}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{value.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
