import type { MetadataRoute } from "next";
import { fetchPublishedProjects } from "@/data/projects";
import { siteConfig } from "@/lib/site";
import { visibleStores } from "@/data/stores";

// /lab fica fora até ter experimento rodando de verdade.
const PATHS = ["/", "/about", "/contact"];

// Acompanha o ISR das páginas: projeto novo no /admin entra no sitemap sem redeploy.
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await fetchPublishedProjects();
  const all = [
    ...PATHS,
    "/projects",
    ...visibleStores().map((s) => `/projects/${s.slug}`),
    ...projects.map((p) => `/work/${p.slug}`),
  ];

  return all.map((path) => {
    const suffix = path === "/" ? "" : path;
    const enUrl = `${siteConfig.url}${suffix}`;
    const ptUrl = `${siteConfig.url}/pt${suffix}`;
    return {
      url: enUrl,
      alternates: { languages: { en: enUrl, pt: ptUrl } },
    };
  });
}
