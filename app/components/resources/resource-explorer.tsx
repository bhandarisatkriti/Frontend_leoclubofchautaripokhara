"use client";

import { useMemo, useState } from "react";
import { ResourceCard } from "@/app/components/resources/resource-card";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";
import { type Resource } from "@/app/lib/resources";

export function ResourceExplorer({ resources }: { resources: Resource[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(resources.map((r) => r.category).filter((c): c is string => Boolean(c))),
      ),
    [resources],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesCategory = !activeCategory || resource.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        resource.title.toLowerCase().includes(q) ||
        (resource.description ?? "").toLowerCase().includes(q) ||
        (resource.category ?? "").toLowerCase().includes(q)
      );
    });
  }, [resources, query, activeCategory]);

  return (
    <>
      {/* Search */}
      <section className="bg-surface-blue py-12 sm:py-14">
        <Container size="narrow">
          <Reveal className="text-center">
            <SectionLabel>Explore</SectionLabel>
            <h2 className="mt-2 text-h3 font-bold tracking-tight">Find What You Need</h2>
          </Reveal>

          <Reveal className="mx-auto mt-6 max-w-md">
            <label htmlFor="resource-search" className="sr-only">
              Search resources
            </label>
            <div className="relative">
              <svg
                aria-hidden
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="resource-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search resources..."
                className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none transition-[border-color,box-shadow] duration-[var(--duration-fast)] focus:border-leo-blue focus:shadow-glow-blue"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-[linear-gradient(135deg,#06142F_0%,#0A1F44_100%)] py-7">
          <Container>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-[var(--duration-fast)] ${
                  activeCategory === null
                    ? "bg-leo-blue text-white shadow-soft-sm"
                    : "border border-white/15 text-on-navy-muted hover:border-white/40 hover:text-white"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-[var(--duration-fast)] ${
                    activeCategory === category
                      ? "bg-leo-blue text-white shadow-soft-sm"
                      : "border border-white/15 text-on-navy-muted hover:border-white/40 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Grid */}
      <section className="bg-surface-navy-soft py-16 sm:py-20">
        <Container>
          {filtered.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-on-navy-muted">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <p className="mt-4 text-sm text-on-navy-muted">
                {resources.length === 0
                  ? "No resources are available in this category yet."
                  : "No resources match your search."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((resource, i) => (
                <Reveal key={resource.id} delay={stagger(i, 70, 420)}>
                  <ResourceCard resource={resource} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
