import Link from "next/link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";
import { resourceCta, resourceHref, resourceVisual, type Resource } from "@/app/lib/resources";

export function FeaturedResources({ resources }: { resources: Resource[] }) {
  const featured = resources.filter((r) => r.featured);
  if (featured.length === 0) return null;

  const [main, ...rest] = featured;
  const secondary = rest.slice(0, 2);

  return (
    <section className="bg-surface-blue py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionLabel>Featured</SectionLabel>
          <h2 className="mt-2 text-h2 font-bold tracking-tight">Featured Resources</h2>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <MainFeaturedCard resource={main} />
          </Reveal>
          {secondary.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {secondary.map((resource, i) => (
                <Reveal key={resource.id} delay={stagger(i)}>
                  <SecondaryFeaturedCard resource={resource} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function MainFeaturedCard({ resource }: { resource: Resource }) {
  const cta = resourceCta(resource);
  const href = resourceHref(resource);
  const visual = resourceVisual(resource);

  return (
    <Anchor
      href={href}
      external={cta?.external ?? false}
      className="group relative flex h-full min-h-[280px] flex-col justify-end overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#06142F_0%,#123566_100%)] p-8 text-white shadow-soft-lg"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-leo-blue/20 blur-3xl transition-opacity duration-300 group-hover:opacity-80"
      />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-leo-blue-light">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          {visual.path}
        </svg>
      </span>
      {resource.category && (
        <p className="relative mt-6 text-xs font-bold uppercase tracking-widest text-leo-cyan">
          {resource.category}
        </p>
      )}
      <h3 className="relative mt-2 text-2xl font-bold tracking-tight">{resource.title}</h3>
      {resource.description && (
        <p className="relative mt-2 max-w-md text-sm leading-relaxed text-on-navy-muted">
          {resource.description}
        </p>
      )}
      {cta && (
        <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
          {cta.label}
          <span
            aria-hidden
            className="inline-block transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      )}
    </Anchor>
  );
}

function SecondaryFeaturedCard({ resource }: { resource: Resource }) {
  const cta = resourceCta(resource);
  const href = resourceHref(resource);
  const visual = resourceVisual(resource);

  return (
    <Anchor
      href={href}
      external={cta?.external ?? false}
      className="group flex items-start gap-4 rounded-2xl border border-border bg-background p-5 shadow-soft-sm transition-[transform,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-leo-blue/30 hover:shadow-soft-md"
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${visual.className}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          {visual.path}
        </svg>
      </span>
      <div className="min-w-0">
        {resource.category && (
          <p className="text-[11px] font-bold uppercase tracking-widest text-leo-blue">
            {resource.category}
          </p>
        )}
        <h3 className="mt-1 font-bold text-leo-charcoal">{resource.title}</h3>
        {cta && (
          <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-leo-blue">
            {cta.label}
            <span
              aria-hidden
              className="inline-block transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        )}
      </div>
    </Anchor>
  );
}

function Anchor({
  href,
  external,
  className,
  children,
}: {
  href: string | null;
  external: boolean;
  className: string;
  children: React.ReactNode;
}) {
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return <div className={className}>{children}</div>;
}
