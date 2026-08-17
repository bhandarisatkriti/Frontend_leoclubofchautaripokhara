import Image from "next/image";
import Link from "next/link";
import { type Member } from "@/app/components/team/team-card";
import { EmptyState } from "@/app/components/page-header";
import { solidBlueButton } from "@/app/components/ui/button-link";
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
 */
export function TeamPreview({ team }: { team: Member[] }) {
  return (
    <section className="bg-linear-to-b from-background to-surface-blue py-16 sm:py-20">
      <Container>
        <Reveal className="text-center">
          <h2 className="text-h2 font-bold tracking-tight text-leo-indigo">
            Our Team
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted">
            A dedicated group of young leaders committed to community service
            and personal growth.
          </p>
        </Reveal>

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
                  <article className="h-full rounded-2xl bg-background p-5 text-center shadow-soft-md transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:shadow-soft-lg">
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

        <Reveal className="mt-12 text-center">
          <Link href="/team" className={solidBlueButton}>
            View More
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
