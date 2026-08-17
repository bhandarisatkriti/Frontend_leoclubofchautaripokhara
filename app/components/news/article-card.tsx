import Image from "next/image";
import Link from "next/link";
import { Motif } from "@/app/components/ui/motif";
import { mediaUrl } from "@/app/lib/api";

export type Article = {
  id: number;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  published_at?: string | null;
  cover_image?: string | null;
  category?: string | null;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  const image = mediaUrl(article.cover_image);
  const published = article.published_at ? new Date(article.published_at) : null;
  const hasPublished = published && !Number.isNaN(published.valueOf());

  return (
    <Link
      href={`/news/${article.id}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-soft-sm transition-[transform,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-leo-blue/30 hover:shadow-soft-md ${
        featured ? "sm:flex-row" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden ${featured ? "aspect-16/9 sm:aspect-auto sm:w-2/5" : "aspect-16/9"}`}
      >
        {image ? (
          <Image
            src={image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-105"
          />
        ) : (
          <Motif variant="grid" tone="blue" />
        )}
        {article.category && (
          <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-leo-blue shadow-soft-sm">
            {article.category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {hasPublished && published && (
          <p className="text-xs font-semibold uppercase tracking-widest text-leo-violet">
            {dateFormat.format(published)}
          </p>
        )}
        <h3
          className={`mt-2 font-semibold transition-colors duration-[var(--duration-fast)] group-hover:text-leo-blue ${featured ? "text-2xl" : "text-lg"}`}
        >
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">
          {article.excerpt ?? article.content}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-leo-blue">
          Read more
          <span
            aria-hidden
            className="inline-block transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
