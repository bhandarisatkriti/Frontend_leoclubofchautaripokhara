import { Container } from "@/app/components/ui/container";

export default function ResourcesLoading() {
  return (
    <>
      <section className="bg-[linear-gradient(135deg,#06142F_0%,#0A1F44_100%)] py-20 sm:py-28">
        <Container size="narrow" className="flex flex-col items-center gap-4">
          <div className="skeleton h-3 w-24 rounded-full" />
          <div className="skeleton h-10 w-full max-w-md rounded-lg" />
          <div className="skeleton h-4 w-full max-w-sm rounded-full" />
        </Container>
      </section>

      <section className="bg-surface-blue py-16">
        <Container className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[20px] border border-border bg-background p-6">
              <div className="skeleton h-11 w-11 rounded-xl" />
              <div className="skeleton mt-4 h-3 w-20 rounded-full" />
              <div className="skeleton mt-2 h-5 w-3/4 rounded-md" />
              <div className="skeleton mt-3 h-3 w-full rounded-full" />
              <div className="skeleton mt-1.5 h-3 w-2/3 rounded-full" />
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
