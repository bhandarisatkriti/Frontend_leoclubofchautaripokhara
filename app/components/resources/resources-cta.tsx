import { ButtonLink } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";

export function ResourcesCta() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(100deg,#06142F_0%,#1747C7_55%,#38BDF8_100%)] px-6 py-14 text-center text-white sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-float-slow rounded-full bg-white/10 blur-3xl"
          />
          <h2 className="relative text-h2 font-bold tracking-tight text-balance">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-white/85">
            Get in touch with Leo Club of Chautari Pokhara and we&apos;ll help
            guide you.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact" variant="dark" size="lg">
              Contact Us
            </ButtonLink>
            <ButtonLink
              href="/join"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:border-white/70 hover:bg-white/10 hover:text-white"
            >
              Join Leo Club
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
