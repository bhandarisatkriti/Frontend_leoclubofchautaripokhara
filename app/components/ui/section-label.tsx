const toneClasses = {
  blue: "text-leo-blue",
  violet: "text-leo-violet",
  cyan: "text-leo-cyan",
  navy: "text-on-navy-muted",
  red: "text-leo-red",
  green: "text-leo-green",
} as const;

export function SectionLabel({
  tone = "blue",
  className = "",
  children,
}: {
  tone?: keyof typeof toneClasses;
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={`section-label ${toneClasses[tone]} ${className}`}>{children}</p>;
}
