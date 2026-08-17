import Link from "next/link";
import { Logo } from "@/app/components/logo";
import { getClubInformation } from "@/app/lib/api";
import { clubProfile, navLinks, site } from "@/app/lib/site";

/**
 * Contact details and social links come from `/api/club/`, so administrators
 * can change them from the Django admin without a redeploy. Static values in
 * `site.ts` cover the gap until that record exists.
 */
export async function SiteFooter() {
  const club = clubProfile(await getClubInformation());

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <Logo size={52} />
            <div>
              <p className="font-bold">{club.name}</p>
              <p className="text-sm text-muted">{site.district}</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted">
            {club.description ||
              `Chartered in ${club.established}, we are a youth service club serving the Pokhara community through health, education, and environment projects.`}
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-leo-violet">
            {club.motto}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted hover:text-leo-red">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Get in touch</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>{club.address}</li>
            <li>
              <a href={`mailto:${club.email}`} className="hover:text-leo-red">
                {club.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${club.phone.replace(/[^+\d]/g, "")}`}
                className="hover:text-leo-red"
              >
                {club.phone}
              </a>
            </li>
          </ul>
          {club.socials.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {club.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-muted hover:text-leo-red"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {social.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted">
        © {club.established}–present {club.name}. All rights reserved.
      </div>
    </footer>
  );
}
