import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Article } from "@/app/components/news/article-card";
import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { apiFetchOr, endpoints, mediaUrl } from "@/app/lib/api";
import { site } from "@/app/lib/site";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

async function getArticle(slug: string) {
  return apiFetchOr<Article | null>(`${endpoints.articles}${slug}/`, null, {
    revalidate: false,
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  return article
    ? { title: article.title, description: article.excerpt ?? undefined }
    : { title: "Article" };
}

export default async function NewsDetailPage({
  params,
}: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const image = mediaUrl(article.featured_image);
  const published = article.published_at ? new Date(article.published_at) : null;
  const hasPublished = published && !Number.isNaN(published.valueOf());
  const paragraphs = (article.content ?? article.excerpt ?? "")
    .split(/\n+/)
    .filter(Boolean);

  const shareHref = `mailto:?subject=${encodeURIComponent(article.title)}`;

  return (
    <>
      <div className="relative aspect-21/9 overflow-hidden border-b border-border sm:aspect-3/1">
        {image ? (
          <Image src={image} alt={article.title} fill sizes="100vw" className="object-cover" priority />
        ) : (
          <Motif variant="grid" tone="blue" />
        )}
      </div>

      <Container size="narrow" className="py-16 sm:py-20">
        <Reveal>
          <Link
            href="/news"
            className="text-sm font-semibold text-leo-blue transition-colors duration-[var(--duration-fast)] hover:text-leo-blue-dark"
          >
            ← Back to news
          </Link>

          <div className="mt-6">
            {/* The API nests the category object, so render its name. */}
            {article.category && <SectionLabel>{article.category.name}</SectionLabel>}
            <h1 className="mt-3 text-h1 font-bold tracking-tight">{article.title}</h1>
            {hasPublished && published && (
              <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-muted">
                {dateFormat.format(published)}
              </p>
            )}
          </div>

          <div className="mt-8 space-y-5 text-foreground">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-lead">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-8 text-sm">
            <span className="font-semibold text-muted">Share:</span>
            <a
              href={shareHref}
              className="rounded-full border border-border px-4 py-1.5 font-medium transition-colors duration-[var(--duration-fast)] hover:border-leo-blue hover:text-leo-blue"
            >
              Email
            </a>
            <a
              href={site.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-4 py-1.5 font-medium transition-colors duration-[var(--duration-fast)] hover:border-leo-blue hover:text-leo-blue"
            >
              Facebook
            </a>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
