import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatEventDate, type LeoEvent } from "@/app/components/events/event-card";
import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { apiFetchOr, endpoints, mediaUrl } from "@/app/lib/api";

async function getEvent(id: string) {
  return apiFetchOr<LeoEvent | null>(`${endpoints.events}${id}/`, null, {
    revalidate: false,
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/events/[id]">): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);
  return event
    ? { title: event.title, description: event.description }
    : { title: "Event" };
}

export default async function EventDetailPage({
  params,
}: PageProps<"/events/[id]">) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  const image = mediaUrl(event.image);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative aspect-21/9 sm:aspect-3/1">
          {image ? (
            <Image src={image} alt={event.title} fill sizes="100vw" className="object-cover" priority />
          ) : (
            <Motif variant="waves" tone="blue" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
        </div>
        <Container className="absolute inset-x-0 bottom-0 pb-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
              {formatEventDate(event.date)}
            </p>
            <h1 className="mt-2 max-w-3xl text-h1 font-bold tracking-tight text-white">
              {event.title}
            </h1>
          </Reveal>
        </Container>
      </section>

      <Container size="narrow" className="py-16 sm:py-20">
        <Reveal>
          <Link
            href="/events"
            className="text-sm font-semibold text-leo-violet transition-colors duration-[var(--duration-fast)] hover:text-leo-violet-dark"
          >
            ← Back to events
          </Link>

          {event.location && (
            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-muted">
              {event.location}
            </p>
          )}
          <p className="mt-4 text-lead text-foreground">{event.description}</p>
        </Reveal>
      </Container>
    </>
  );
}
