"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/events", label: "List" },
  { href: "/events/calendar", label: "Calendar" },
];

export function ViewTabs() {
  const pathname = usePathname();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-[var(--duration-fast)] ${
              active ? "bg-leo-blue text-white shadow-soft-sm" : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
