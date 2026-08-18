import Link from "next/link";
import { Reveal } from "@/app/components/ui/reveal";

/**
 * One heading treatment for every homepage section.
 *
 * The page previously gave each section its own arrangement of label, title
 * and link, which is most of why it read as unrelated blocks rather than one
 * document. Routing them all through this keeps the rhythm identical: kicker,
 * title, one line of context, and the onward link parked on the same baseline.
 */
export function SectionHeading({
  label,
  title,
  description,
  action,
  tone = "blue",
}: {
  label: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  tone?: "blue" | "cyan";
}) {
  return (
    <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
      <div className="max-w-2xl">
        <p
          className={`section-label ${tone === "cyan" ? "text-leo-cyan" : "text-leo-blue"}`}
        >
          {label}
        </p>
        <h2 className="mt-3 text-h2 font-bold tracking-tight text-balance">{title}</h2>
        {description && <p className="mt-3 max-w-xl text-muted">{description}</p>}
      </div>

      {action && (
        <Link
          href={action.href}
          className="group inline-flex items-center gap-3 pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-leo-blue"
        >
          {action.label}
        </Link>
      )}
    </Reveal>
  );
}
