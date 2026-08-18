import Link from "next/link";
import { solidBlueButton } from "@/app/components/ui/button-link";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";
import { HeroBackground } from "@/app/components/home/hero-background";

/**
 * Homepage hero. Copy comes from the club profile (Admin -> Website content)
 * and falls back to the club's reference wording when a field is blank, so the
 * hero always reads properly even before the profile is filled in.
 */
export function Hero({
  heading,
  description,
}: {
  heading?: string | null;
  description?: string | null;
} = {}) {
  return (
    <section className="relative min-h-[560px] overflow-hidden pb-16 pt-10 sm:min-h-[640px] sm:pb-20 sm:pt-14 lg:min-h-[720px] lg:pb-24">
      <HeroBackground />

      <Container className="relative flex min-h-[480px] flex-col justify-center text-left sm:min-h-[560px] lg:min-h-[640px]">
        <Reveal delay={stagger(0, 100)} distance={16}>
          <p className="section-label text-leo-blue-light">{site.district}</p>
        </Reveal>

        <Reveal delay={stagger(1, 100)} distance={24}>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[1.05] tracking-tight text-balance text-white">
            {heading || "Leadership, Experience, Opportunity"}
          </h1>
        </Reveal>

        <Reveal delay={stagger(2, 100)}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-on-navy-muted sm:text-lg">
            {description ||
              `Unlock your potential with the ${site.name}. Develop leadership skills, gain hands-on experience, and seize global opportunities — all while making a real difference. Join us and start your journey today!`}
          </p>
        </Reveal>

        <Reveal delay={stagger(3, 100)}>
          <div className="mt-10">
            <Link href="/about" className={solidBlueButton}>
              Learn More
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
