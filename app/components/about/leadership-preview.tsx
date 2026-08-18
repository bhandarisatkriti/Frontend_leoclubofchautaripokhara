"use client";

import { useState } from "react";
import Image from "next/image";
import { EmptyState } from "@/app/components/page-header";
import { type Member } from "@/app/components/team/team-card";
import { ButtonLink } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
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

function LeaderChip({ member }: { member: Member }) {
  const [broken, setBroken] = useState(false);
  const photo = mediaUrl(member.profile_image);
  const showPhoto = Boolean(photo) && !broken;
  const socials = (
    [
      member.facebook_url && { href: member.facebook_url, label: "Facebook" },
      member.instagram_url && { href: member.instagram_url, label: "Instagram" },
      member.linkedin_url && { href: member.linkedin_url, label: "LinkedIn" },
    ] as const
  ).filter((entry): entry is { href: string; label: string } => Boolean(entry));

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-surface-blue shadow-soft-sm sm:h-24 sm:w-24">
        {showPhoto ? (
          <Image
            src={photo!}
            alt={member.name}
            fill
            sizes="96px"
            className="object-cover"
            onError={() => setBroken(true)}
          />
        ) : (
          <span className="flex h-full items-center justify-center text-xl font-bold text-leo-blue">
            {initials(member.name)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold">{member.name}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-leo-blue">{member.position}</p>
        {socials.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {socials.map((social, i) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on ${social.label}`}
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white transition-[transform] duration-[var(--duration-fast)] hover:-translate-y-0.5 ${
                  i % 2 === 0 ? "bg-leo-blue" : "bg-leo-blue-dark"
                }`}
              >
                {social.label[0]}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
            <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, i) => (
                <Reveal key={member.id} as="li" delay={stagger(i)} className="list-none">
                  <LeaderChip member={member} />
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
