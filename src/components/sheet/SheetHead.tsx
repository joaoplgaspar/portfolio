"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import ThemeSwitch from "./ThemeSwitch";

const LINKS = [
  { href: "/", key: "work" },
  { href: "/projetos", key: "projects" },
  { href: "/sobre", key: "about" },
  { href: "/contato", key: "contact" },
] as const;

export default function SheetHead() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();

  const current = (href: string) =>
    href === "/" ? pathname === "/" || pathname.startsWith("/trabalho") : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sheet-head t-small">
      <Link href="/" className="truncate">
        <span className="sm:hidden">J.P. Gaspar</span>
        <span className="hidden sm:inline">{siteConfig.name}</span>
      </Link>
      <nav className="flex items-center gap-5 sm:gap-7" aria-label={t("aria")}>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="nav-link"
            aria-current={current(l.href) ? "page" : undefined}
          >
            {t(l.key)}
          </Link>
        ))}
        <span className="hidden sm:inline-flex">
          <ThemeSwitch labels={{ light: t("light"), dark: t("dark"), aria: t("theme") }} />
        </span>
        <span className="flex items-center gap-1.5" role="group" aria-label={t("language")}>
          {routing.locales.map((loc, i) => (
            <span key={loc} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden className="text-faint">/</span>}
              <button
                type="button"
                lang={loc}
                onClick={() => router.replace(pathname, { locale: loc })}
                aria-pressed={loc === locale}
                className={loc === locale ? "text-fg" : "text-faint hover:text-fg"}
              >
                {loc.toUpperCase()}
              </button>
            </span>
          ))}
        </span>
      </nav>
    </header>
  );
}
