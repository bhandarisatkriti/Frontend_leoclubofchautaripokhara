import Link from "next/link";
import { AboutSection, type ClubAbout } from "@/app/components/home/about-section";
import { CreedBand } from "@/app/components/home/creed-band";
import { Hero } from "@/app/components/home/hero";
import { ImpactBand } from "@/app/components/home/impact-band";
import { OurWork, type WorkPhoto } from "@/app/components/home/our-work";
import { TeamPreview } from "@/app/components/home/team-preview";
import { WelcomeMessage } from "@/app/components/home/welcome-message";
import { MissionVisionCards } from "@/app/components/home/mission-vision-cards";
import { SectionHeading } from "@/app/components/home/section-heading";
import { WhyJoinSection } from "@/app/components/home/why-join-section";
import { type ClubStats } from "@/app/components/home/stats-grid";
import { ArticleCard, type Article } from "@/app/components/news/article-card";
import { type Member } from "@/app/components/team/team-card";
import { EmptyState } from "@/app/components/page-header";
import {
  CompactEventItem,
  FeaturedEventCard,
} from "@/app/components/events/events-spotlight";
import { type LeoEvent } from "@/app/components/events/event-card";
import { JoinNowPopup } from "@/app/components/join-now-popup";
import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { apiFetchOr, endpoints, mediaUrl, type Paginated } from "@/app/lib/api";
import { joinPopupConfig } from "@/app/lib/join-popup";
import { joinQrSvg } from "@/app/lib/join-qr";
import { stagger } from "@/app/lib/motion";
import type { ClubInformation } from "@/app/lib/types";

/** Only the totals are read from these, so the row shapes are irrelevant. */
type CountedRow = { id: number };

/** The gallery rows the "Our work" strip renders. */
type GalleryRow = { id: number; title?: string | null; image: string | null };

/**
 * Homepage, ordered as one narrative rather than a stack of components:
 *
 *   hero (who we are) → about → impact (what we do) → events (what is
 *   happening) → news → join
 *
 * Every band runs through `Container`, so the content column is identical the
 * whole way down, and the grounds alternate light / tinted / navy so each step
 * reads as its own chapter. Section headings all go through `SectionHeading`
 * for the same reason: the page previously arranged each one differently,
 * which is most of why it felt like unrelated blocks.
 */
export default async function Home() {
  const [eventsData, teamData, photosData, newsData, club] = await Promise.all([
    apiFetchOr<Paginated<LeoEvent> | LeoEvent[]>(endpoints.events, []),
    apiFetchOr<Paginated<Member> | Member[]>(endpoints.team, []),
    apiFetchOr<Paginated<GalleryRow> | GalleryRow[]>(endpoints.gallery, []),
    apiFetchOr<Paginated<Article> | Article[]>(endpoints.news, []),
    apiFetchOr<(ClubInformation & ClubStats & ClubAbout) | null>(endpoints.club, null),
  ]);

  // The pagination envelope carries the full total, which the stat tiles need;
  // a bare array (unpaginated endpoint) falls back to its own length.
  const totalOf = <T,>(data: Paginated<T> | T[]) =>
    Array.isArray(data) ? data.length : data.count;

  const counts = {
    members: totalOf(teamData),
    events: totalOf(eventsData),
    photos: totalOf(photosData),
  };

  const rowsOf = <T,>(data: Paginated<T> | T[]) =>
    Array.isArray(data) ? data : data.results;

  // Four photographs fill the strip's row exactly at every breakpoint.
  const workPhotos: WorkPhoto[] = rowsOf(photosData)
    .filter((photo) => photo.image)
    .slice(0, 4)
    .map((photo) => ({
      id: photo.id,
      src: mediaUrl(photo.image)!,
      title: photo.title ?? null,
    }));

  // Three fills the teaser row; the rest are a click away on /team.
  const team = rowsOf(teamData).slice(0, 3);

  const events = [...(Array.isArray(eventsData) ? eventsData : eventsData.results)].sort(
    (a, b) => new Date(a.event_date).valueOf() - new Date(b.event_date).valueOf(),
  );
  const news = [...(Array.isArray(newsData) ? newsData : newsData.results)]
    .sort((a, b) => {
      const aTime = a.published_at ? new Date(a.published_at).valueOf() : 0;
      const bTime = b.published_at ? new Date(b.published_at).valueOf() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  const [featuredEvent, ...secondaryEvents] = events;
  const compactEvents = secondaryEvents.slice(0, 2);

  // Encoded on the server so the QR library never reaches the browser.
  const qrSvg = await joinQrSvg();

  return (
    <>
      {/* Membership conversion popup — homepage only. See app/lib/join-popup.ts. */}
      <JoinNowPopup config={joinPopupConfig} qrSvg={qrSvg} />

      {/* 02 — WHO ARE WE -------------------------------------------------- */}
      <Hero description={club?.short_description} />
      <CreedBand />

      {/* 03 — OUR IDENTITY ------------------------------------------------ */}
      <AboutSection clubStats={club} club={club} counts={counts} />
      <MissionVisionCards mission={club?.mission} vision={club?.vision} />

      {/* 04 — WHAT WE DO -------------------------------------------------- */}
      <WhyJoinSection />

      {/* 06 — WHAT WE HAVE DONE ------------------------------------------- */}
      <OurWork photos={workPhotos} />
      <ImpactBand />

      {/* 07 — WHO IS BEHIND IT -------------------------------------------- */}
      <WelcomeMessage />
      <TeamPreview team={team} />

      {/* 05 — WHAT IS HAPPENING ------------------------------------------- */}
      <section className="bg-surface-blue py-20 sm:py-24">
        <Container>
          <SectionHeading
            label="What's happening"
            title="Upcoming events"
            description="Service projects, camps and club gatherings that are next on the calendar."
            action={{ href: "/events", label: "View all events" }}
          />

          <div className="mt-12">
            {!featuredEvent ? (
              <EmptyState message="Events will appear here once they are published from the backend." />
            ) : (
              <div
                className={`grid gap-6 ${
                  compactEvents.length > 0 ? "lg:grid-cols-[1.4fr_1fr]" : ""
                }`}
              >
                <Reveal>
                  <FeaturedEventCard event={featuredEvent} />
                </Reveal>
                {compactEvents.length > 0 && (
                  <div className="flex flex-col gap-6">
                    {compactEvents.map((event, i) => (
                      <Reveal key={event.id} delay={stagger(i)}>
                        <CompactEventItem event={event} />
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>


      {/* 08 — WHAT IS NEW ------------------------------------------------- */}
      {news.length > 0 && (
        <section className="bg-background py-20 sm:py-24">
          <Container>
            <SectionHeading
              label="Latest from us"
              title="News and updates"
              description="Project reports and announcements from the club."
              action={{ href: "/news", label: "View all news" }}
            />

            <div
              className={
                news.length >= 3
                  ? "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  : "mt-12 space-y-6"
              }
            >
              {news.map((article, i) => (
                <Reveal key={article.id} delay={stagger(i)}>
                  <ArticleCard
                    article={article}
                    variant={news.length >= 3 ? "default" : "row"}
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 09 — HOW DO I TAKE PART ------------------------------------------ */}
      {/* Deliberately the same navy field as the hero and the creed band, so
          the page closes on the note it opened with. The previous bright
          left-to-right sweep to #1E5EFF read as a different site. */}
      <section className="relative overflow-hidden bg-surface-navy py-20 text-white sm:py-24">
        <Motif variant="grid" tone="navy" className="opacity-25" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-leo-blue/20 blur-3xl"
        />

        <Container className="relative">
          <div className="grid items-end gap-10 lg:grid-cols-[1.3fr_auto]">
            <Reveal>
              {/* Same kicker treatment as the hero: rule, then cyan lettering. */}
              <p className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-leo-cyan">
                <span aria-hidden className="h-px w-10 bg-leo-cyan/70" />
                Membership
              </p>
              <h2 className="mt-6 max-w-xl font-display text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.02em] text-balance">
                Ready to be part of it?
              </h2>
              <p className="mt-5 max-w-lg text-[0.9375rem] leading-[1.85] text-on-navy-muted">
                Membership is open to young people aged 12–30 in and around
                Pokhara. Tell us a little about yourself and the committee will
                be in touch.
              </p>
            </Reveal>

            <Reveal delay={140}>
              <Link
                href="/join"
                className="group relative inline-flex items-center overflow-hidden border border-white/30 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition-colors duration-[var(--duration-base)] hover:border-leo-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-navy"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-leo-blue transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-x-100"
                />
                <span className="relative">Join now</span>
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

    </>
  );
}
