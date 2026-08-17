import Link from "next/link";
import { resourceCta, resourceHref, resourceVisual, type Resource } from "@/app/lib/resources";

const cardClass =
  "group flex h-full flex-col rounded-[20px] border border-leo-blue/15 bg-background p-6 shadow-soft-sm transition-[transform,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-leo-blue/40 hover:shadow-glow-blue";

function CtaIcon({ resource, external }: { resource: Resource; external: boolean }) {
  if (resource.file) {
    return (
      <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-[var(--duration-fast)] group-hover:translate-y-0.5">
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    );
  }
  if (external) {
    return (
      <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-[var(--duration-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
        <path d="M7 17 17 7" />
        <path d="M8 7h9v9" />
      </svg>
    );
  }
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
    >
      →
    </span>
  );
}

export function ResourceCard({ resource }: { resource: Resource }) {
  const cta = resourceCta(resource);
  const href = resourceHref(resource);
  const visual = resourceVisual(resource);

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${visual.className}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            {visual.path}
          </svg>
        </span>
        {resource.featured && (
          <span className="rounded-full bg-leo-violet/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-leo-violet">
            Featured
          </span>
        )}
      </div>

      {resource.category && (
        <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-leo-blue">
          {resource.category}
        </p>
      )}
      <h3 className="mt-1.5 text-lg font-bold text-leo-charcoal">{resource.title}</h3>
      {resource.description && (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{resource.description}</p>
      )}

      {cta && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-leo-blue">
          {cta.label}
          <CtaIcon resource={resource} external={cta.external} />
        </span>
      )}
    </>
  );

  if (href && cta?.external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {body}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {body}
      </Link>
    );
  }

  return <div className={cardClass}>{body}</div>;
}
