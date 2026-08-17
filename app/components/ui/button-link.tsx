import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "outline" | "dark" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition-[transform,box-shadow,background-color,color,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] " +
  "hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-xs uppercase tracking-wide",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-linear-to-br from-leo-violet to-leo-blue text-white shadow-soft-sm hover:shadow-glow-blue focus-visible:ring-leo-blue",
  secondary:
    "bg-surface-navy text-white shadow-soft-sm hover:bg-surface-navy-soft hover:shadow-glow-blue focus-visible:ring-leo-blue",
  outline:
    "border border-leo-blue/25 bg-transparent text-foreground hover:border-leo-blue hover:text-leo-blue focus-visible:ring-leo-blue",
  dark: "bg-white text-leo-charcoal shadow-soft-sm hover:bg-white/90 focus-visible:ring-white",
  ghost:
    "bg-transparent text-current underline decoration-current/30 underline-offset-4 hover:decoration-current focus-visible:ring-current",
};

/** Shared class recipe, exported so plain <button> elements (e.g. ApiForm's submit) match ButtonLink exactly. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
) {
  return `${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim();
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  withArrow = false,
  className = "",
  children,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
      {withArrow && (
        <span
          aria-hidden
          className="inline-block transition-transform duration-[var(--duration-fast)] ease-[var(--ease-premium)] group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </Link>
  );
}
