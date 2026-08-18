import Image from "next/image";
import Link from "next/link";
import { Motif } from "@/app/components/ui/motif";
import { mediaUrl } from "@/app/lib/api";

/** Mirrors `ArticleListSerializer` on the backend. */
export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  published_at?: string | null;
  featured_image?: string | null;
  /** The API nests the category object; `null` when uncategorised. */
  category?: { id: number; name: string; slug: string } | null;
  byline?: string | null;
  reading_time_minutes?: number | null;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function published(article: Article): Date | null {
  if (!article.published_at) return null;
  const parsed = new Date(article.published_at);
  return Number.isNaN(parsed.valueOf()) ? null : parsed;
}

/**
 * The line every newsroom carries under a headline: section, date, length.
 *
 * `reading_time_minutes` and `byline` are computed by the backend and were
 * simply never rendered — showing them is what makes a list of links read as
 * an actual publication.
 */
function Meta({
  article,
  tone = "default",
}: {
  article: Article;
  tone?: "default" | "invert";
}) {
  const date = published(article);
  const muted = tone === "invert" ? "text-white/70" : "text-muted";
  const accent = tone === "invert" ? "text-leo-cyan" : "text-leo-blue";

  const bits = [
    date ? dateFormat.format(date) : null,
    article.reading_time_minutes
      ? `${article.reading_time_minutes} min read`
      : null,
    article.byline || null,
  ].filter(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
      {article.category && (
        <span className={accent}>{article.category.name}</span>
      )}
      {bits.map((bit, i) => (
        <span key={`${bit}-${i}`} className={`flex items-center gap-3 ${muted}`}>
          {(article.category || i > 0) && (
            <span aria-hidden className="h-3 w-px bg-current opacity-30" />
          )}
          {bit}
        </span>
      ))}
    </div>
  );
}

/**
 * Article card.
 *
 *  - `lead`     the top story: oversized, image beside the text
 *  - `default`  the grid card
 *  - `compact`  a text-only row for dense lists
 */
export function ArticleCard({
  article,
  variant = "default",
}: {
  article: Article;
  variant?: "lead" | "default" | "compact";
}) {
  const image = mediaUrl(article.featured_image);
  const href = `/news/${article.slug}`;

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className="group flex gap-4 border-b border-border py-4 last:border-0"
      >
        <div className="min-w-0 flex-1">
          <Meta article={article} />
          <h3 className="mt-1.5 text-[0.9375rem] font-semibold leading-snug transition-colors duration-[var(--duration-fast)] group-hover:text-leo-blue">
            {article.title}
          </h3>
        </div>
        {image && (
          <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-surface">
            <Image src={image} alt="" fill sizes="80px" className="object-cover" />
          </span>
        )}
      </Link>
    );
  }

  if (variant === "lead") {
    return (
      <Link href={href} className="group grid gap-7 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-surface">
          {image ? (
            <Image
              src={image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-[1.03]"
            />
          ) : (
            <Motif variant="grid" tone="blue" />
          )}
        </div>

        <div>
          <Meta article={article} />
          <h2 className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.08] tracking-tight text-balance transition-colors duration-[var(--duration-fast)] group-hover:text-leo-blue">
            {article.title}
          </h2>
          {(article.excerpt || article.content) && (
            <p className="mt-4 line-clamp-3 text-[0.9375rem] leading-relaxed text-muted">
              {article.excerpt ?? article.content}
            </p>
          )}
          <span className="mt-6 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-leo-blue">
            Read the story
            <span
              aria-hidden
              className="h-px w-8 bg-current transition-[width] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:w-12"
            />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group flex h-full flex-col">
      <div className="relative aspect-16/10 overflow-hidden rounded-lg bg-surface">
        {image ? (
          <Image
            src={image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-[1.04]"
          />
        ) : (
          <Motif variant="grid" tone="blue" />
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <Meta article={article} />
        <h3 className="mt-2 text-[1.0625rem] font-bold leading-snug tracking-tight transition-colors duration-[var(--duration-fast)] group-hover:text-leo-blue">
          {article.title}
        </h3>
        {(article.excerpt || article.content) && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {article.excerpt ?? article.content}
          </p>
        )}
        {/* Rule sits at the card foot so a row of cards shares one baseline. */}
        <span
          aria-hidden
          className="mt-auto block h-px w-full origin-left scale-x-0 bg-leo-blue pt-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-x-100"
          style={{ marginTop: "1.25rem" }}
        />
      </div>
    </Link>
  );
}
