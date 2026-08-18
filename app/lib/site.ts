export const site = {
  name: "Leo Club of Chautari Pokhara",
  shortName: "Leo Chautari Pokhara",
  district: "LDC 325 J, Nepal",
  motto: "Work Together",
  established: 2000,
  email: "info@leoclubofchautaripokhara.com",
  phone: "+977 984-6602696",
  address: "Pokhara, Gandaki Province, Nepal",
  // Confirmed from the club's own Charter Night banner (public/images/hero/charter-night-cover.jpg).
  sponsoringClub: "Lions Club of Pokhara Chautari" as string | null,
  clubId: "74600",
  socials: {
    facebook: "https://www.facebook.com/LeoClubOFChautaripokhara",
    instagram: "https://www.instagram.com/leoclub_of_chautari_pokhara",
  },
} as const;

/**
 * The club's own "Who We Are" copy, carried over from its existing website.
 *
 * This is the fallback: whatever an administrator puts in
 * ClubInformation.full_description (Django admin) takes precedence, so the
 * text can be edited without a redeploy.
 */
export const whoWeAre = [
  "The Leo Club of Chautari Pokhara is a dedicated children's organization operating under the esteemed International Lions Club, which spans the globe. Our club, located in the beautiful city of Pokhara, Nepal, is committed to nurturing young leaders and fostering a sense of community service among the youth.",
  "As a non-profit organization, we focus on empowering children and teenagers to develop leadership skills, engage in meaningful community projects, and make a positive impact in their surroundings. Through various activities and initiatives, we strive to build a brighter future for our community and beyond.",
];

/**
 * Split a description from the API into paragraphs, falling back to the copy
 * above when the club record has nothing filled in yet.
 */
export function whoWeAreParagraphs(description?: string | null): string[] {
  const paragraphs = (description ?? "")
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  return paragraphs.length ? paragraphs : whoWeAre;
}

export type NavLink = {
  href: string;
  label: string;
  children?: readonly { href: string; label: string }[];
};

export const navLinks: readonly NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News & Article" },
  { href: "/contact", label: "Contact" },
  { href: "/join", label: "Join Now" },
] as const;
