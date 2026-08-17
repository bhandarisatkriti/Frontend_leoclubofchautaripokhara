import Image from "next/image";
import { Container } from "@/app/components/ui/container";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { mediaUrl } from "@/app/lib/api";
import { stagger } from "@/app/lib/motion";
import { type Partner } from "@/app/lib/resources";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function PartnersSection({ partners }: { partners: Partner[] }) {
  return (
    <section className="bg-surface-blue py-16 sm:py-20">
      <Container>
        <Reveal className="text-center">
          <SectionLabel>Partners</SectionLabel>
          <h2 className="mt-2 text-h2 font-bold tracking-tight">Our Partners</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">
            Organisations and sponsors who help make our projects possible.
          </p>
        </Reveal>

        <div className="mt-10">
          {partners.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-border px-6 py-14 text-center">
              <p className="text-sm text-muted">
                Our partner organisations will be listed here as they are added.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {partners.map((partner, i) => {
                const logo = mediaUrl(partner.logo);
                const card = (
                  <>
                    <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border bg-background shadow-soft-sm">
                      {logo ? (
                        <Image
                          src={logo}
                          alt={partner.name}
                          fill
                          sizes="64px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <span className="text-sm font-bold text-leo-blue">{initials(partner.name)}</span>
                      )}
                    </span>
                    <p className="mt-3 text-sm font-semibold">{partner.name}</p>
                    {partner.description && (
                      <p className="mt-1 text-xs leading-snug text-muted">{partner.description}</p>
                    )}
                  </>
                );

                return (
                  <Reveal
                    key={partner.id}
                    delay={stagger(i)}
                    className="flex flex-col items-center rounded-2xl border border-border bg-background p-6 text-center shadow-soft-sm transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:shadow-soft-md"
                  >
                    {partner.website ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center"
                      >
                        {card}
                      </a>
                    ) : (
                      card
                    )}
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
