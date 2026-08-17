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

export default async function NewsPage() {
  const data = await apiFetchOr<Paginated<Article> | Article[]>(
    endpoints.news,
    [],
  );
  const articles = [...(Array.isArray(data) ? data : data.results)].sort((a, b) => {
    const aTime = a.published_at ? new Date(a.published_at).valueOf() : 0;
    const bTime = b.published_at ? new Date(b.published_at).valueOf() : 0;
    return bTime - aTime;
  });

  const [featured, ...rest] = articles;

  return (
    <>
      <Container size="narrow" className="py-16 sm:py-20">
        {articles.length === 0 ? (
          <EmptyState message="Articles will appear here once they are published from the backend." />
        ) : (
          <div className="space-y-6">
            <Reveal>
              <ArticleCard article={featured} featured />
            </Reveal>
            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                {rest.map((article, i) => (
                  <Reveal key={article.id} delay={stagger(i)}>
                    <ArticleCard article={article} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </>
  );
}
