import { Logo } from "@/app/components/logo";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";

const emblem = [
  {
    part: "The Tree",
    meaning: "Represents growth, responsibility, and our connection to the environment.",
    icon: <path d="M12 2 17 9H14L19 16H15V22H9V16H5L10 9H7Z" />,
    tone: "text-leo-blue bg-leo-blue/10",
  },
  {
    part: "The Two Figures",
    meaning: "Nobody serves alone — our strongest impact comes from collaboration.",
    icon: <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />,
    tone: "text-leo-indigo bg-leo-indigo/10",
  },
  {
    part: "The Lion Mark",
    meaning: "Represents our connection to Lions Clubs International and the worldwide Leo movement.",
    icon: null,
    tone: "text-leo-cyan bg-leo-cyan/10",
  },
];

export function EmblemMeaning() {
  return (
    <section className="bg-surface-blue py-16 sm:py-24">
      <Container size="narrow">
        <Reveal className="text-center">
          <SectionLabel>Our Identity</SectionLabel>
          <h2 className="mt-3 text-h2 font-bold tracking-tight">The Meaning Behind Our Emblem</h2>
        </Reveal>

        <div className="relative mt-14">
          <div className="grid gap-6 sm:grid-cols-3">
            {emblem.map((item, i) => (
              <Reveal
                key={item.part}
                delay={stagger(i)}
                className="rounded-2xl border border-border bg-background p-6 pt-8 text-center shadow-soft-sm sm:pt-10"
              >
                <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${item.tone}`}>
                  {item.icon ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      {item.icon}
                    </svg>
                  ) : (
                    <Logo size={26} />
                  )}
                </span>
                <p className="mt-4 text-sm font-semibold">{item.part}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.meaning}</p>
              </Reveal>
            ))}
          </div>

          <span className="pointer-events-none absolute left-1/2 top-0 hidden h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-surface-blue bg-background shadow-soft-lg sm:flex">
            <Logo size={56} />
          </span>
        </div>
      </Container>
    </section>
  );
}
