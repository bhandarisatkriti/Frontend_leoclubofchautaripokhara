import Image from "next/image";
import { Motif } from "@/app/components/ui/motif";
import { mediaUrl } from "@/app/lib/api";

export type Member = {
  id: number;
  name: string;
  position: string;
  photo: string | null;
  bio?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TeamCard({ member }: { member: Member }) {
  const photo = mediaUrl(member.photo);
  const socials = (
    [
      member.facebook_url && { href: member.facebook_url, label: "Facebook" },
      member.instagram_url && { href: member.instagram_url, label: "Instagram" },
      member.linkedin_url && { href: member.linkedin_url, label: "LinkedIn" },
    ] as const
  ).filter((entry): entry is { href: string; label: string } => Boolean(entry));

  return (
    <li className="group overflow-hidden rounded-xl border border-border bg-surface shadow-soft-sm transition-[transform,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-leo-blue/30 hover:shadow-soft-md">
      <div className="relative aspect-square overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-105"
          />
        ) : (
          <>
            <Motif variant="dots" tone="blue" />
            <span className="relative flex h-full items-center justify-center text-4xl font-bold text-leo-blue">
              {initials(member.name)}
            </span>
          </>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-leo-blue shadow-soft-sm transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:-translate-y-0.5">
          {member.position}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{member.name}</h3>
        {member.bio && <p className="mt-2 text-sm text-muted">{member.bio}</p>}
        {socials.length > 0 && (
          <div className="mt-3 flex gap-2">
            {socials.map((social, i) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on ${social.label}`}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-soft-sm transition-[transform,box-shadow] duration-[var(--duration-fast)] hover:-translate-y-0.5 ${
                  i % 2 === 0 ? "bg-leo-blue" : "bg-leo-blue-dark"
                }`}
              >
                {social.label[0]}
              </a>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
