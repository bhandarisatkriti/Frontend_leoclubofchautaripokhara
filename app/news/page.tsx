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
 * Article index: one uniform row per story on a tinted ground.
 *
 * An earlier version gave the newest story an oversized lead treatment. With
 * every other story in a different, smaller format the page read as two
 * unrelated halves — and a featured image that happened to be a crest rather
 * than a photograph dominated the screen. Identical rows scan far better and
 * stay predictable however many stories exist.
 */
export default async function NewsPage() {
  const data = await apiFetchOr<Paginated<Article> | Article[]>(endpoints.news, []);

  const articles = [...(Array.isArray(data) ? data : data.results)].sort((a, b) => {
    const aTime = a.published_at ? new Date(a.published_at).valueOf() : 0;
    const bTime = b.published_at ? new Date(b.published_at).valueOf() : 0;
    return bTime - aTime;
  });

  return (
    <section className="bg-surface-blue py-14 sm:py-20">
      <Container>
        <div className="space-y-5 sm:space-y-6">
          {articles.length === 0 ? (
            <EmptyState message="Articles will appear here once they are published from the backend." />
          ) : (
            articles.map((article, i) => (
              <Reveal key={article.id} delay={stagger(i, 70)}>
                <ArticleCard article={article} variant="row" />
              </Reveal>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
