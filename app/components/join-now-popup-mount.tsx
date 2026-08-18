import { JoinNowPopup } from "@/app/components/join-now-popup";
import { getSiteImage } from "@/app/lib/api";
import { joinPopupConfig, type JoinPopupStat } from "@/app/lib/join-popup";
import { site } from "@/app/lib/site";

/**
 * Server half of the membership popup: resolves the things that come from the
 * backend before handing a plain, already-decided set of props to the client
 * component.
 *
 * The supporting image is whatever an administrator placed in the JOIN slot
 * (Admin -> Website images), falling back to the checked-in photo in the
 * config. Figures are the same real counts the homepage already fetched — no
 * invented numbers, and a count of zero is left out rather than shown.
 */
export async function JoinNowPopupMount({
  counts,
}: {
  counts?: { members?: number | null; events?: number | null; photos?: number | null };
}) {
  if (!joinPopupConfig.enabled) return null;

  const placed = await getSiteImage("JOIN");

  const stats: JoinPopupStat[] = [
    {
      label: "Years of service",
      value: new Date().getFullYear() - site.established,
    },
    { label: "Members", one: "Member", value: counts?.members ?? 0 },
    { label: "Events", one: "Event", value: counts?.events ?? 0 },
    { label: "Photos", one: "Photo", value: counts?.photos ?? 0 },
  ]
    .filter((stat) => stat.value > 0)
    .slice(0, 3);

  return (
    <JoinNowPopup
      config={joinPopupConfig}
      imageSrc={placed?.image ?? joinPopupConfig.imageSrc}
      imageAlt={
        placed?.alt_text || placed?.title || joinPopupConfig.imageAlt
      }
      stats={stats}
    />
  );
}
