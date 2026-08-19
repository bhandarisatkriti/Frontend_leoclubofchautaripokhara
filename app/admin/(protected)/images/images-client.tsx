"use client";

import {
  ResourceManager,
  type ResourceConfig,
} from "@/app/components/admin/resource-manager";
import { Pill, Thumb } from "@/app/components/admin/cells";

type AdminSiteImage = Record<string, unknown> & {
  id: number;
  title: string;
  image: string | null;
  alt_text: string;
  placement: string;
  placement_display: string;
  is_active: boolean;
  display_order: number;
};

/** Must match `SiteImagePlacement` on the backend. */
const placements = [
  { value: "HERO", label: "Homepage hero background" },
  { value: "ABOUT_PRIMARY", label: "About — main photo" },
  { value: "ABOUT_SECONDARY", label: "About — second photo" },
  { value: "ABOUT_TERTIARY", label: "About — third photo" },
  { value: "WELCOME_PORTRAIT", label: "Homepage — welcome message portrait" },
  { value: "JOIN", label: "Join page banner" },
  { value: "OTHER", label: "Other / unplaced" },
];

const config: ResourceConfig<AdminSiteImage> = {
  path: "site-images",
  idKey: "id",
  singular: "image",
  ordering: "placement",
  pageSize: 16,
  labelOf: (row) => row.title,
  filters: [
    { param: "placement", label: "Placement", options: placements },
    {
      param: "is_active",
      label: "Status",
      options: [
        { value: "true", label: "Live" },
        { value: "false", label: "Hidden" },
      ],
    },
  ],
  columns: [
    { key: "image", label: "Image", render: (row) => <Thumb src={row.image} alt={row.alt_text} /> },
    { key: "title", label: "Title" },
    {
      key: "placement_display",
      label: "Used on",
      render: (row) => <Pill tone="blue">{row.placement_display}</Pill>,
    },
    { key: "display_order", label: "Order" },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Pill tone={row.is_active ? "green" : "grey"}>
          {row.is_active ? "Live" : "Hidden"}
        </Pill>
      ),
    },
  ],
  fields: [
    { name: "title", label: "Title", required: true },
    {
      name: "placement",
      label: "Where it is used",
      type: "select",
      required: true,
      options: placements,
      hint: "The website renders the newest live image for each slot.",
    },
    {
      name: "alt_text",
      label: "Alt text",
      hint: "Describes the image for screen readers. Leave blank if decorative.",
    },
    {
      name: "display_order",
      label: "Display order",
      type: "number",
      hint: "Lower numbers win when a slot has several images.",
    },
    { name: "description", label: "Internal notes", type: "textarea" },
    { name: "image", label: "Image file", type: "image", required: true },
    { name: "is_active", label: "Live on the website", type: "checkbox" },
  ],
  defaults: {
    title: "",
    alt_text: "",
    description: "",
    placement: "HERO",
    display_order: 0,
    is_active: true,
  },
};

export function ImagesClient() {
  return <ResourceManager config={config} />;
}
