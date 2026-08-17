import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/app/components/logo";
import { endpoints, fetchList, getClubInformation, mediaUrl } from "@/app/lib/api";
import { clubProfile, site } from "@/app/lib/site";
import type { Article, LeoEvent } from "@/app/lib/types";

const focusAreas = [
  {
    title: "Health & Wellbeing",
    body: "Blood donation drives, health camps, and awareness campaigns across the Pokhara valley.",
    accent: "text-leo-red",
  },
  {
    title: "Education & Youth",
    body: "Scholarships, stationery support, and skill sessions for students in local schools.",
    accent: "text-leo-violet",
  },
  {
    title: "Environment",
    body: "Tree plantation, clean-up campaigns, and conservation work — the tree on our emblem.",
    accent: "text-leo-green",
  },
];

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? value : dateFormat.format(parsed);
}

export default async function Home() {
  // Everything here degrades to an empty list if the backend is unreachable,
  // so the homepage always renders.
  const [clubInfo, upcoming, articles] = await Promise.all([
    getClubInformation(),
    fetchList<LeoEvent>(endpoints.events, {
      upcoming: true,
      ordering: "event_date",
      page_size: 3,
    }),
    fetchList<Article>(endpoints.articles, { page_size: 3 }),
  ]);

  const club = clubProfile(clubInfo);

  const stats = [
    { value: `${new Date().getFullYear() - club.established}+`, label: "Years of service" },
    { value: site.district.split(",")[0], label: "Leo District" },
    { value: "Pokhara", label: "Home community" },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-leo-red/10 via-transparent to-leo-violet/15"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:py-28">
          <Logo size={140} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leo-violet">
              {site.district} · Estd. {club.established}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              {club.name}
            </h1>
            <p className="mt-4 text-2xl font-semibold uppercase tracking-[0.15em] text-leo-red">
              {club.motto}
            </p>
          </div>
          <p className="max-w-2xl text-lg text-muted">
            {club.description ||
              "We are young people from Pokhara who give our time to the community — through service projects in health, education, and the environment."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/membership"
              className="rounded-full bg-leo-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-leo-red-dark"
            >
              Become a Leo
            </Link>
            <Link
              href="/events"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-leo-violet hover:text-leo-violet"
            >
              See our events
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold tracking-tight">What we work on</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Three service pillars guide the projects we take on each Leo year.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {focusAreas.map((area) => (
            <article
              key={area.title}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <h3 className={`text-lg font-semibold ${area.accent}`}>{area.title}</h3>
              <p className="mt-2 text-sm text-muted">{area.body}</p>
            </article>
          ))}
        </div>
      </section>

      {upcoming.length > 0 && (
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-2xl font-bold tracking-tight">Upcoming events</h2>
              <Link href="/events" className="text-sm font-semibold text-leo-violet hover:text-leo-red">
                All events →
              </Link>
            </div>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {upcoming.map((event) => {
                const image = mediaUrl(event.featured_image);
                return (
                  <li
                    key={event.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-border bg-background"
                  >
                    {image && (
                      <div className="relative aspect-16/9">
                        <Image
                          src={image}
                          alt={event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-leo-red">
                        {formatDate(event.event_date)}
                      </p>
                      <h3 className="mt-2 font-semibold">{event.title}</h3>
                      {event.location && (
                        <p className="mt-1 text-sm text-muted">{event.location}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Latest news</h2>
            <Link href="/news" className="text-sm font-semibold text-leo-violet hover:text-leo-red">
              All news →
            </Link>
          </div>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <li key={article.id} className="rounded-xl border border-border p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-leo-violet">
                  {formatDate(article.published_at)}
                </p>
                <h3 className="mt-2 font-semibold">{article.title}</h3>
                {article.excerpt && (
                  <p className="mt-2 text-sm text-muted">{article.excerpt}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold tracking-tight text-leo-violet">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Ready to serve with us?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Membership is open to young people aged 12–30 in and around Pokhara.
          Tell us a little about yourself and we will get in touch.
        </p>
        <Link
          href="/membership"
          className="mt-7 inline-block rounded-full bg-leo-violet px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-leo-violet-dark"
        >
          Apply for membership
        </Link>
      </section>
    </>
  );
}
