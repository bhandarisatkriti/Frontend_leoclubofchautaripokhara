import Image from "next/image";
import { type Member } from "@/app/components/team/team-card";
import { SectionHeading } from "@/app/components/home/section-heading";
import { EmptyState } from "@/app/components/page-header";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { mediaUrl } from "@/app/lib/api";
import { stagger } from "@/app/lib/motion";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/**
 * Homepage team teaser. Deliberately separate from `TeamCard` (used on /team):
 * this one centres the name and position under an inset portrait, matching the
 * club's reference design, rather than overlaying the position on the photo.
 *
 * The heading and onward link go through `SectionHeading` like every other
 * band, so the section sits in the page's rhythm instead of introducing a
 * third way of titling things.
 */
export function TeamPreview({ team }: { team: Member[] }) {
  return (
    <section className="bg-background py-20 sm:py-24">
      <Container>
        <SectionHeading
          label="Our people"
          title="Our team"
          description="A dedicated group of young leaders committed to community service and personal growth."
          action={{ href: "/team", label: "View more" }}
        />

        {team.length === 0 ? (
          <div className="mt-12">
            <EmptyState message="Team members will appear here once they are added in the Django admin." />
          </div>
        ) : (
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => {
              const photo = mediaUrl(member.profile_image);
              return (
                <Reveal
                  key={member.id}
                  as="li"
                  delay={stagger(i, 120)}
                  className="list-none"
                >
                  <article className="h-full rounded-2xl border border-border bg-surface p-5 text-center shadow-soft-sm transition-[translate,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-leo-blue/30 hover:shadow-soft-md">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-leo-indigo">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={member.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-4xl font-bold text-white/80">
                          {initials(member.name)}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-6 text-lg font-bold tracking-tight">
                      {member.name}
                    </h3>
                    <p className="mt-1.5 text-muted">{member.position}</p>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        )}

      </Container>
    </section>
  );
}
