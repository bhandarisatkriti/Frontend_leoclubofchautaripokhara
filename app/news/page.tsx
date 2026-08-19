import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard, type Article } from "@/app/components/news/article-card";
import { EmptyState } from "@/app/components/page-header";
import { Container } from "@/app/components/ui/container";
import { Pagination } from "@/app/components/ui/pagination";
import { Reveal } from "@/app/components/ui/reveal";
import { apiFetchOr, endpoints, query, type Paginated } from "@/app/lib/api";
import { stagger } from "@/app/lib/motion";

export const metadata: Metadata = {
  title: "News",
  description: "Announcements and updates from the club.",
};

/**
 * Twelve divides by two, three and four, so every breakpoint of the grid below
 * fills its last row rather than leaving one card stranded.
 */
const PAGE_SIZE = 12;

/**
 * Article index: a grid of cards, three or four to a row, paginated.
 *
 * Full-width rows read fine with a handful of stories but turn the page into a
 * long scroll as the archive grows, with one story per screenful. A grid puts
 * a dozen within reach at once, and paging keeps that true however many are
 * published. The backend already sorts by publication date, so page two
 * genuinely continues page one.
 */
export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Math.floor(Number(pageParam)) || 1);

  const data = await apiFetchOr<Paginated<Article> | Article[]>(
    `${endpoints.news}${query({ page, page_size: PAGE_SIZE })}`,
    [],
  );

  const articles = Array.isArray(data) ? data : data.results;
  const total = Array.isArray(data) ? data.length : data.count;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className="bg-surface-blue py-14 sm:py-20">
      <Container size="wide">
        {articles.length === 0 ? (
          /* Past the last page the API 404s and the fallback empties, which
             would otherwise strand a reader on a blank page with no way back. */
          page > 1 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted">
                There are no articles on this page.
              </p>
              <Link
                href="/news"
                className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-leo-blue hover:underline"
              >
                Back to the first page
              </Link>
            </div>
          ) : (
            <EmptyState message="Articles will appear here once they are published from the backend." />
          )
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {articles.map((article, i) => (
                <Reveal key={article.id} delay={stagger(i, 60)} className="h-full">
                  <ArticleCard article={article} variant="card" />
                </Reveal>
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/news"
              className="mt-12"
            />
          </>
        )}
      </Container>
    </section>
  );
}
