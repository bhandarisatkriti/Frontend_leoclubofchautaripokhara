import Link from "next/link";
import { Logo } from "@/app/components/logo";
import { navLinks, site } from "@/app/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <Logo size={52} />
            <div>
              <p className="font-bold">{site.name}</p>
              <p className="text-sm text-muted">{site.district}</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted">
            Chartered in {site.established}, we are a youth service club serving the
            Pokhara community through health, education, and environment projects.
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-leo-violet">
            {site.motto}
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
            <li>{site.address}</li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-leo-red">
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="hover:text-leo-red">
                {site.phone}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-3 text-sm">
            <a href={site.socials.facebook} className="text-muted hover:text-leo-red" rel="noopener noreferrer" target="_blank">
              Facebook
            </a>
            <a href={site.socials.instagram} className="text-muted hover:text-leo-red" rel="noopener noreferrer" target="_blank">
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted">
        © {site.established}–present {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
