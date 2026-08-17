import { EmptyState } from "@/app/components/page-header";
import { TeamCard, type Member } from "@/app/components/team/team-card";
import { ButtonLink } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";

export function LeadershipPreview({ team }: { team: Member[] }) {
  return (
    <section className="bg-background py-16 sm:py-24">
      <Container>
        <Reveal className="text-center">
          <SectionLabel>Leadership</SectionLabel>
          <h2 className="mt-3 text-h2 font-bold tracking-tight">
            Meet the People Leading the Way
          </h2>
        </Reveal>

        <div className="mt-12">
          {team.length === 0 ? (
            <EmptyState message="Team members will appear here once they are added in the Django admin." />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, i) => (
                <Reveal key={member.id} as="li" delay={stagger(i)} className="list-none">
                  <TeamCard member={member} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>

        <Reveal className="mt-10 text-center">
          <ButtonLink href="/team" variant="outline" withArrow>
            Meet the Full Team
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
