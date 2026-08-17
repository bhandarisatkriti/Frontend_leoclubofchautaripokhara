import type { Metadata } from "next";
import { EmptyState } from "@/app/components/page-header";
import { TeamCard, type Member } from "@/app/components/team/team-card";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { apiFetchOr, endpoints, type Paginated } from "@/app/lib/api";
import { stagger } from "@/app/lib/motion";

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
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member, i) => (
              <Reveal key={member.id} as="li" delay={stagger(i)} className="list-none">
                <TeamCard member={member} />
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
