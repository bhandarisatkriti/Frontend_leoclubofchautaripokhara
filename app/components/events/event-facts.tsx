import { Reveal } from "@/app/components/ui/reveal";
import { stagger } from "@/app/lib/motion";

export type Fact = {
  key: string;
  label: string;
  value: string;
  href?: string;
  icon: React.ReactNode;
};

export const factIcons = {
  date: (
    <path d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7ZM5 9h14v10H5V9Z" />
  ),
  time: (
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm1-13h-2v6l5 3 1-1.7-4-2.3V7Z" />
  ),
  location: (
    <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Zm0-8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
  ),
  people: (
    <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 0a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 8 11Zm0 2c-2.7 0-8 1.35-8 4v3h9.5v-3c0-1-.3-1.85-1.5-2.6A11 11 0 0 0 8 13Zm8 0c-.4 0-.85 0-1.35.06A5.6 5.6 0 0 1 16.5 17v3H24v-3c0-2.65-5.3-4-8-4Z" />
  ),
  ticket: (
    <path d="M4 5h16a1 1 0 0 1 1 1v3.5a2.5 2.5 0 0 0 0 5V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3.5a2.5 2.5 0 0 0 0-5V6a1 1 0 0 1 1-1Zm5 3v8h2V8H9Z" />
  ),
  phone: (
    <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.5 3 3 3.4 2.5 4 2.5h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" />
  ),
  email: (
    <path d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1.4 2 6.6 5.5L18.6 6H5.4ZM19 8.2l-6.4 5.3a1 1 0 0 1-1.2 0L5 8.2V18h14V8.2Z" />
  ),
} as const;

/**
 * Everything practical about the event in one scannable block.
 *
 * Laid out as tiles rather than a list because these are read by jumping to the
 * one you want, not by reading top to bottom. Only facts the record actually
 * holds are rendered — a tile reading "Participants: —" is worse than no tile,
 * and inventing a figure for a real club's event is not an option.
 */
export function EventFacts({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {facts.map((fact, i) => {
        const body = (
          <>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leo-blue/10 text-leo-blue transition-[scale] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-110">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                {fact.icon}
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                {fact.label}
              </span>
              <span className="mt-1 block text-sm font-semibold text-foreground">
                {fact.value}
              </span>
            </span>
          </>
        );

        return (
          <Reveal key={fact.key} as="li" delay={stagger(i, 70)} className="list-none">
            {fact.href ? (
              <a
                href={fact.href}
                className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft-sm transition-[translate,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-leo-blue/30 hover:shadow-soft-md"
              >
                {body}
              </a>
            ) : (
              <div className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft-sm">
                {body}
              </div>
            )}
          </Reveal>
        );
      })}
    </ul>
  );
}
