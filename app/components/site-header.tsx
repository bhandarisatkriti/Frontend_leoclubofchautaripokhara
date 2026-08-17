"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/app/components/logo";
import { ButtonLink } from "@/app/components/ui/button-link";
import { navLinks } from "@/app/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);
  const eventsRef = useRef<HTMLDivElement | null>(null);

  // Close any open menus when navigation happens — adjusted during render
  // (rather than an effect) per https://react.dev/learn/you-might-not-need-an-effect.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
    setEventsOpen(false);
    setMobileEventsOpen(false);
  }

  const primaryLinks = navLinks.filter((link) => link.href !== "/join");
  const joinLink = navLinks.find((link) => link.href === "/join");

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (eventsRef.current && !eventsRef.current.contains(event.target as Node)) {
        setEventsOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setEventsOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background/90 backdrop-blur transition-[box-shadow,border-color,height] duration-[var(--duration-base)] ease-[var(--ease-premium)] ${
        scrolled ? "border-border shadow-soft-md" : "border-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center gap-2.5 px-4 transition-[height] duration-[var(--duration-base)] ease-[var(--ease-premium)] ${
          scrolled ? "h-14" : "h-16"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={38} />
          <span className="leading-tight">
            <span className="block text-[13px] font-bold tracking-tight sm:text-sm">
              Leo Club of Chautari Pokhara
            </span>
            <span className="block text-[10px] text-muted">LDC 325 J, Nepal</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {primaryLinks.map((link) =>
            link.children ? (
              <div key={link.href} ref={eventsRef} className="relative">
                <button
                  type="button"
                  onClick={() => setEventsOpen((v) => !v)}
                  onMouseEnter={() => setEventsOpen(true)}
                  aria-expanded={eventsOpen}
                  className={`group relative flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-[var(--duration-fast)] ${
                    isActive(link.href) ? "text-leo-blue" : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-[var(--duration-fast)] ${eventsOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  <span
                    aria-hidden
                    className={`absolute -bottom-0.5 left-3 right-3 h-0.5 origin-left scale-x-0 bg-leo-blue transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] ${
                      isActive(link.href) ? "scale-x-100" : "group-hover:scale-x-100"
                    }`}
                  />
                </button>

                <div
                  onMouseLeave={() => setEventsOpen(false)}
                  className={`absolute left-0 top-full mt-1 min-w-44 origin-top rounded-lg border border-border bg-background p-1.5 shadow-soft-lg transition-[opacity,transform] duration-[var(--duration-fast)] ease-[var(--ease-premium)] ${
                    eventsOpen
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0"
                  }`}
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-md px-3 py-2 text-sm text-muted transition-colors duration-[var(--duration-fast)] hover:bg-surface hover:text-foreground"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-[var(--duration-fast)] ${
                  isActive(link.href) ? "text-leo-blue" : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
                <span
                  aria-hidden
                  className={`absolute -bottom-0.5 left-3 right-3 h-0.5 origin-left scale-x-0 bg-leo-blue transition-transform duration-[var(--duration-base)] ease-[var(--ease-premium)] ${
                    isActive(link.href) ? "scale-x-100" : "group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ),
          )}

          {joinLink && (
            <ButtonLink href={joinLink.href} variant="primary" size="md" className="ml-2">
              {joinLink.label}
            </ButtonLink>
          )}
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative ml-auto flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden"
        >
          <span
            aria-hidden
            className={`absolute block h-0.5 w-5 bg-foreground transition-transform duration-[var(--duration-fast)] ease-[var(--ease-premium)] ${
              open ? "translate-y-0 rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            aria-hidden
            className={`absolute block h-0.5 w-5 bg-foreground transition-opacity duration-[var(--duration-fast)] ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            aria-hidden
            className={`absolute block h-0.5 w-5 bg-foreground transition-transform duration-[var(--duration-fast)] ease-[var(--ease-premium)] ${
              open ? "translate-y-0 -rotate-45" : "translate-y-1.5"
            }`}
          />
        </button>
      </div>

      <div
        className="grid transition-[grid-template-rows] duration-[var(--duration-base)] ease-[var(--ease-premium)] lg:hidden"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <nav className="border-t border-border bg-background px-4 pb-4">
            {primaryLinks.map((link) =>
              link.children ? (
                <div key={link.href}>
                  <button
                    type="button"
                    onClick={() => setMobileEventsOpen((v) => !v)}
                    aria-expanded={mobileEventsOpen}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium ${
                      isActive(link.href) ? "text-leo-blue" : "text-muted"
                    }`}
                  >
                    {link.label}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-[var(--duration-fast)] ${mobileEventsOpen ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-[var(--duration-fast)]"
                    style={{ gridTemplateRows: mobileEventsOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-md px-3 py-2 text-sm text-muted"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive(link.href) ? "text-leo-blue" : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}

            {joinLink && (
              <ButtonLink href={joinLink.href} variant="primary" size="md" className="mt-3 w-full">
                {joinLink.label}
              </ButtonLink>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
