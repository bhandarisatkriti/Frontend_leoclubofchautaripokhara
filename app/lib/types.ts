/**
 * Types for the Django API (../backend_leoclubofchautaripokhara).
 *
 * These mirror the DRF serializers. Keep them in sync with the backend, or
 * regenerate from the live schema:
 *   npx openapi-typescript http://127.0.0.1:8000/api/schema/ -o app/lib/schema.ts
 *
 * Conventions:
 *  - image/file fields are absolute URLs or `null`
 *  - dates are `YYYY-MM-DD`, datetimes are ISO-8601, times are `HH:MM:SS`
 */

/** DRF's default pagination envelope, returned by every list endpoint. */
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

export type Author = {
  id: number;
  display_name: string;
  avatar: string | null;
};

/** GET /api/club/ — the club profile powering the header, footer and contact page. */
export type ClubInformation = {
  id: number;
  name: string;
  logo: string | null;
  tagline: string;
  short_description: string;
  full_description: string;
  mission: string;
  vision: string;
  established_year: number | null;
  phone: string;
  email: string;
  address: string;
  website: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  linkedin_url: string;
  /** Only the non-empty links, ready to map over. */
  social_links: Partial<
    Record<"facebook" | "instagram" | "youtube" | "linkedin" | "website", string>
  >;
  created_at: string;
  updated_at: string;
};

/** GET /api/team/ */
export type TeamMember = {
  id: number;
  name: string;
  position: string;
  bio: string;
  profile_image: string | null;
  email: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  display_order: number;
  created_at: string;
};

export type EventCategory = Category & {
  color: string;
  event_count: number;
};

/** GET /api/events/ — list rows carry `short_description`, not the full body. */
export type LeoEvent = {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  featured_image: string | null;
  category: EventCategory | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  organizer: string;
  registration_required: boolean;
  registration_deadline: string | null;
  registration_url: string;
  registration_open: boolean;
  is_upcoming: boolean;
  is_past: boolean;
  is_featured: boolean;
  created_at: string;
};

/** GET /api/events/<slug>/ */
export type LeoEventDetail = LeoEvent & { description: string };

/** GET /api/events/calendar/ — not paginated; has its own range envelope. */
export type CalendarEvent = {
  id: number;
  title: string;
  slug: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  category_color: string;
  is_featured: boolean;
};

export type CalendarResponse = {
  start_date: string;
  end_date: string;
  count: number;
  results: CalendarEvent[];
};

export type GalleryCategory = Category & {
  image_count: number;
};

/** GET /api/gallery/ */
export type GalleryImage = {
  id: number;
  title: string;
  image: string;
  description: string;
  category: GalleryCategory | null;
  event_title: string | null;
  event_slug: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
};

export type ArticleCategory = Category & {
  display_order: number;
  article_count: number;
};

export type Tag = { id: number; name: string; slug: string };

/** GET /api/articles/ — list rows omit `content`. */
export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  category: ArticleCategory | null;
  tags: Tag[];
  author: Author | null;
  byline: string;
  reading_time_minutes: number;
  published_at: string;
  is_featured: boolean;
  created_at: string;
};

/** GET /api/articles/<slug>/ */
export type ArticleDetail = Article & {
  content: string;
  author_name: string;
};

export type ResourceCategory = Category & {
  icon: string | null;
  display_order: number;
  resource_count: number;
};

/** GET /api/resources/ */
export type Resource = {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: ResourceCategory | null;
  url: string;
  file: string | null;
  resource_type: "file" | "link" | "text";
  is_featured: boolean;
  display_order: number;
};

/** GET /api/partners/ */
export type Partner = {
  id: number;
  name: string;
  logo: string | null;
  description: string;
  website: string;
  display_order: number;
};

/** GET /api/clubs/ — related Leo clubs. */
export type Club = {
  id: number;
  name: string;
  slug: string;
  district: string;
  location: string;
  description: string;
  logo: string | null;
  website: string;
  facebook_url: string;
  instagram_url: string;
};

/** GET /api/site-images/ — images the site renders in named slots. */
export type SiteImagePlacement =
  | "HERO"
  | "ABOUT_PRIMARY"
  | "ABOUT_SECONDARY"
  | "ABOUT_TERTIARY"
  | "WELCOME_PORTRAIT"
  | "JOIN"
  | "OTHER";

export type SiteImage = {
  id: number;
  title: string;
  alt_text: string;
  description: string;
  image: string;
  placement: SiteImagePlacement;
  placement_display: string;
  is_active: boolean;
  display_order: number;
};
