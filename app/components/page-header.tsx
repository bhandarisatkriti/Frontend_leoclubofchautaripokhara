import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";

export function PageHeader({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 text-leo-blue opacity-[0.06]"
      >
        <Motif variant="rings" tone="blue" className="rounded-full" />
      </div>
      <Container className="relative py-14 sm:py-20">
        <Reveal>
          <SectionLabel>{kicker}</SectionLabel>
          <h1 className="mt-4 text-h1 max-w-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-4 max-w-2xl text-lead text-muted">{description}</p>
          )}
          <div className="mt-6 h-1 w-14 rounded-full bg-linear-to-r from-leo-blue-dark to-leo-blue" />
        </Reveal>
      </Container>
    </section>
  );
}

/** Shown where backend content will appear once the API is wired up. */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted">
      <div className="absolute inset-0 opacity-40">
        <Motif variant="dots" tone="blue" />
      </div>
      <p className="relative">{message}</p>
    </div>
  );
}
