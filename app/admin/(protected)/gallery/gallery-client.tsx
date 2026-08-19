"use client";

import { useEffect, useState } from "react";
import {
  ResourceManager,
  type ResourceConfig,
} from "@/app/components/admin/resource-manager";
import { Pill, Thumb } from "@/app/components/admin/cells";
import { adminApi } from "@/app/lib/admin/client";

type AdminCategory = Record<string, unknown> & {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_count: number;
};

type AdminPhoto = Record<string, unknown> & {
  id: number;
  title: string;
  image: string | null;
  description: string;
  category: { id: number; name: string; slug: string } | null;
  is_featured: boolean;
  display_order: number;
};

/**
 * Photos.
 *
 * `category_id` is the write field — the API returns the category as a nested
 * object, hence the `initial` reader — and its choices come from the albums
 * endpoint managed below, so a new album is selectable as soon as it is added.
 */
const photoConfig: ResourceConfig<AdminPhoto> = {
  path: "gallery",
  idKey: "id",
  singular: "photo",
  ordering: "display_order",
  pageSize: 16,
  labelOf: (row) => row.title,
  columns: [
    { key: "image", label: "Photo", render: (row) => <Thumb src={row.image} /> },
    { key: "title", label: "Title" },
    {
      key: "category",
      label: "Album",
      render: (row) =>
        row.category ? (
          <Pill tone="grey">{row.category.name}</Pill>
        ) : (
          <span className="text-admin-muted">Uncategorised</span>
        ),
    },
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
      name: "category_id",
      label: "Album / category",
      type: "select",
      optionsFrom: { path: "gallery/categories" },
      initial: (row) => (row.category as { id: number } | null)?.id ?? "",
      emptyLabel: "Uncategorised",
      hint: "Groups the photo on the public gallery page. Add albums below.",
    },
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
    category_id: "",
    display_order: 0,
    is_featured: false,
  },
};

/** Albums. Deleting one leaves its photos in place, just uncategorised. */
const categoryConfig: ResourceConfig<AdminCategory> = {
  // Categories are looked up by slug, and the endpoint is unpaginated.
  path: "gallery/categories",
  idKey: "slug",
  singular: "album",
  ordering: "name",
  searchable: false,
  labelOf: (row) => row.name,
  columns: [
    { key: "name", label: "Album" },
    {
      key: "description",
      label: "Description",
      render: (row) => (
        <span className="line-clamp-1 max-w-sm text-admin-muted">
          {row.description || "—"}
        </span>
      ),
    },
    { key: "image_count", label: "Photos" },
  ],
  fields: [
    { name: "name", label: "Album name", required: true },
    { name: "description", label: "Description", type: "textarea" },
  ],
  defaults: { name: "", description: "" },
};

export function GalleryClient() {
  // The album filter is data-driven, so it is built here rather than declared
  // in the static config above. The backend filters by slug — see
  // GalleryImageFilter in the Django project.
  const [albums, setAlbums] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await adminApi.get<
          AdminCategory[] | { results: AdminCategory[] }
        >("gallery/categories?ordering=name");
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data.results;
        setAlbums(list.map((item) => ({ value: item.slug, label: item.name })));
      } catch {
        // Leaves the album filter out; the table itself still works.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const config: ResourceConfig<AdminPhoto> = {
    ...photoConfig,
    filters: [
      ...(albums.length
        ? [{ param: "category", label: "Album", options: albums }]
        : []),
      {
        // `featured`, not `is_featured` — that is the query parameter the
        // backend filter declares, and an unknown one is silently ignored.
        param: "featured",
        label: "Featured",
        options: [
          { value: "true", label: "Featured only" },
          { value: "false", label: "Not featured" },
        ],
      },
    ],
  };

  return (
    <div className="space-y-10">
      <ResourceManager config={config} />

      <section className="space-y-4 border-t border-admin-border pt-8">
        <div>
          <h3 className="text-base font-bold tracking-tight">Albums</h3>
          <p className="mt-1 text-sm text-admin-muted">
            Albums group photos on the public gallery page, and are what the
            dropdown offers when you upload a photo.
          </p>
        </div>
        <ResourceManager config={categoryConfig} />
      </section>
    </div>
  );
}
