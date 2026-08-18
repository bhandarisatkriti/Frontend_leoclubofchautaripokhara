import Image from "next/image";

/** Small shared renderers for admin table cells. */

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function dateOnly(value: unknown): string {
  if (!value) return "—";
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.valueOf()) ? String(value) : dateFormatter.format(parsed);
}

export function dateTime(value: unknown): string {
  if (!value) return "—";
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.valueOf())
    ? String(value)
    : dateTimeFormatter.format(parsed);
}

type PillTone = "green" | "blue" | "amber" | "red" | "grey";

const pillTones: Record<PillTone, string> = {
  green: "border-emerald-300 bg-emerald-50 text-emerald-700",
  blue: "border-sky-300 bg-sky-50 text-sky-700",
  amber: "border-amber-300 bg-amber-50 text-amber-700",
  red: "border-red-300 bg-red-50 text-red-700",
  grey: "border-admin-border bg-admin-raised text-admin-muted",
};

export function Pill({
  tone = "grey",
  children,
}: {
  tone?: PillTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${pillTones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Thumb({ src, alt = "" }: { src: unknown; alt?: string }) {
  const url = typeof src === "string" && src ? src : null;
  return (
    <span className="relative block h-12 w-16 overflow-hidden rounded-md bg-admin-raised">
      {url && <Image src={url} alt={alt} fill sizes="64px" className="object-cover" />}
    </span>
  );
}
