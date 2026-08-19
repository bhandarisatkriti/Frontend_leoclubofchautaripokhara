import Image from "next/image";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { site, welcomeMessage } from "@/app/lib/site";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/**
 * A welcome from the club's leadership.
 *
 * Centred rather than left-aligned like the other sections: this is one voice
 * addressing the reader directly, and centring is what marks it as a quotation
 * rather than another block of site copy. The portrait falls back to initials
 * so a missing photograph reads as deliberate instead of broken — see
 * `welcomeMessage.photo` in site.ts to add one.
 */
export function WelcomeMessage() {
  const { quote, body, name, role, photo } = welcomeMessage;

  return (
    <section className="bg-surface-blue py-20 sm:py-24">
      <Container size="narrow">
        <Reveal className="text-center">
          <h2 className="font-display text-[clamp(1.5rem,3.2vw,2.25rem)] font-bold leading-[1.2] tracking-tight text-balance text-leo-indigo">
            &ldquo;{quote}&rdquo;
          </h2>
          <p className="mt-6 text-[0.9375rem] leading-[1.9] text-muted">
            {body}
          </p>
        </Reveal>

        <Reveal delay={140} className="mt-10 text-center">
          <span className="relative mx-auto block h-20 w-20 overflow-hidden rounded-full bg-leo-indigo ring-4 ring-background">
            {photo ? (
              <Image
                src={photo}
                alt={name}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-xl font-bold text-white/85">
                {initials(name)}
              </span>
            )}
          </span>

          <p className="mt-4 font-bold tracking-tight">{name}</p>
          <p className="mt-1 text-sm uppercase tracking-[0.12em] text-muted">
            {role}
          </p>
          <p className="text-sm uppercase tracking-[0.12em] text-muted">
            {site.name}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
