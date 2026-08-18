import { site } from "@/app/lib/site";

/**
 * Configuration for the membership popup.
 *
 * Every string, the benefit list, the destination and the timing live here so
 * the copy can change without touching the component — and so an admin screen
 * can later feed the same shape from the API without a rewrite.
 */
export type JoinPopupConfig = {
  /** Master switch. Set false to retire the popup without removing the code. */
  enabled: boolean;
  /** Wait before opening, so the page paints first and it does not feel like a blocker. */
  delayMs: number;
  /**
   * How long a dismissal is honoured.
   *  - `session`    — until the browser tab is closed (the default; least annoying
   *                   without being forgotten the moment someone changes page)
   *  - `persistent` — until site data is cleared
   *  - `never`      — shows on every load; useful while designing it
   */
  dismissalScope: "session" | "persistent" | "never";
  storageKey: string;

  /** Small kicker above the headline. */
  label: string;
  /**
   * Headline with the phrase to accent wrapped in asterisks, e.g.
   * "Be Part of Something *Bigger*". See `splitHeadline`.
   */
  headline: string;
  description: string;
  benefits: string[];

  ctaLabel: string;
  /** The existing application route — see app/join/page.tsx. */
  ctaHref: string;
  /** Rendered only when set; the public site has no member login today. */
  signInHref: string | null;
  signInPrompt: string;
  signInLabel: string;

  logoSrc: string;

  panelLabel: string;
  panelHeadline: string;
  panelIntro: string;
  panelBody: string;
};

/**
 * Split the headline on the `*accented phrase*` marker.
 *
 * Keeping the marker in the copy means the accent can move with the words when
 * the headline is rewritten, instead of the component hard-coding which part is
 * highlighted. A headline with no marker simply renders unaccented.
 */
export function splitHeadline(config: Pick<JoinPopupConfig, "headline">): {
  before: string;
  accent: string;
  after: string;
} {
  // [\s\S] rather than the /s flag, which needs an es2018 target.
  const match = config.headline.match(/^([\s\S]*?)\*([\s\S]+?)\*([\s\S]*)$/);
  if (!match) return { before: config.headline, accent: "", after: "" };
  return { before: match[1], accent: match[2], after: match[3] };
}

export const joinPopupConfig: JoinPopupConfig = {
  enabled: true,
  delayMs: 900,
  dismissalScope: "session",
  storageKey: "leo:join-popup-dismissed",

  label: "Join now",
  headline: "Be Part of Something *Bigger*",
  description:
    "Connect with our community, participate in meaningful projects, develop your skills, and make an impact together.",
  benefits: [
    "Become part of our community",
    "Participate in projects and events",
    "Develop leadership and professional skills",
    "Connect with like-minded people",
  ],

  ctaLabel: "Join now",
  ctaHref: "/join",
  // No public member login exists yet; set this once one does and the line
  // under the button appears on its own.
  signInHref: null,
  signInPrompt: "Already a member?",
  signInLabel: "Sign in",

  logoSrc: "/logo.png",

  panelLabel: "Ready to join?",
  panelHeadline: "Join our community",
  panelIntro: "Start your membership journey today.",
  panelBody: `Become part of a growing network under ${site.district} and take part in opportunities, events, projects, and community initiatives.`,
};
