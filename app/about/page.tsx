import type { Metadata } from "next";
import { AboutCta } from "@/app/components/about/about-cta";
import { AboutHero } from "@/app/components/about/about-hero";
import { CoreValues } from "@/app/components/about/core-values";
import { MissionVision } from "@/app/components/about/mission-vision";
import { PhotoStory } from "@/app/components/about/photo-story";
import { WhoWeAre } from "@/app/components/about/who-we-are";
import { site } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Who we are: ${site.name}, a youth service club under ${site.district}, chartered in ${site.established}.`,
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhoWeAre />
      <MissionVision />
      <CoreValues />
      <PhotoStory />
      <AboutCta />
    </>
  );
}
