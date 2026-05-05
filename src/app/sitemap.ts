import type { MetadataRoute } from "next";

import { featuredTemplates, useCasePages } from "@/lib/presets";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://presentation-room-session-timer.example.com";

  return Array.from(
    new Set([
      "",
      "/presentation-timer",
      "/speaker-timer",
      "/classroom-timer",
      "/workshop-timer",
      "/therapy-session-timer",
      "/coaching-session-timer",
      "/pricing",
      ...featuredTemplates.map((template) => `/templates/${template.slug}`),
      ...useCasePages.map((page) => `/${page.slug}`),
    ]),
  ).map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
