import type { Metadata } from "next";
import { ContactClient } from "@/app/admin/(protected)/contact/contact-client";
import { MessageInbox } from "@/app/admin/(protected)/contact/message-inbox";

export const metadata: Metadata = { title: "Contact" };

/**
 * Two things share this screen because they are the same subject from either
 * side: the details the club publishes, and the messages that come back.
 */
export default function Page() {
  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Messages received</h2>
          <p className="mt-1 text-sm text-admin-muted">
            Everything sent through the public contact form. Opening a new
            message marks it as read.
          </p>
        </div>
        <MessageInbox />
      </section>

      <section className="space-y-6 border-t border-admin-border pt-10">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Contact information</h2>
          <p className="mt-1 text-sm text-admin-muted">
            These details feed the top bar, footer and contact page. Nothing
            here is hardcoded in the frontend.
          </p>
        </div>
        <ContactClient />
      </section>
    </div>
  );
}
