import type { Metadata } from "next";
import { DirectorySection } from "@/app/components/resources/directory-section";
import { FeaturedResources } from "@/app/components/resources/featured-resources";
import { PartnersSection } from "@/app/components/resources/partners-section";
import { ResourceExplorer } from "@/app/components/resources/resource-explorer";
import { ResourcesCta } from "@/app/components/resources/resources-cta";
import { ResourcesHero } from "@/app/components/resources/resources-hero";
import { apiFetchOr, endpoints, type Paginated } from "@/app/lib/api";
import { localResources, type DirectoryClub, type Partner, type Resource } from "@/app/lib/resources";
import { site } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Resources",
  description: `Leo resources, partner information, and directories for ${site.name} members and the community.`,
};

export default async function ResourcesPage() {
  const [resourcesData, partnersData, clubsData] = await Promise.all([
    apiFetchOr<Paginated<Resource> | Resource[]>(endpoints.resources, []),
    apiFetchOr<Paginated<Partner> | Partner[]>(endpoints.partners, []),
    apiFetchOr<Paginated<DirectoryClub> | DirectoryClub[]>(endpoints.clubs, []),
  ]);

  const backendResources = Array.isArray(resourcesData) ? resourcesData : resourcesData.results;
  // Real club links (membership, about, district, contact) load instantly and
  // always work, even before /api/resources/ has anything in it — backend
  // resources are appended after them, never replacing them.
  const resources = [...localResources, ...backendResources];
  const partners = Array.isArray(partnersData) ? partnersData : partnersData.results;
  const clubs = Array.isArray(clubsData) ? clubsData : clubsData.results;

  return (
    <>
      <ResourcesHero />
      <FeaturedResources resources={resources} />
      <ResourceExplorer resources={resources} />
      <PartnersSection partners={partners} />
      <DirectorySection clubs={clubs} />
      <ResourcesCta />
    </>
  );
}
