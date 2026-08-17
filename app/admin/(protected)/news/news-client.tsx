"use client";

import {
  ResourceManager,
  type ResourceConfig,
} from "@/app/components/admin/resource-manager";
import { Pill, dateTime } from "@/app/components/admin/cells";

type AdminArticle = Record<string, unknown> & {
  id: number;
  slug: string;
  title: string;
  published_at: string | null;
  is_published: boolean;
  is_featured: boolean;
  byline: string;
};

const config: ResourceConfig<AdminArticle> = {
  path: "articles",
  // ArticleViewSet uses lookup_field = "slug".
  idKey: "slug",
  singular: "article",
  ordering: "-published_at",
  labelOf: (row) => row.title,
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
    { key: "title", label: "Article" },
    { key: "byline", label: "Author", render: (row) => row.byline || "—" },
    {
      key: "published_at",
      label: "Published",
      render: (row) => dateTime(row.published_at),
    },
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
    { name: "title", label: "Title", required: true, full: true },
    {
      name: "excerpt",
      label: "Short description",
      type: "textarea",
      hint: "Shown on article cards and in search results.",
    },
    { name: "content", label: "Full content", type: "textarea", required: true },
    { name: "featured_image", label: "Featured image", type: "image" },
    {
      name: "author_name",
      label: "Author name",
      hint: "Overrides the signed-in account's name on the byline.",
    },
    {
      name: "published_at",
      label: "Publish date",
      type: "date",
      hint: "Leave blank to use the moment it is first published.",
    },
    { name: "is_published", label: "Published (visible publicly)", type: "checkbox" },
    { name: "is_featured", label: "Featured on the homepage", type: "checkbox" },
  ],
  defaults: {
    title: "",
    excerpt: "",
    content: "",
    author_name: "",
    published_at: "",
    is_published: true,
    is_featured: false,
  },
};

export function NewsClient() {
  return <ResourceManager config={config} />;
}
