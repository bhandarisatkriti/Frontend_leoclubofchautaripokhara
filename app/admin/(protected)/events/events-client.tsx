"use client";

import {
  ResourceManager,
  type ResourceConfig,
} from "@/app/components/admin/resource-manager";
import { Pill, dateOnly } from "@/app/components/admin/cells";
import { EventPhotosButton } from "@/app/admin/(protected)/events/event-photos";

type AdminEvent = Record<string, unknown> & {
  id: number;
  slug: string;
  title: string;
  event_date: string;
  location: string;
  is_published: boolean;
  is_featured: boolean;
};

const config: ResourceConfig<AdminEvent> = {
  path: "events",
  // EventViewSet uses lookup_field = "slug", so detail URLs are /events/<slug>/.
  idKey: "slug",
  singular: "event",
  ordering: "-event_date",
  labelOf: (row) => row.title,
  // Photographs are separate records pointing at the event, so they get their
  // own panel rather than a field on the form — and the event has to exist
  // before anything can point at it.
  rowAction: (row) => (
    <EventPhotosButton eventId={row.id} eventTitle={row.title} />
  ),
  filters: [
    {
      param: "is_published",
      label: "Status",
      options: [
        { value: "true", label: "Published" },
        { value: "false", label: "Draft" },
      ],
    },
  ],
  columns: [
    { key: "title", label: "Event" },
    { key: "event_date", label: "Date", render: (row) => dateOnly(row.event_date) },
    { key: "location", label: "Location", render: (row) => row.location || "—" },
    {
      key: "is_published",
      label: "Status",
      render: (row) => (
        <div className="flex flex-wrap gap-1.5">
          <Pill tone={row.is_published ? "green" : "grey"}>
            {row.is_published ? "Published" : "Draft"}
          </Pill>
          {row.is_featured && <Pill tone="blue">Featured</Pill>}
        </div>
      ),
    },
  ],
  fields: [
    { name: "title", label: "Event title", required: true },
    { name: "event_date", label: "Date", type: "date", required: true },
    { name: "start_time", label: "Start time", type: "time" },
    { name: "end_time", label: "End time", type: "time" },
    { name: "location", label: "Location" },
    { name: "organizer", label: "Organizer" },
    {
      name: "short_description",
      label: "Short description",
      type: "textarea",
      hint: "One or two lines, shown on event cards.",
    },
    { name: "description", label: "Full description", type: "textarea" },
    {
      name: "featured_image",
      label: "Featured image",
      type: "image",
      hint: "The single photo used on cards and at the top of the event page. For a set of photographs, save the event and use its Photos button.",
    },
    {
      name: "registration_url",
      label: "Registration link",
      type: "url",
      placeholder: "https://…",
    },
    {
      name: "registration_deadline",
      label: "Registration deadline",
      type: "date",
    },
    { name: "registration_required", label: "Registration required", type: "checkbox" },
    {
      name: "upcoming_override",
      label: "Upcoming or past",
      type: "select",
      options: [
        { value: "true", label: "Upcoming" },
        { value: "false", label: "Past" },
      ],
      emptyLabel: "Decide from the date (recommended)",
      hint: "Only override when the date gets it wrong — an event pinned to Upcoming stays there even after its date passes.",
      initial: (row) =>
        row.upcoming_override === null || row.upcoming_override === undefined
          ? ""
          : String(row.upcoming_override),
    },
    { name: "is_published", label: "Published (visible publicly)", type: "checkbox" },
    { name: "is_featured", label: "Featured on the homepage", type: "checkbox" },
  ],
  defaults: {
    title: "",
    event_date: "",
    start_time: "",
    end_time: "",
    location: "",
    organizer: "",
    short_description: "",
    description: "",
    registration_url: "",
    registration_deadline: "",
    registration_required: false,
    is_published: true,
    is_featured: false,
  },
};

export function EventsClient() {
  return <ResourceManager config={config} />;
}
