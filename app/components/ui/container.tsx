const sizeClasses = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

export function Container({
  size = "default",
  className = "",
  children,
}: {
  size?: keyof typeof sizeClasses;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mx-auto px-4 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}
