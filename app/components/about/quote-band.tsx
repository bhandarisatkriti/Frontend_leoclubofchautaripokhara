import Image from "next/image";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { site } from "@/app/lib/site";

export function QuoteBand() {
  return (
    <section className="relative overflow-hidden bg-surface-navy py-20 sm:py-28">
      <Image
        src="/images/gallery/district-gathering.jpg"
        alt="Leo Club of Chautari Pokhara members at a district gathering"
        fill
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,20,47,0.94)_0%,rgba(10,31,68,0.9)_100%)]"
      />

      <Container size="narrow" className="relative text-center">
        <Reveal>
          <svg aria-hidden width="40" height="32" viewBox="0 0 40 32" fill="currentColor" className="mx-auto text-leo-blue/40">
            <path d="M0 32V19.5Q0 10 5 5T18 0l1 4Q13 5 10 8.5T7 17h7v15H0Zm22 0V19.5Q22 10 27 5T40 0l1 4Q35 5 32 8.5T29 17h7v15H22Z" />
          </svg>
          <p className="mt-5 font-display text-2xl font-semibold leading-snug text-balance text-white sm:text-4xl">
            Leadership isn&apos;t about titles — it&apos;s about showing up and
            serving the community that shaped you.
          </p>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-leo-blue-light">
            {site.name}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
