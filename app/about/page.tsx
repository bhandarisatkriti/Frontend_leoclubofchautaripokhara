import type { Metadata } from "next";
import { AboutCta } from "@/app/components/about/about-cta";
import { AboutHero } from "@/app/components/about/about-hero";
import { CommunityImpact } from "@/app/components/about/community-impact";
import { CoreValues } from "@/app/components/about/core-values";
import { LeadershipPreview } from "@/app/components/about/leadership-preview";
import { MissionVision } from "@/app/components/about/mission-vision";
import { PhotoStory } from "@/app/components/about/photo-story";
import { Timeline } from "@/app/components/about/timeline";
import { WhatWeDo } from "@/app/components/about/what-we-do";
import { WhoWeAre } from "@/app/components/about/who-we-are";
import { type ClubStats } from "@/app/components/home/stats-grid";
import { type Member } from "@/app/components/team/team-card";
import { apiFetchOr, endpoints, type Paginated } from "@/app/lib/api";
import { site } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Who we are: ${site.name}, a youth service club under ${site.district}, chartered in ${site.established}.`,
};

export default async function AboutPage() {
  const [teamData, clubStats] = await Promise.all([
    apiFetchOr<Paginated<Member> | Member[]>(endpoints.team, []),
    apiFetchOr<ClubStats | null>(endpoints.club, null),
  ]);
  const team = (Array.isArray(teamData) ? teamData : teamData.results).slice(0, 4);

  return (
    <>
      <AboutHero />
      <WhoWeAre />
      <MissionVision />
      <Timeline />
      <WhatWeDo />
      <CoreValues />
      <CommunityImpact clubStats={clubStats} />
      <LeadershipPreview team={team} />
      <PhotoStory />
      <AboutCta />
    </>
  );
}
