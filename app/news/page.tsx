import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/app/components/page-header";
import { apiFetchOr, endpoints, type Paginated } from "@/app/lib/api";

export const metadata: Metadata = {
  title: "News",
  description: "Announcements and updates from the club.",
};

type Article = {
  id: number;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  published_at?: string | null;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function NewsPage() {
  const data = await apiFetchOr<Paginated<Article> | Article[]>(
    endpoints.news,
    [],
  );
  const articles = Array.isArray(data) ? data : data.results;

  return (
    <>
      <PageHeader
        title="News"
        description="Announcements, project reports, and updates from the club."
      />

      <div className="mx-auto max-w-3xl px-4 py-16">
        {articles.length === 0 ? (
          <EmptyState message="Articles will appear here once they are published from the backend." />
        ) : (
          <ul className="space-y-8">
            {articles.map((article) => {
              const published = article.published_at
                ? new Date(article.published_at)
                : null;
              return (
                <li
                  key={article.id}
                  className="border-b border-border pb-8 last:border-0"
                >
                  {published && !Number.isNaN(published.valueOf()) && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-leo-violet">
                      {dateFormat.format(published)}
                    </p>
                  )}
                  <h2 className="mt-2 text-xl font-semibold">{article.title}</h2>
                  <p className="mt-2 text-muted">
                    {article.excerpt ?? article.content}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
