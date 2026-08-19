import Image from "next/image";
import { SectionHeading } from "@/app/components/home/section-heading";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { getSiteImage, mediaUrl } from "@/app/lib/api";
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
 * Laid out as a portrait beside the words, on the same column and with the same
 * kicker-and-title heading as every other band. An earlier version centred the
 * whole thing in a narrower column, which made it read as a page of its own
 * dropped into the middle of this one — the quotation is still marked as a
 * quotation, but by the rule and the display face, not by breaking the grid.
 *
 * The portrait comes from the "welcome message portrait" slot under Website
 * Images, so it can be changed without a redeploy. It falls back to the file
 * named in site.ts, and then to the speaker's initials — a missing photograph
 * should read as deliberate rather than broken.
 */
export async function WelcomeMessage() {
  const { quote, body, name, role } = welcomeMessage;

  const uploaded = await getSiteImage("WELCOME_PORTRAIT");
  const photo = mediaUrl(uploaded?.image) ?? welcomeMessage.photo;
  const alt = uploaded?.alt_text?.trim() || name;

  return (
    <section className="bg-surface-blue py-20 sm:py-24">
      <Container>
        <SectionHeading
          label="A word from our leadership"
          title="Why we do this"
        />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-14">
          <Reveal direction="right" className="justify-self-center lg:justify-self-start">
            <div className="relative h-40 w-40 overflow-hidden rounded-2xl bg-leo-indigo shadow-soft-md ring-4 ring-background sm:h-48 sm:w-48">
              {photo ? (
                <Image
                  src={photo}
                  alt={alt}
                  fill
                  sizes="(max-width: 640px) 10rem, 12rem"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-4xl font-bold text-white/85">
                  {initials(name)}
                </span>
              )}
            </div>
          </Reveal>

          <Reveal direction="left" delay={100}>
            <blockquote>
              <p className="font-display text-[clamp(1.375rem,2.4vw,1.875rem)] font-bold leading-[1.3] tracking-tight text-balance text-leo-indigo">
                &ldquo;{quote}&rdquo;
              </p>
              <p className="mt-5 max-w-2xl text-[0.9375rem] leading-[1.85] text-muted">
                {body}
              </p>

              <footer className="mt-6 flex items-center gap-4">
                {/* The same accent rule the About section uses to tie a
                    heading to its copy, reused here as an attribution mark. */}
                <span
                  aria-hidden
                  className="h-1 w-10 shrink-0 rounded-full bg-linear-to-r from-leo-blue to-leo-indigo"
                />
                <span>
                  <span className="block text-sm font-bold tracking-tight text-foreground">
                    {name}
                  </span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    {role}, {site.name}
                  </span>
                </span>
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
