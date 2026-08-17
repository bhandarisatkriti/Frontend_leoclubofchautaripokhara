"use client";

import {
  ResourceManager,
  type ResourceConfig,
} from "@/app/components/admin/resource-manager";
import { Pill, Thumb } from "@/app/components/admin/cells";

type AdminPhoto = Record<string, unknown> & {
  id: number;
  title: string;
  image: string | null;
  description: string;
  is_featured: boolean;
  display_order: number;
};

const config: ResourceConfig<AdminPhoto> = {
  path: "gallery",
  idKey: "id",
  singular: "photo",
  ordering: "display_order",
  pageSize: 16,
  labelOf: (row) => row.title,
  filters: [
    {
      param: "is_featured",
      label: "Featured",
      options: [
        { value: "true", label: "Featured only" },
        { value: "false", label: "Not featured" },
      ],
    },
  ],
  columns: [
    { key: "image", label: "Photo", render: (row) => <Thumb src={row.image} /> },
    { key: "title", label: "Title" },
    {
      key: "description",
      label: "Caption",
      render: (row) => (
        <span className="line-clamp-2 max-w-sm text-admin-muted">
          {row.description || "—"}
        </span>
      ),
    },
    { key: "display_order", label: "Order" },
    {
      key: "is_featured",
      label: "Featured",
      render: (row) =>
        row.is_featured ? <Pill tone="blue">Featured</Pill> : <span>—</span>,
    },
  ],
  fields: [
    { name: "title", label: "Title", required: true },
    {
      name: "display_order",
      label: "Display order",
      type: "number",
      hint: "Lower numbers appear first.",
    },
    {
      name: "description",
      label: "Caption / description",
      type: "textarea",
      hint: "Shown on hover in the public gallery.",
    },
    { name: "image", label: "Photo", type: "image", required: true },
    { name: "is_featured", label: "Feature on the homepage strip", type: "checkbox" },
  ],
  defaults: {
    title: "",
    description: "",
    display_order: 0,
    is_featured: false,
  },
};

export function GalleryClient() {
  return <ResourceManager config={config} />;
}
