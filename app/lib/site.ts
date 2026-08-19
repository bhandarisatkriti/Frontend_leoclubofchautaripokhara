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

/**
 * Headline figures the club publishes about itself.
 *
 * These are declared rather than counted: nothing in the database knows how
 * many leaders the club has trained or how many regions it has reached, and
 * the API's row counts (members, events, photos) measure the website's content
 * rather than the club's work. They live here so a committee member can revise
 * them in one obvious place — see `StatsGrid` for the figures that *are*
 * derived from real records.
 */
export const impactFigures = [
  { value: 1000, suffix: "+", label: "Leaders" },
  { value: 100, suffix: "+", label: "Works" },
  { value: 6, suffix: "+", label: "Regions" },
  { value: 10, suffix: "+", label: "Partners" },
] as const;

/** Standing introduction to the club's service work. */
export const ourWorkIntro =
  "The Leo Club of Chautari Pokhara empowers youth through leadership training and community service projects, fostering global connections and promoting environmental sustainability. We strive to create compassionate, skilled leaders dedicated to making a positive impact locally and globally.";

/**
 * The welcome message carried on the homepage.
 *
 * `photo` is a path under `public/`; leave it null and the portrait falls back
 * to the speaker's initials rather than an empty frame.
 */
export const welcomeMessage = {
  quote: "Empowering Tomorrow's Leaders Today",
  body: "Welcome to the Leo Club of Chautari Pokhara. Our goal is to help young people grow into strong leaders by serving our community and learning together. Every member plays a vital role in making a positive difference. Let's work together to create a brighter future for everyone.",
  name: "Sahansil Baral",
  role: "Immed. Past President",
  photo: null as string | null,
} as const;
