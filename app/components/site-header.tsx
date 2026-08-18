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

  // On the homepage the hero runs up underneath, so the navigation rides the
  // photograph until the page scrolls.
  const overlay = pathname === "/" && !scrolled && !open;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      {/* Backdrop only once scrolled — never a solid block over the hero. */}
      <div
        aria-hidden
        className={`absolute inset-0 border-b transition-[opacity,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] ${
          overlay
            ? "border-transparent bg-transparent opacity-0"
            : "border-border bg-background/92 opacity-100 backdrop-blur-md"
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
              className={`pointer-events-none absolute -inset-1.5 rounded-full border transition-[transform,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-110 ${
                overlay ? "border-white/25" : "border-leo-blue/25"
              }`}
            />
          </span>
          <span className="leading-[1.15]">
            <span
              className={`block text-[13px] font-bold tracking-tight transition-colors duration-[var(--duration-base)] ${
                overlay ? "text-white" : "text-foreground"
              }`}
            >
              {site.shortName}
            </span>
            <span
              className={`block text-[9px] font-semibold uppercase tracking-[0.22em] transition-colors duration-[var(--duration-base)] ${
                overlay ? "text-leo-cyan" : "text-leo-blue"
              }`}
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
                  overlay
                    ? active
                      ? "text-leo-cyan"
                      : "text-white/75 hover:text-white"
                    : active
                      ? "text-leo-blue"
                      : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
                {/* Rule grows from the left on hover. */}
                <span
                  aria-hidden
                  className={`absolute -bottom-1.5 left-0 h-px w-full origin-left transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] ${
                    overlay ? "bg-leo-cyan" : "bg-leo-blue"
                  } ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                />
              </Link>
            );
          })}

          {joinLink && (
            <Link
              href={joinLink.href}
              className={`group relative ml-1 inline-flex items-center gap-4 overflow-hidden border px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-[var(--duration-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leo-cyan ${
                overlay
                  ? "border-white/30 text-white hover:border-leo-cyan"
                  : "border-leo-blue/40 text-leo-blue hover:border-leo-blue"
              }`}
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 bg-leo-blue transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:scale-x-100"
              />
              <span className="relative transition-colors duration-[var(--duration-base)] group-hover:text-white">
                {joinLink.label}
              </span>
              <span
                aria-hidden
                className="relative h-px w-5 bg-current transition-[width] duration-[var(--duration-base)] ease-[var(--ease-premium)] group-hover:w-8"
              />
            </Link>
          )}
        </nav>

        {/* ------------------------------------------------------ trigger --- */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={`relative ml-auto flex h-11 w-11 flex-col items-center justify-center gap-[5px] border transition-colors duration-[var(--duration-base)] lg:hidden ${
            open || !overlay ? "border-border" : "border-white/30"
          }`}
        >
          {[0, 1].map((bar) => (
            <span
              key={bar}
              aria-hidden
              className={`block h-px w-5 transition-[transform,background-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] ${
                open || !overlay ? "bg-foreground" : "bg-white"
              } ${
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
              <span aria-hidden className="h-px w-8 bg-current" />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
