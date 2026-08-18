import { AboutSection, type ClubAbout } from "@/app/components/home/about-section";
import { Hero } from "@/app/components/home/hero";
import { JoinNowPopup } from "@/app/components/join-now-popup";
import { joinPopupConfig } from "@/app/lib/join-popup";
import { joinQrSvg } from "@/app/lib/join-qr";
import { MissionVisionCards } from "@/app/components/home/mission-vision-cards";
import { WhyJoinSection } from "@/app/components/home/why-join-section";
import { type ClubStats } from "@/app/components/home/stats-grid";
import { ArticleCard, type Article } from "@/app/components/news/article-card";
import { EmptyState } from "@/app/components/page-header";
import { type Member } from "@/app/components/team/team-card";
import {
  CompactEventItem,
  FeaturedEventCard,
} from "@/app/components/events/events-spotlight";
import { type LeoEvent } from "@/app/components/events/event-card";
import { ButtonLink } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { apiFetchOr, endpoints, type Paginated } from "@/app/lib/api";
import type { ClubInformation } from "@/app/lib/types";
import { stagger } from "@/app/lib/motion";

/** Only the total is used now, so the row shape is irrelevant here. */
type BackendPhoto = { id: number };

export default async function Home() {
  const [eventsData, teamData, photosData, newsData, club] = await Promise.all([
    apiFetchOr<Paginated<LeoEvent> | LeoEvent[]>(endpoints.events, []),
    apiFetchOr<Paginated<Member> | Member[]>(endpoints.team, []),
    apiFetchOr<Paginated<BackendPhoto> | BackendPhoto[]>(endpoints.gallery, []),
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
    .slice(0, 4);

  // Encoded on the server so the QR library never reaches the browser.
  const qrSvg = await joinQrSvg();

  const [featuredEvent, ...secondaryEvents] = events;
  const compactEvents = secondaryEvents.slice(0, 2);

  return (
    <>
      {/* Membership conversion popup — homepage only. See app/lib/join-popup.ts. */}
      <JoinNowPopup config={joinPopupConfig} qrSvg={qrSvg} />

      <Hero heading={club?.name} description={club?.short_description} />
      <AboutSection clubStats={club} club={club} counts={counts} />
      <MissionVisionCards mission={club?.mission} vision={club?.vision} intro={club?.tagline} />
      <WhyJoinSection />

      <section className="bg-surface-blue py-16 sm:py-20">
        <Container>
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Upcoming Activity</SectionLabel>
              <h2 className="mt-3 text-h2 font-bold tracking-tight">Our Next Events</h2>
            </div>
            <ButtonLink href="/events" variant="outline" withArrow>
              View All Events
            </ButtonLink>
          </Reveal>

          <div className="mt-10">
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

      <section className="bg-background py-16 sm:py-20">
        <Container>
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(100deg,#06142F_0%,#1747C7_55%,#38BDF8_100%)] px-6 py-12 text-center text-white sm:px-12 sm:py-14 lg:flex lg:items-center lg:justify-between lg:text-left">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-float-slow rounded-full bg-white/10 blur-3xl"
            />
            <div className="relative lg:max-w-xl">
              <h2 className="text-h2 font-bold tracking-tight text-balance">
                Ready to Make a Difference?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-white/85 lg:mx-0">
                Membership is open to young people aged 12–30 in and around
                Pokhara. Tell us a little about yourself and we will get in
                touch.
              </p>
            </div>
            <div className="relative mt-8 flex justify-center lg:mt-0 lg:justify-end">
              <ButtonLink href="/join" variant="dark" size="lg" withArrow>
                Join Leo Club Today
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      {news.length > 0 && (
        <section className="bg-surface py-16 sm:py-20">
          <Container>
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionLabel tone="blue">Latest News</SectionLabel>
                <h2 className="mt-3 text-h2 font-bold tracking-tight">Stay Updated</h2>
              </div>
              <ButtonLink href="/news" variant="outline" withArrow>
                View All News
              </ButtonLink>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {news.map((article, i) => (
                <Reveal key={article.id} delay={stagger(i)}>
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
