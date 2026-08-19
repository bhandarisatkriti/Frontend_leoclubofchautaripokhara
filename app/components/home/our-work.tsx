import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/app/components/page-header";
import { SectionHeading } from "@/app/components/home/section-heading";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { stagger } from "@/app/lib/motion";
import { ourWorkIntro } from "@/app/lib/site";

export type WorkPhoto = {
  id: number;
  src: string;
  title: string | null;
};

/**
 * A strip of photographs from the club's projects, linking on to the gallery.
 *
 * The pictures are the argument here — a row of faces at real events says more
 * about what the club does than another paragraph would, which is why the
 * standing description sits above them and nothing competes with them below.
 */
export function OurWork({ photos }: { photos: WorkPhoto[] }) {
  return (
    <section className="bg-surface-blue py-20 sm:py-24">
      <Container>
        <SectionHeading
          label="What we do"
          title="Our work"
          description={ourWorkIntro}
          action={{ href: "/gallery", label: "Explore more" }}
        />

        <div className="mt-12">
          {photos.length === 0 ? (
            <EmptyState message="Photographs will appear here once they are added to the gallery." />
          ) : (
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {photos.map((photo, i) => (
                <Reveal
                  key={photo.id}
                  as="li"
                  delay={stagger(i, 90)}
                  className="list-none h-full"
                >
                  <Link
                    href="/gallery"
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-soft-sm transition-[translate,box-shadow,border-color] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-leo-blue/30 hover:shadow-soft-md"
                  >
                    <div className="relative aspect-4/3 shrink-0 overflow-hidden">
                      <Image
                        src={photo.src}
                        alt={photo.title ?? ""}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-[scale] duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-[1.06]"
                      />
                    </div>
                    {photo.title && (
                      <p className="line-clamp-2 px-4 py-3 text-[0.8125rem] font-semibold leading-snug transition-colors duration-[var(--duration-fast)] group-hover:text-leo-blue">
                        {photo.title}
                      </p>
                    )}
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
