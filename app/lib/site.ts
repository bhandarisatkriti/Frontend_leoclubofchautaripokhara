import type { ClubInformation } from "@/app/lib/types";

/**
 * Static fallbacks used before the club profile is filled in through the Django
 * admin (`/api/club/` answers 404 until then), and if the backend is
 * unreachable at render time. Live values always win — see `clubProfile()`.
 */
export const site = {
  name: "Leo Club of Chautari Pokhara",
  shortName: "Leo Chautari Pokhara",
  district: "LDC 325 J, Nepal",
  motto: "Work Together",
  established: 2000,
  email: "info@leoclubofchautaripokhara.org",
  phone: "+977-XXXXXXXXXX",
  address: "Pokhara, Gandaki Province, Nepal",
  socials: {
    facebook: "https://www.facebook.com/LeoClubOFChautaripokhara",
    instagram: "https://www.instagram.com/leoclub_of_chautari_pokhara",
  },
} as const;

export type ClubProfile = {
  name: string;
  tagline: string;
  description: string;
  established: number;
  email: string;
  phone: string;
  address: string;
  district: string;
  motto: string;
  logo: string | null;
  socials: { label: string; href: string }[];
};

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  website: "Website",
};

/**
 * Merge the live club profile over the static fallbacks.
 *
 * Every field falls back independently, so a half-filled admin record still
 * renders a complete header and footer rather than blank gaps.
 */
export function clubProfile(club: ClubInformation | null): ClubProfile {
  const liveSocials = Object.entries(club?.social_links ?? {})
    .filter(([, href]) => Boolean(href))
    .map(([key, href]) => ({
      label: SOCIAL_LABELS[key] ?? key,
      href: href as string,
    }));

  // A club record with no social links filled in still shows our real profiles.
  const socials = liveSocials.length
    ? liveSocials
    : [
        { label: "Facebook", href: site.socials.facebook },
        { label: "Instagram", href: site.socials.instagram },
      ];

  return {
    name: club?.name || site.name,
    tagline: club?.tagline || site.motto,
    description: club?.short_description || "",
    established: club?.established_year || site.established,
    email: club?.email || site.email,
    phone: club?.phone || site.phone,
    address: club?.address || site.address,
    district: site.district,
    motto: club?.tagline || site.motto,
    logo: club?.logo ?? null,
    socials,
  };
}

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "/membership", label: "Membership" },
  { href: "/contact", label: "Contact" },
] as const;
