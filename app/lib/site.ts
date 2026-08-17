export const site = {
  name: "Leo Club of Chautari Pokhara",
  shortName: "Leo Chautari Pokhara",
  district: "LDC 325 J, Nepal",
  motto: "Work Together",
  established: 2000,
  email: "info@leoclubofchautaripokhara.org",
  phone: "+977-XXXXXXXXXX",
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
 * Club history milestones. Only entries we can actually confirm — extend this
 * array as real milestones are documented, never with invented dates.
 */
export const milestones = [
  {
    year: String(site.established),
    title: "Club Chartered",
    description: `${site.name} was officially chartered under ${site.district}, sponsored by the Lions Club of Pokhara Chautari.`,
  },
  {
    year: "Today",
    title: "Continuing the Journey",
    description: "Still serving Pokhara, one project and one member at a time.",
  },
] as const;

export type NavLink = {
  href: string;
  label: string;
  children?: readonly { href: string; label: string }[];
};

export const navLinks: readonly NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/resources", label: "Resources" },
  {
    href: "/events",
    label: "Events & Calendar",
    children: [
      { href: "/events", label: "All Events" },
      { href: "/events/calendar", label: "Calendar" },
    ],
  },
  { href: "/team", label: "Team" },
  { href: "/clubs", label: "Clubs" },
  { href: "/contact", label: "Contact" },
  { href: "/join", label: "Join" },
] as const;
