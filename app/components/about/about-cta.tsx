import Image from "next/image";
import { ButtonLink } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";

export function AboutCta() {
  return (
    <section className="relative overflow-hidden py-20 text-center sm:py-28">
      <Image
        src="/images/gallery/district-address-2.jpg"
        alt="A Leo addressing the room"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,20,47,0.94)_0%,rgba(10,31,68,0.9)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-1/2 h-72 w-72 -translate-y-1/2 animate-float-slow rounded-full bg-leo-violet/15 blur-3xl"
      />

      <Container size="narrow" className="relative">
        <Reveal>
          <h2 className="text-h1 font-bold tracking-tight text-white text-balance">
            Your Journey Can Start Here.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lead text-on-navy-muted">
            Grow as a leader, serve your community, and become part of
            something meaningful.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/join" variant="primary" size="lg" withArrow>
              Join Leo Club
            </ButtonLink>
            <ButtonLink
              href="/events"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:border-white/70 hover:bg-white/10 hover:text-white"
            >
              View Events
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
