import type { Metadata } from "next";
import { EmptyState } from "@/app/components/page-header";
import type { Member } from "@/app/components/team/team-card";
import { TeamSpotlight } from "@/app/components/team/team-spotlight";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { apiFetchOr, endpoints, type Paginated } from "@/app/lib/api";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the office bearers and members serving this Leo year.",
};

export default async function TeamPage() {
  const data = await apiFetchOr<Paginated<Member> | Member[]>(
    endpoints.team,
    [],
  );
  const members = Array.isArray(data) ? data : data.results;

  return (
    <>
      <Container className="py-16 sm:py-20">
        {members.length === 0 ? (
          <EmptyState message="Team members will appear here once they are added in the Django admin." />
        ) : (
          <Reveal>
            <TeamSpotlight members={members} />
          </Reveal>
        )}
      </Container>
    </>
  );
}
