import { Container } from "@/app/components/ui/container";
import { site } from "@/app/lib/site";

const socials = [
  {
    label: "Facebook",
    href: site.socials.facebook,
    icon: <path d="M14 9h2V6h-2c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V9c0-.3.3-.6.6-.6H14V9Z" />,
  },
  {
    label: "Instagram",
    href: site.socials.instagram,
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16.6" cy="7.4" r="1" />
      </>
    ),
  },
] as const;

/** Slim informational strip above the main nav — scrolls away, not sticky. Hidden on small screens. */
export function TopBar() {
  return (
    <div className="hidden bg-surface-navy text-on-navy-muted md:block">
      <Container className="flex h-9 items-center justify-between text-xs">
        <div className="flex items-center gap-5">
          <a
            href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
            className="flex items-center gap-1.5 transition-colors duration-[var(--duration-fast)] hover:text-white"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-leo-blue-light">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.5 3 3 3.4 2.5 4 2.5h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" />
            </svg>
            {site.phone}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-1.5 transition-colors duration-[var(--duration-fast)] hover:text-white"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-leo-blue-light">
              <path d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1.4 2 6.6 5.5L18.6 6H5.4ZM19 8.2l-6.4 5.3a1 1 0 0 1-1.2 0L5 8.2V18h14V8.2Z" />
            </svg>
            {site.email}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-medium tracking-wide">Follow Us</span>
          <div className="flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-[var(--duration-fast)] hover:bg-white/10 hover:text-white"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
