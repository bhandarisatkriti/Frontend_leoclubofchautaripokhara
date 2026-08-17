import { Logo } from "@/app/components/logo";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";

const values = [
  { word: "Leadership", body: "Taking initiative and guiding real projects.", tone: "text-leo-blue" },
  { word: "Experience", body: "Learning by doing, one project at a time.", tone: "text-leo-blue-dark" },
  { word: "Opportunity", body: "Open doors for growth and connection.", tone: "text-leo-blue" },
  { word: "Service", body: "Putting the community's needs first.", tone: "text-leo-blue-dark" },
  { word: "Fellowship", body: "Friendship built through shared purpose.", tone: "text-leo-blue" },
  { word: "Responsibility", body: "Following through on every commitment.", tone: "text-leo-blue-dark" },
] as const;

export function CoreValues() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <Container size="narrow">
        <Reveal className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border shadow-soft-sm">
            <Logo size={40} />
          </span>
          <SectionLabel className="mt-5">Our Values</SectionLabel>
          <h2 className="mt-3 text-h2 font-bold tracking-tight">The Values That Guide Us</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3">
          {values.map((value, i) => (
            <Reveal
              key={value.word}
              delay={stagger(i, 90)}
              className={`px-2 py-6 text-center ${
                i !== values.length - 1 ? "border-b border-border sm:border-b-0" : ""
              } ${i % 3 !== 0 ? "sm:border-l sm:border-border" : ""} ${
                i >= 3 ? "sm:border-t" : ""
              }`}
            >
              <p className={`text-2xl font-bold tracking-tight sm:text-3xl ${value.tone}`}>
                {value.word}
              </p>
              <p className="mx-auto mt-2 max-w-[14rem] text-sm text-muted">{value.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
