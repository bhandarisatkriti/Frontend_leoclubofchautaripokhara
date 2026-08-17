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
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
  },
} as const;

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
