"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";
import { TopBar } from "@/app/components/top-bar";

/**
 * Wraps public pages in the site header/footer and leaves `/admin` bare.
 *
 * The admin dashboard is a separate experience with its own full-height shell,
 * so it must not inherit the public chrome. The alternative — moving every
 * public route into an `app/(public)/` group — would rewrite the import path of
 * every colocated component for no behavioural gain, so the split is made here
 * instead. `children` is still server-rendered; only this wrapper is a client
 * component.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      {/* The contact strip is a homepage-only greeting: on inner pages it
          repeats what the footer already carries and pushes the content
          down for no gain. */}
      {pathname === "/" && <TopBar />}
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
