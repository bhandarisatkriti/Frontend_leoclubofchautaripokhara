import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/app/components/site-header";
import { SiteFooter } from "@/app/components/site-footer";
import { site } from "@/app/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: `${site.name} | ${site.district}`,
    template: `%s | ${site.shortName}`,
  },
  description: `${site.name} — a youth service club under ${site.district}, established ${site.established}. We work together to serve the Pokhara community.`,
  keywords: ["Leo Club", "Chautari", "Pokhara", "Nepal", "LDC 325 J", "youth service"],
  openGraph: {
    title: site.name,
    description: `${site.motto} — serving Pokhara since ${site.established}.`,
    siteName: site.name,
    locale: "en_NP",
    type: "website",
    images: ["/logo.png"],
  },
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
