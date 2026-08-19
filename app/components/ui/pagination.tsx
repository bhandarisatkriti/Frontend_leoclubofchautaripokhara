import Link from "next/link";

/**
 * Page navigation for a paginated index.
 *
 * Built from links rather than buttons, so it works without JavaScript, each
 * page is a real URL a reader can bookmark or share, and the server can render
 * the whole thing. `basePath` keeps it reusable for any listing; only the
 * `page` parameter is written, so nothing else in the query string is lost.
 */
export function Pagination({
  page,
  totalPages,
  basePath,
  className = "",
}: {
  page: number;
  totalPages: number;
  basePath: string;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const href = (target: number) =>
    target <= 1 ? basePath : `${basePath}?page=${target}`;

  const base =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-[0.8125rem] font-semibold transition-colors duration-[var(--duration-fast)]";

  return (
    <nav
      aria-label="Article pages"
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
    >
      <Step href={href(page - 1)} disabled={page <= 1} label="Previous">
        ←
      </Step>

      {pageWindow(page, totalPages).map((entry, i) =>
        entry === "gap" ? (
          <span
            key={`gap-${i}`}
            aria-hidden
            className="px-1 text-sm text-muted"
          >
            …
          </span>
        ) : entry === page ? (
          <span
            key={entry}
            aria-current="page"
            className={`${base} bg-leo-blue text-white shadow-soft-sm`}
          >
            {entry}
          </span>
        ) : (
          <Link
            key={entry}
            href={href(entry)}
            className={`${base} border border-border bg-background text-foreground hover:border-leo-blue/40 hover:text-leo-blue`}
          >
            {entry}
          </Link>
        ),
      )}

      <Step href={href(page + 1)} disabled={page >= totalPages} label="Next">
        →
      </Step>
    </nav>
  );
}

/**
 * A previous/next control. At either end it becomes a span rather than a
 * disabled link — a link to nowhere is still focusable and still followable.
 */
function Step({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const shape =
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 text-[0.8125rem] font-semibold transition-colors duration-[var(--duration-fast)]";

  if (disabled) {
    return (
      <span
        aria-disabled
        className={`${shape} border border-border/60 text-muted/50`}
      >
        <span aria-hidden>{children}</span>
        <span className="hidden sm:inline">{label}</span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      rel={label === "Next" ? "next" : "prev"}
      className={`${shape} border border-border bg-background text-foreground hover:border-leo-blue/40 hover:text-leo-blue`}
    >
      <span aria-hidden>{children}</span>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

/**
 * The page numbers to show: always the first and last, plus a window around
 * the current page, with gaps standing in for the rest. Without this a club
 * with a long archive would render a row of numbers wider than the screen.
 */
function pageWindow(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const entries: (number | "gap")[] = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(totalPages - 1, page + 1);

  if (from > 2) entries.push("gap");
  for (let n = from; n <= to; n += 1) entries.push(n);
  if (to < totalPages - 1) entries.push("gap");

  entries.push(totalPages);
  return entries;
}
