import type { Metadata } from "next";
import Image from "next/image";
import { EmptyState, PageHeader } from "@/app/components/page-header";
import { endpoints, fetchList, mediaUrl } from "@/app/lib/api";
import type { Article, ArticleCategory } from "@/app/lib/types";

export const metadata: Metadata = {
  title: "News",
  description: "Announcements and updates from the club.",
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** `?category=<slug>` filters the list; the backend does the filtering. */
type SearchParams = Promise<{ category?: string }>;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category } = await searchParams;

  // The API returns only live articles (published, and past their publish
  // time), newest first.
  const [articles, categories] = await Promise.all([
    fetchList<Article>(endpoints.articles, { category, page_size: 20 }),
    fetchList<ArticleCategory>(endpoints.articleCategories),
  ]);

  const active = categories.find((item) => item.slug === category);
  const visibleCategories = categories.filter((item) => item.article_count > 0);

  return (
    <>
      <PageHeader
        title="News"
        description="Announcements, project reports, and updates from the club."
      />

      <div className="mx-auto max-w-3xl px-4 py-16">
        {visibleCategories.length > 0 && (
          <nav className="mb-10 flex flex-wrap gap-2" aria-label="Filter by category">
            <FilterLink href="/news" label="All" active={!active} />
            {visibleCategories.map((item) => (
              <FilterLink
                key={item.id}
                href={`/news?category=${item.slug}`}
                label={`${item.name} (${item.article_count})`}
                active={active?.slug === item.slug}
              />
            ))}
          </nav>
        )}

        {articles.length === 0 ? (
          <EmptyState
            message={
              category
                ? "No articles in this category yet."
                : "Articles will appear here once they are published from the backend."
            }
          />
        ) : (
          <ul className="space-y-8">
            {articles.map((article) => {
              const published = new Date(article.published_at);
              const image = mediaUrl(article.featured_image);
              return (
                <li
                  key={article.id}
                  className="border-b border-border pb-8 last:border-0"
                >
                  {image && (
                    <div className="relative mb-4 aspect-16/9 overflow-hidden rounded-xl border border-border">
                      <Image
                        src={image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 768px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-xs font-semibold uppercase tracking-widest text-leo-violet">
                    {!Number.isNaN(published.valueOf()) && dateFormat.format(published)}
                    {article.category && ` · ${article.category.name}`}
                    {article.reading_time_minutes > 0 &&
                      ` · ${article.reading_time_minutes} min read`}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">{article.title}</h2>
                  {article.excerpt && (
                    <p className="mt-2 text-muted">{article.excerpt}</p>
                  )}
                  {article.byline && (
                    <p className="mt-3 text-sm text-muted">By {article.byline}</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "rounded-full bg-leo-red px-4 py-1.5 text-sm font-semibold text-white"
          : "rounded-full border border-border px-4 py-1.5 text-sm text-muted hover:border-leo-violet hover:text-leo-violet"
      }
    >
      {label}
    </a>
  );
}
