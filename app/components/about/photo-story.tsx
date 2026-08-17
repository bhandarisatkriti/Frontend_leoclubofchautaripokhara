import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";

const photos = [
  { src: "/images/gallery/district-parade.jpg", alt: "Leos marching with the district banner", caption: "Leo District 325 J parade", aspect: "aspect-[3/4]" },
  { src: "/images/gallery/joint-induction-ceremony.jpg", alt: "Leos on stage at the Joint Induction Ceremony", caption: "Joint Induction & Installation Ceremony", aspect: "aspect-square" },
  { src: "/images/gallery/district-installation-gorkha.jpg", alt: "Leos at the district installation ceremony in Gorkha", caption: "District Installation, Gorkha", aspect: "aspect-[4/5]" },
  { src: "/images/gallery/district-gathering.jpg", alt: "Leos at a district gathering", caption: "District gathering", aspect: "aspect-square" },
  { src: "/images/gallery/installation-handshake.jpg", alt: "A handshake moment at the Joint Induction ceremony", caption: "Installation ceremony", aspect: "aspect-[4/5]" },
  { src: "/images/gallery/district-address-1.jpg", alt: "A Leo addressing the room from the podium", caption: "Speaking at the Leo podium", aspect: "aspect-[3/4]" },
];

export function PhotoStory() {
  return (
    <section className="bg-[linear-gradient(135deg,#06142F_0%,#0A1F44_100%)] py-16 text-on-navy sm:py-24">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="cyan">Photo Story</SectionLabel>
            <h2 className="mt-3 text-h2 font-bold tracking-tight text-white">
              Our Journey in Pictures
            </h2>
          </div>
          <ButtonLink href="/gallery" variant="primary" size="sm" withArrow>
            Explore Our Gallery
          </ButtonLink>
        </Reveal>

        <div className="mt-12 columns-2 gap-4 sm:columns-3">
          {photos.map((photo, i) => (
            <Reveal key={photo.src} delay={stagger(i, 70, 400)} className="mb-4 break-inside-avoid">
              <Link
                href="/gallery"
                className={`group relative block w-full overflow-hidden rounded-2xl border border-white/10 shadow-soft-md ${photo.aspect}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-[1.05]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,20,47,0.75),transparent_55%)] opacity-70 transition-opacity duration-300 group-hover:opacity-95"
                />
                <span className="absolute inset-x-0 bottom-0 translate-y-1 p-3 text-xs font-semibold text-white opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {photo.caption}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
