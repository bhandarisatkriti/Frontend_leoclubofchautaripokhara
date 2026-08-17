import type { Metadata } from "next";
import { PageHeader } from "@/app/components/page-header";
import { site } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Who we are: ${site.name}, a youth service club under ${site.district}, chartered in ${site.established}.`,
};

const emblem = [
  {
    part: "The tree",
    meaning:
      "Growth and the environment — the community we help take root and flourish.",
  },
  {
    part: "The two figures",
    meaning:
      "Leos standing together in red and violet — nobody serves alone.",
  },
  {
    part: "The lion mark",
    meaning:
      "Our link to Lions Clubs International, the parent organisation of every Leo club.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About the club"
        description={`${site.name} is a youth-led service club operating under ${site.district}. We have been serving the Pokhara community since ${site.established}.`}
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight">Our story</h2>
            <p className="mt-4 text-muted">
              Chartered in {site.established}, the club brings together young
              people from Chautari and greater Pokhara who want to give their
              time to the place they come from. Every Leo year we plan and run
              service projects alongside our sponsoring Lions club, from blood
              donation drives to school support and clean-up campaigns.
            </p>
            <p className="mt-4 text-muted">
              Leo stands for <strong>Leadership</strong>, <strong>Experience</strong>,
              and <strong>Opportunity</strong> — the three things members take
              away from serving here, alongside the work itself.
            </p>

            <h2 className="mt-12 text-2xl font-bold tracking-tight">
              What our emblem means
            </h2>
            <dl className="mt-4 space-y-4">
              {emblem.map((item) => (
                <div
                  key={item.part}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <dt className="font-semibold">{item.part}</dt>
                  <dd className="mt-1 text-sm text-muted">{item.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border p-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
                At a glance
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-muted">Established</dt>
                  <dd className="font-semibold">{site.established}</dd>
                </div>
                <div>
                  <dt className="text-muted">District</dt>
                  <dd className="font-semibold">{site.district}</dd>
                </div>
                <div>
                  <dt className="text-muted">Motto</dt>
                  <dd className="font-semibold uppercase tracking-widest text-leo-red">
                    {site.motto}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Based in</dt>
                  <dd className="font-semibold">{site.address}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
