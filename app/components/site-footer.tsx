import Link from "next/link";
import { Logo } from "@/app/components/logo";
import { NewsletterForm } from "@/app/components/newsletter-form";
import { Container } from "@/app/components/ui/container";
import { site } from "@/app/lib/site";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/gallery", label: "Gallery" },
];

const resourceLinks = [
  { href: "/resources", label: "Resources" },
  { href: "/clubs", label: "Clubs & District" },
  { href: "/news", label: "News" },
  { href: "/join", label: "Membership" },
];

const socials = [
  {
    label: "Facebook",
    href: site.socials.facebook,
    icon: (
      <path d="M14 9h2V6h-2c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V9c0-.3.3-.6.6-.6H14V9Z" />
    ),
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

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[rgba(30,94,255,0.15)] bg-surface-navy text-on-navy">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-3">
            <Logo variant="mono-light" />
            <div>
              <p className="font-bold text-on-navy">{site.name}</p>
              <p className="text-sm text-on-navy-muted">{site.district}</p>
            </div>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-on-navy-muted">
            Chartered in {site.established}, we are a youth service club serving the
            Pokhara community through health, education, and environment projects.
          </p>
          <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-leo-blue-light">
            {site.motto}
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map((social, i) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-on-navy transition-[transform,background-color] duration-[var(--duration-fast)] ease-[var(--ease-premium)] hover:-translate-y-0.5 ${
                  i % 2 === 0 ? "hover:bg-leo-blue/25" : "hover:bg-leo-cyan/20"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-on-navy">Quick Links</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-on-navy-muted transition-colors duration-[var(--duration-fast)] hover:text-leo-blue-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-on-navy">Resources</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {resourceLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-on-navy-muted transition-colors duration-[var(--duration-fast)] hover:text-leo-cyan"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-on-navy">Get In Touch</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-on-navy-muted">
            <li>{site.address}</li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="transition-colors duration-[var(--duration-fast)] hover:text-leo-blue-light"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                className="transition-colors duration-[var(--duration-fast)] hover:text-leo-blue-light"
              >
                {site.phone}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-on-navy">Newsletter</h2>
          <p className="mt-4 text-sm text-on-navy-muted">
            Occasional updates on projects and events — no spam.
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </Container>

      <div className="border-t border-[rgba(30,94,255,0.15)] py-5 text-center text-xs text-on-navy-muted">
        © {site.established}–present {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
