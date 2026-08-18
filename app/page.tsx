import { AboutSection, type ClubAbout } from "@/app/components/home/about-section";
import { CreedBand } from "@/app/components/home/creed-band";
import { Hero } from "@/app/components/home/hero";
import { MissionVisionCards } from "@/app/components/home/mission-vision-cards";
import { SectionHeading } from "@/app/components/home/section-heading";
import { WhyJoinSection } from "@/app/components/home/why-join-section";
import { type ClubStats } from "@/app/components/home/stats-grid";
import { ArticleCard, type Article } from "@/app/components/news/article-card";
import { EmptyState } from "@/app/components/page-header";
import {
  CompactEventItem,
  FeaturedEventCard,
} from "@/app/components/events/events-spotlight";
import { type LeoEvent } from "@/app/components/events/event-card";
import { JoinNowPopup } from "@/app/components/join-now-popup";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { apiFetchOr, endpoints, type Paginated } from "@/app/lib/api";
import { joinPopupConfig } from "@/app/lib/join-popup";
import { joinQrSvg } from "@/app/lib/join-qr";
import { stagger } from "@/app/lib/motion";
import type { ClubInformation } from "@/app/lib/types";

/** Only the totals are read from these, so the row shapes are irrelevant. */
type CountedRow = { id: number };

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
    apiFetchOr<Paginated<CountedRow> | CountedRow[]>(endpoints.team, []),
    apiFetchOr<Paginated<CountedRow> | CountedRow[]>(endpoints.gallery, []),
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
      <MissionVisionCards
        mission={club?.mission}
        vision={club?.vision}
        intro={club?.tagline}
      />

      {/* 04 — WHAT WE DO -------------------------------------------------- */}
      <WhyJoinSection />

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
              <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <Reveal>
                  <FeaturedEventCard event={featuredEvent} />
                </Reveal>
                <div className="flex flex-col gap-6">
                  {compactEvents.map((event, i) => (
                    <Reveal key={event.id} delay={stagger(i)}>
                      <CompactEventItem event={event} />
                    </Reveal>
                  ))}
                </div>
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

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((article, i) => (
                <Reveal key={article.id} delay={stagger(i)}>
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 09 — HOW DO I TAKE PART ------------------------------------------ */}
      <section className="relative overflow-hidden bg-[linear-gradient(105deg,#06142F_0%,#1E3A8A_55%,#1E5EFF_100%)] py-24 text-white sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 animate-float-slow rounded-full bg-white/10 blur-3xl"
        />
        <Container className="relative">
          <Reveal className="max-w-2xl">
            <p className="section-label text-leo-cyan">Membership</p>
            <h2 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.02] tracking-tight text-balance">
              Ready to be part of it?
            </h2>
            <p className="mt-5 max-w-lg text-white/80">
              Membership is open to young people aged 12–30 in and around
              Pokhara. Tell us a little about yourself and the committee will be
              in touch.
            </p>
            <a
              href="/join"
              className="group relative mt-10 inline-flex items-center gap-5 overflow-hidden border border-white/35 py-4 pl-7 pr-5 text-[11px] font-bold uppercase tracking-[0.24em] text-white transition-colors duration-[var(--duration-base)] hover:border-white"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 bg-white/15 transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-x-100"
              />
              <span className="relative">Join now</span>
              <span
                aria-hidden
                className="relative h-px w-8 bg-current transition-[width] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:w-12"
              />
            </a>
          </Reveal>
        </Container>
      </section>

    </>
  );
}
