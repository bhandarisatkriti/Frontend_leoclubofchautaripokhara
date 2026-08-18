import type { Metadata } from "next";
import { ArticleCard, type Article } from "@/app/components/news/article-card";
import { EmptyState } from "@/app/components/page-header";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { apiFetchOr, endpoints, type Paginated } from "@/app/lib/api";
import { stagger } from "@/app/lib/motion";

export const metadata: Metadata = {
  title: "News",
  description: "Announcements and updates from the club.",
};

/**
 * Article index: a lead story, then the rest as full-width rows.
 *
 * Rows rather than a grid because headlines here are long — a three-column
 * grid wraps most of them to four lines and truncates the excerpt to nothing,
 * whereas a row gives the title room to breathe and still shows enough of the
 * opening to decide on.
 */
export default async function NewsPage() {
  const data = await apiFetchOr<Paginated<Article> | Article[]>(endpoints.news, []);

  const articles = [...(Array.isArray(data) ? data : data.results)].sort((a, b) => {
    const aTime = a.published_at ? new Date(a.published_at).valueOf() : 0;
    const bTime = b.published_at ? new Date(b.published_at).valueOf() : 0;
    return bTime - aTime;
  });

  if (articles.length === 0) {
    return (
      <Container className="py-20 sm:py-24">
        <EmptyState message="Articles will appear here once they are published from the backend." />
      </Container>
    );
  }

  const [lead, ...rest] = articles;

  return (
    <Container className="py-14 sm:py-20">
      <Reveal className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-5">
        <h1 className="font-display text-[clamp(1.625rem,3vw,2.25rem)] font-bold leading-none tracking-tight">
          Newsroom
        </h1>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
          {articles.length} {articles.length === 1 ? "story" : "stories"}
        </p>
      </Reveal>

      {/* Lead story keeps the larger treatment so the page has a clear entry. */}
      <div className="mt-10">
        <Reveal>
          <ArticleCard article={lead} variant="lead" />
        </Reveal>
      </div>

      {rest.length > 0 && (
        <div className="mt-14 border-t border-border pt-10">
          <Reveal>
            <h2 className="section-label text-leo-blue">More stories</h2>
          </Reveal>
          <div className="mt-8 space-y-6">
            {rest.map((article, i) => (
              <Reveal key={article.id} delay={stagger(i, 70)}>
                <ArticleCard article={article} variant="row" />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
