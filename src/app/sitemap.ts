import type { MetadataRoute } from "next";
import { getProjects } from "@/data/projects";
import { siteConfig } from "@/lib/site";

const PATHS = ["/", "/trabalho", "/sobre", "/lab", "/contato"];

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPaths = getProjects().map((p) => `/trabalho/${p.slug}`);
  const all = [...PATHS, ...projectPaths];

  return all.map((path) => {
    const suffix = path === "/" ? "" : path;
    const ptUrl = `${siteConfig.url}${suffix}`;
    const enUrl = `${siteConfig.url}/en${suffix}`;
    return {
      url: ptUrl,
      alternates: { languages: { pt: ptUrl, en: enUrl } },
    };
  });
}
