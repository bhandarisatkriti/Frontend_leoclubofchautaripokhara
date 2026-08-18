"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/app/components/logo";
import { navLinks, site } from "@/app/lib/site";

/**
 * Navigation composed into the page rather than sitting on it.
 *
 * There is no bar: the brand mark anchors the left, the links sit as plain
 * lettering with a rule that grows on hover, and the CTA closes the right. Over the homepage
 * hero the whole thing is transparent so it reads as part of the composition;
 * elsewhere — and once scrolled — a light surface slides in behind it.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Close the mobile sheet on navigation — adjusted during render rather than
  // in an effect (https://react.dev/learn/you-might-not-need-an-effect).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const primaryLinks = navLinks.filter((link) => link.href !== "/join");
  const joinLink = navLinks.find((link) => link.href === "/join");

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page while the mobile sheet is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      {/* The bar is navy on every route. It used to go transparent over the
          homepage hero, which meant the hero had to be pulled up underneath it
          by exactly the header's height — and any mismatch showed as a strip of
          white page background above the bar. A solid ground removes both the
          coupling and that failure. */}
      <div
        aria-hidden
        className={`absolute inset-0 border-b border-white/10 bg-surface-navy transition-shadow duration-[var(--duration-base)] ${
          scrolled ? "shadow-soft-lg" : ""
        }`}
      />

      <div className="relative mx-auto flex max-w-[92rem] items-center gap-6 px-6 py-5 sm:px-10 lg:px-16">
        {/* ------------------------------------------------------- brand --- */}
        <Link href="/" className="hero-rise group flex items-center gap-3.5">
          <span className="relative">
            <Logo size={46} />
            {/* Hairline ring that opens on hover — the mark's own accent. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-1.5 rounded-full border border-white/25 transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-110"
            />
          </span>
          <span className="leading-[1.15]">
            <span
              className="block text-[13px] font-bold tracking-tight text-white"
            >
              {site.shortName}
            </span>
            <span
              className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-leo-cyan"
            >
              Est. {site.established}
            </span>
          </span>
        </Link>

        {/* -------------------------------------------------------- links --- */}
        <nav className="ml-auto hidden items-center gap-7 lg:flex xl:gap-9">
          {primaryLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`group relative text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors duration-[var(--duration-fast)] ${
                  active ? "text-leo-cyan" : "text-white/75 hover:text-white"
                }`}
              >
                {link.label}
                {/* Rule grows from the left on hover. */}
                <span
                  aria-hidden
                  className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-leo-cyan transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}

          {joinLink && (
            <Link
              href={joinLink.href}
              className="group relative ml-1 inline-flex items-center overflow-hidden border border-white/30 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors duration-[var(--duration-base)] hover:border-leo-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-cyan"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 bg-leo-blue transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-x-100"
              />
              <span className="relative transition-colors duration-[var(--duration-base)] group-hover:text-white">
                {joinLink.label}
              </span>
            </Link>
          )}
        </nav>

        {/* ------------------------------------------------------ trigger --- */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="relative ml-auto flex h-11 w-11 flex-col items-center justify-center gap-[5px] border border-white/30 transition-colors duration-[var(--duration-base)] lg:hidden"
        >
          {[0, 1].map((bar) => (
            <span
              key={bar}
              aria-hidden
              className={`block h-px w-5 bg-white transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] ${
                open
                  ? bar === 0
                    ? "translate-y-[3px] rotate-45"
                    : "-translate-y-[3px] -rotate-45"
                  : ""
              }`}
            />
          ))}
        </button>
      </div>

      {/* ------------------------------------------------ mobile sheet ------ */}
      <div
        className={`fixed inset-0 top-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-surface-navy transition-opacity duration-[var(--duration-base)] ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <nav className="relative flex h-full flex-col justify-center px-8">
          {primaryLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block border-b border-white/10 py-5 font-display text-[2rem] leading-none tracking-tight transition-[opacity,transform] ease-[var(--ease-premium)] ${
                isActive(link.href) ? "text-leo-cyan" : "text-white"
              } ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
              style={{ transitionDelay: open ? `${80 + i * 55}ms` : "0ms" }}
            >
              {link.label}
            </Link>
          ))}

          {joinLink && (
            <Link
              href={joinLink.href}
              className={`mt-9 inline-flex items-center justify-between border border-leo-cyan/50 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-leo-cyan transition-[opacity,transform] ease-[var(--ease-premium)] ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? "440ms" : "0ms" }}
            >
              {joinLink.label}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
