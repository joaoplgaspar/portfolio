import { getTranslations } from "next-intl/server";
import Container from "@/components/layout/Container";
import { siteConfig } from "@/lib/site";

export default async function SiteFooter() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-12">
      <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <p className="text-label text-muted">
          © {year} {siteConfig.name}. {t("rights")}
        </p>
        <div className="flex items-center gap-6 text-label">
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-muted transition-colors hover:text-fg"
          >
            Email
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-fg"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-fg"
          >
            GitHub
          </a>
        </div>
      </Container>
    </footer>
  );
}
