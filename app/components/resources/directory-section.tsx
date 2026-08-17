import { Container } from "@/app/components/ui/container";
import { Motif } from "@/app/components/ui/motif";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionLabel } from "@/app/components/ui/section-label";
import { stagger } from "@/app/lib/motion";
import { type DirectoryClub } from "@/app/lib/resources";

export function DirectorySection({ clubs }: { clubs: DirectoryClub[] }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#06142F_0%,#0A1F44_100%)] py-16 text-on-navy sm:py-20">
      <Motif variant="grid" tone="navy" className="opacity-20" />

      <Container size="narrow" className="relative">
        <Reveal className="text-center">
          <SectionLabel tone="cyan">Directory</SectionLabel>
          <h2 className="mt-2 text-h2 font-bold tracking-tight text-white">District Directory</h2>
          <p className="mx-auto mt-3 max-w-lg text-on-navy-muted">
            Clubs within our district network.
          </p>
        </Reveal>

        <div className="mt-10">
          {clubs.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center">
              <p className="text-sm text-on-navy-muted">
                No resources are available in this category yet.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {clubs.map((club, i) => (
                <Reveal
                  key={club.id}
                  delay={stagger(i)}
                  as="li"
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div>
                    <p className="font-semibold text-white">{club.name}</p>
                    <p className="mt-0.5 text-xs text-on-navy-muted">
                      {[club.district, club.location].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  {club.website && (
                    <a
                      href={club.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-leo-blue-light transition-colors hover:text-white"
                    >
                      View Details →
                    </a>
                  )}
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
