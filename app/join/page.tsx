import type { Metadata } from "next";
import { MembershipForm } from "@/app/components/membership-form";
import { Reveal } from "@/app/components/ui/reveal";
import { stagger } from "@/app/lib/motion";
import { site } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Join",
  description: `Join ${site.name} — membership is open to young people aged 12–30 in and around Pokhara.`,
};

/**
 * The application is the whole page: no page header above it and no supporting
 * cards below, so nothing competes with the form itself.
 */
export default function JoinPage() {
  return (
    <section className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-14">
      <Reveal delay={stagger(0)}>
        <MembershipForm />
      </Reveal>
    </section>
  );
}
