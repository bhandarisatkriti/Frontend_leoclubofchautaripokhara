export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="h-1 w-14 rounded-full bg-linear-to-r from-leo-red to-leo-violet" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-muted">{description}</p>
        )}
      </div>
    </section>
  );
}

/** Shown where backend content will appear once the API is wired up. */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted">
      {message}
    </div>
  );
}
