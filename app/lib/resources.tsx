import { site } from "@/app/lib/site";

/**
 * Types and display helpers for the /resources page. Shapes are best-effort
 * guesses at the Django serializers — correct the optional fields once
 * config/urls.py and the serializers are final, same convention as api.ts.
 */

export type Resource = {
  id: string | number;
  slug?: string | null;
  title: string;
  description?: string | null;
  category?: string | null;
  url?: string | null;
  file?: string | null;
  featured?: boolean;
};

/**
 * Real, always-available resources that don't need the backend — the club's
 * own membership/about/district/contact info. Shown ahead of backend
 * resources (same IMAGE PRIORITY pattern as app/lib/local-photos.ts) so the
 * page is genuinely useful even before /api/resources/ is populated.
 */
export const localResources: Resource[] = [
  {
    id: "local-membership",
    title: "Become a Leo",
    category: "Leo Resources",
    description:
      "Membership is open to young people aged 12–30 living in or around Pokhara — see the full application.",
    url: "/join",
    featured: true,
  },
  {
    id: "local-leo-pillars",
    title: "Leadership, Experience, Opportunity",
    category: "Leo Resources",
    description: "The three pillars every Leo project is built around — what they mean to us.",
    url: "/about",
  },
  {
    id: "local-district",
    title: `${site.district}`,
    category: "District Directory",
    description: `${site.name} operates under Leo District 325 J. Learn more about the wider Leo & Lions network.`,
    url: "https://www.lionsclubs.org/en",
  },
  {
    id: "local-contact",
    title: "Contact the Club",
    category: "Leo Resources",
    description: "Reach the membership and events team directly with any questions.",
    url: "/contact",
  },
];

/** True for absolute http(s) URLs — anything else is treated as an internal site path. */
export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export type Partner = {
  id: number;
  name: string;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
};

export type DirectoryClub = {
  id: number;
  name: string;
  district?: string | null;
  location?: string | null;
  website?: string | null;
};

export type ResourceCta = { label: string; external: boolean };

/** Which action a resource card offers, based on what data it actually has. */
export function resourceCta(resource: Resource): ResourceCta | null {
  if (resource.file) return { label: "Download", external: true };
  if (resource.url) {
    const external = isExternalUrl(resource.url);
    const category = (resource.category ?? "").toLowerCase();
    if (category.includes("directory")) return { label: "Open Directory", external };
    if (category.includes("partner")) return { label: "Visit Website", external };
    if (!external) return { label: "View Resource", external };
    return { label: "Learn More", external };
  }
  return null;
}

/** Resource href — the file if present, otherwise the external url. */
export function resourceHref(resource: Resource): string | null {
  return resource.file ?? resource.url ?? null;
}

const iconToneClasses = {
  blue: "bg-leo-blue/10 text-leo-blue",
  violet: "bg-leo-violet/10 text-leo-violet",
  cyan: "bg-leo-cyan/10 text-leo-cyan",
  red: "bg-leo-red/10 text-leo-red",
  navy: "bg-leo-charcoal/10 text-leo-charcoal",
} as const;

type IconKey = keyof typeof iconPaths;

const iconPaths = {
  book: (
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5a2.5 2.5 0 0 0-2.5 2.5V4.5ZM6.5 19H18V4H6.5A.5.5 0 0 0 6 4.5v14a2.5 2.5 0 0 1 .5.5Z" />
  ),
  droplet: (
    <path d="M12 2s7 8.1 7 13a7 7 0 1 1-14 0c0-4.9 7-13 7-13Zm0 17a4 4 0 0 0 4-4c0-.6-.2-1-.5-1.5a4.5 4.5 0 0 1-4.9 4.4c.4.07.9.1 1.4.1Z" />
  ),
  handshake: (
    <path d="M8 3 3 8v4l3 3 3-3-1-1 4-4-1-1 3-3H8Zm8 0-3 3 1 1-4 4 1 1-3 3 3 3 3-3v-4l-3-3 1-1-1-1 3-3h4l5 5-4 4-1-1-3 3-3-3 3-3 1 1 4-4-5-5h-4Z" />
  ),
  mapPin: (
    <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Zm0-8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
  ),
  code: (
    <path d="M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4Zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4Z" />
  ),
  landmark: (
    <path d="M12 2 2 8h20L12 2Zm-8 8v9h3v-9H4Zm6.5 0v9h3v-9h-3ZM17 10v9h3v-9h-3ZM2 21h20v2H2v-2Z" />
  ),
  badge: (
    <path d="M12 2 4 5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5l-8-3Zm-1.2 12.2L7.6 11 9 9.6l1.8 1.8L15 7.2l1.4 1.4-5.6 5.6Z" />
  ),
  file: (
    <path d="M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5L14 3.5ZM8 12h8v1.6H8V12Zm0 3.5h8v1.6H8v-1.6Z" />
  ),
} as const;

const categoryIcon: { match: (category: string) => boolean; icon: IconKey; tone: keyof typeof iconToneClasses }[] = [
  { match: (c) => c.includes("blood"), icon: "droplet", tone: "red" },
  { match: (c) => c.includes("partner"), icon: "handshake", tone: "blue" },
  { match: (c) => c.includes("district") || c.includes("directory"), icon: "mapPin", tone: "violet" },
  { match: (c) => c.includes("development") || c.includes("team"), icon: "code", tone: "cyan" },
  { match: (c) => c.includes("foundation"), icon: "landmark", tone: "violet" },
  { match: (c) => c.includes("nlf") || c.includes("membership"), icon: "badge", tone: "blue" },
  { match: (c) => c.includes("leo resource"), icon: "book", tone: "blue" },
];

/** Icon + accent tone for a resource, derived from its category — extensible to any future category the backend adds. */
export function resourceVisual(resource: Resource) {
  const category = (resource.category ?? "").toLowerCase();
  const match = categoryIcon.find((entry) => entry.match(category));
  const icon = match?.icon ?? (resource.file ? "file" : "book");
  const tone = match?.tone ?? "blue";
  return { path: iconPaths[icon], className: iconToneClasses[tone] };
}
