import Container from "@/components/layout/Container";
import { siteConfig } from "@/lib/site";

/** Footer rico — substitui a página de contato. E-mail grande é o CTA da casa. */
export default async function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="mt-24 border-t border-line md:mt-40">
      <Container className="py-16 md:py-24">
        <a
          href={`mailto:${siteConfig.email}`}
          className="block break-all font-display text-[clamp(1.9rem,6vw,4.5rem)] font-semibold tracking-tight transition-colors hover:text-accent-lift"
        >
          {siteConfig.email}
        </a>

        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-label">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-fg"
            >
              GitHub
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-fg"
            >
              LinkedIn
            </a>
            {siteConfig.social.behance && (
              <a
                href={siteConfig.social.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-fg"
              >
                Behance
              </a>
            )}
          </div>
          <p className="font-mono text-sm text-stone-400">{siteConfig.stack}</p>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-line pt-6 text-label text-muted">
          <span>{siteConfig.location}</span>
          <span>
            © {year} {siteConfig.name}
          </span>
        </div>
      </Container>
    </footer>
  );
}
