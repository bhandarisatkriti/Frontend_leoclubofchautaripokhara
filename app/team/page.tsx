import type { Metadata } from "next";
import { EmptyState } from "@/app/components/page-header";
import type { Member } from "@/app/components/team/team-card";
import { TeamGrid } from "@/app/components/team/team-grid";
import { Container } from "@/app/components/ui/container";
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

  if (members.length === 0) {
    return (
      <Container className="py-16 sm:py-20">
        <EmptyState message="Team members will appear here once they are added in the Django admin." />
      </Container>
    );
  }

  return <TeamGrid members={members} />;
}
