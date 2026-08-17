import Link from "next/link";
import { Logo } from "@/app/components/logo";
import { NewsletterForm } from "@/app/components/newsletter-form";
import { Container } from "@/app/components/ui/container";
import { site } from "@/app/lib/site";

const pageLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News & Article" },
  { href: "/contact", label: "Contact" },
  { href: "/join", label: "Join Now" },
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

const contactIcons = {
  phone: (
    <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.5 3 3 3.4 2.5 4 2.5h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" />
  ),
  email: (
    <path d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1.4 2 6.6 5.5L18.6 6H5.4ZM19 8.2l-6.4 5.3a1 1 0 0 1-1.2 0L5 8.2V18h14V8.2Z" />
  ),
  address: <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />,
} as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[rgba(30,94,255,0.15)] bg-surface-navy text-on-navy">
      <Container className="grid gap-10 py-16 lg:grid-cols-[1.5fr_1fr_auto_1.1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Logo variant="mono-light" size={56} />
            <div>
              <p className="font-bold text-on-navy">{site.name}</p>
              <p className="text-sm text-on-navy-muted">{site.district}</p>
            </div>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-on-navy-muted">
            Unlock your potential with the {site.name}. Develop leadership
            skills, gain hands-on experience, and seize global opportunities —
            all while making a real difference. Join us and start your journey
            today!
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
          <div className="mt-8 max-w-xs">
            <h2 className="text-sm font-semibold text-on-navy">Newsletter</h2>
            <p className="mt-2 text-sm text-on-navy-muted">
              Occasional updates on projects and events — no spam.
            </p>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-on-navy">Pages</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {pageLinks.map((link) => (
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
          <h2 className="text-lg font-bold text-on-navy">Calendar</h2>
          {/* Third-party Nepali calendar widget (hamropatro.com). Note their
              path spells it "calender"; 320x360 is the size they document for
              this variant — the "full" one is 800x840 and won't fit here. */}
          <iframe
            src="https://www.hamropatro.com/widgets/calender-small.php"
            title="Nepali calendar"
            loading="lazy"
            scrolling="no"
            className="mt-5 h-[360px] w-[320px] max-w-full overflow-hidden rounded-lg border-0 bg-white"
          />
        </div>

        <div>
          <h2 className="text-lg font-bold text-on-navy">Contact Us</h2>
          <ul className="mt-5 space-y-4 text-sm text-on-navy-muted">
            <li>
              <a
                href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-3 transition-colors duration-[var(--duration-fast)] hover:text-leo-blue-light"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-leo-blue-light">
                  {contactIcons.phone}
                </svg>
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 transition-colors duration-[var(--duration-fast)] hover:text-leo-blue-light"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-leo-blue-light">
                  {contactIcons.email}
                </svg>
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-leo-blue-light">
                {contactIcons.address}
              </svg>
              {site.address}
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-[rgba(30,94,255,0.15)] py-5 text-center text-xs text-on-navy-muted">
        Copyright© 2023 All rights reserved. Powered by{" "}
        <a
          href="https://neptechpal.com.np/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-leo-blue-light transition-colors duration-[var(--duration-fast)] hover:text-white"
        >
          Nep Tech Pal Pvt. Ltd.
        </a>
      </div>
    </footer>
  );
}
