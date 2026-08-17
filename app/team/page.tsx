import type { Metadata } from "next";
import Image from "next/image";
import { EmptyState, PageHeader } from "@/app/components/page-header";
import { apiFetchOr, endpoints, mediaUrl, type Paginated } from "@/app/lib/api";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the office bearers and members serving this Leo year.",
};

type Member = {
  id: number;
  name: string;
  position: string;
  photo: string | null;
  bio?: string | null;
};

export default async function TeamPage() {
  const data = await apiFetchOr<Paginated<Member> | Member[]>(
    endpoints.team,
    [],
  );
  const members = Array.isArray(data) ? data : data.results;

  return (
    <>
      <PageHeader
        title="Our team"
        description="The office bearers and members leading the club this Leo year."
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        {members.length === 0 ? (
          <EmptyState message="Team members will appear here once they are added in the Django admin." />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member) => {
              const photo = mediaUrl(member.photo);
              return (
                <li
                  key={member.id}
                  className="overflow-hidden rounded-xl border border-border bg-surface"
                >
                  <div className="relative aspect-square bg-linear-to-br from-leo-red/15 to-leo-violet/20">
                    {photo && (
                      <Image
                        src={photo}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="font-semibold">{member.name}</h2>
                    <p className="text-sm text-leo-violet">{member.position}</p>
                    {member.bio && (
                      <p className="mt-2 text-sm text-muted">{member.bio}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
