import Link from "next/link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { site } from "@/app/lib/site";
import type { ClubInformation } from "@/app/lib/types";

/**
 * Closing contact block.
 *
 * Deliberately compact — the footer already carries the full set of links, so
 * this only answers "where are you and how do I reach you" and hands off to the
 * contact page. Every value comes from the club profile, falling back to the
 * static details when an administrator has not filled the record in.
 */
export function ContactStrip({ club }: { club: ClubInformation | null }) {
  // Live club record wins; the static constants are the fallback for a
  // profile an administrator has not filled in yet.
  const address = club?.address || site.address;
  const email = club?.email || site.email;
  const phone = club?.phone || site.phone;

  const rows = [
    { term: "Where", value: address, href: undefined as string | undefined },
    { term: "Email", value: email, href: `mailto:${email}` },
    { term: "Phone", value: phone, href: `tel:${phone.replace(/[^+\d]/g, "")}` },
  ].filter((row) => Boolean(row.value));

  const socials = Object.entries(club?.social_links ?? {})
    .filter(([, href]) => Boolean(href))
    .map(([key, href]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      href: href as string,
    }));

  const links = socials.length
    ? socials
    : [
        { label: "Facebook", href: site.socials.facebook },
        { label: "Instagram", href: site.socials.instagram },
      ];

  return (
    <section className="border-t border-border bg-background py-20 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <Reveal>
            <p className="section-label text-leo-blue">Get in touch</p>
            <h2 className="mt-3 text-h2 font-bold tracking-tight text-balance">
              Questions, ideas, or partnerships
            </h2>
            <p className="mt-4 max-w-md text-muted">
              We read everything that comes in and reply as soon as the
              committee has met.
            </p>
            <Link
              href="/contact"
              className="group mt-7 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-leo-blue"
            >
              Contact the club
              <span
                aria-hidden
                className="h-px w-8 bg-current transition-[width] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:w-12"
              />
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <dl className="divide-y divide-border border-y border-border">
              {rows.map((row) => (
                <div
                  key={row.term}
                  className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-4"
                >
                  <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
                    {row.term}
                  </dt>
                  <dd className="text-sm font-medium">
                    {row.href ? (
                      <a href={row.href} className="hover:text-leo-blue">
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-6">
                {links.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted transition-colors hover:text-leo-blue"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
