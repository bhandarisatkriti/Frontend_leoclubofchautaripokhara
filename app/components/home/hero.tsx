import Link from "next/link";
import { solidBlueButton } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";
import { HeroBackground } from "@/app/components/home/hero-background";

export function Hero() {
  return (
    <section className="relative min-h-[520px] overflow-hidden pb-14 pt-10 sm:min-h-[600px] sm:pb-16 sm:pt-12 lg:min-h-[680px] lg:pb-20">
      <HeroBackground />

      <Container className="relative flex min-h-[440px] flex-col justify-center text-center sm:min-h-[520px] lg:min-h-[600px]">
        <Reveal delay={stagger(0, 100)} distance={24}>
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight text-balance text-white">
            Leadership, Experience, Opportunity
          </h1>
        </Reveal>

        <Reveal delay={stagger(1, 100)}>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-on-navy-muted sm:text-lg">
            Unlock your potential with the {site.name}. Develop leadership
            skills, gain hands-on experience, and seize global opportunities —
            all while making a real difference. Join us and start your journey
            today!
          </p>
        </Reveal>

        <Reveal delay={stagger(2, 100)}>
          <div className="mt-9">
            <Link href="/about" className={solidBlueButton}>
              Learn More
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
