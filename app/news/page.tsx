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
 * Newsroom layout: one lead story, a "latest" rail beside it, then the archive
 * in a grid.
 *
 * A flat list of identical cards gives every article the same weight, which
 * makes a reader scan rather than read. Splitting by prominence — lead, recent,
 * archive — is what publications do, and it tells the reader where to start.
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
  // The rail only earns its space when there is more than one story to put in
  // it; otherwise the lead runs full width and the grid takes everything else.
  const rail = rest.slice(0, 4);
  const archive = rest.slice(rail.length);

  return (
    <Container className="py-14 sm:py-20">
      {/* Masthead rule, so the page opens like a section front. */}
      <Reveal className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-5">
        <h1 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-none tracking-tight">
          Newsroom
        </h1>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
          {articles.length} {articles.length === 1 ? "story" : "stories"}
        </p>
      </Reveal>

      {/* ------------------------------------------------------ lead ------- */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.65fr_1fr] lg:gap-14">
        <Reveal>
          <ArticleCard article={lead} variant="lead" />
        </Reveal>

        {rail.length > 0 && (
          <Reveal delay={120} className="lg:border-l lg:border-border lg:pl-10">
            <h2 className="section-label text-leo-blue">Latest</h2>
            <div className="mt-4">
              {rail.map((article) => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
          </Reveal>
        )}
      </div>

      {/* --------------------------------------------------- archive ------- */}
      {archive.length > 0 && (
        <section className="mt-16 border-t border-border pt-12 sm:mt-20">
          <Reveal>
            <h2 className="section-label text-leo-blue">More stories</h2>
          </Reveal>
          <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {archive.map((article, i) => (
              <Reveal key={article.id} delay={stagger(i)}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
