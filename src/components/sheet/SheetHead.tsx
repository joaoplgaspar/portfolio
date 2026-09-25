"use client";

import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(false);

  const current = (href: string) =>
    href === "/"
      ? pathname === "/" || pathname.startsWith("/trabalho")
      : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const langs = (
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
  );

  const theme = <ThemeSwitch labels={{ light: t("light"), dark: t("dark"), aria: t("theme") }} />;

  return (
    <header className="sheet-head t-small">
      <Link href="/" className="truncate" onClick={() => setOpen(false)}>
        <span className="sm:hidden">J.P. Gaspar</span>
        <span className="hidden sm:inline">{siteConfig.name}</span>
      </Link>

      {/* desktop */}
      <nav className="hidden items-center gap-7 md:flex" aria-label={t("aria")}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="nav-link" aria-current={current(l.href) ? "page" : undefined}>
            {t(l.key)}
          </Link>
        ))}
        <span aria-hidden className="h-4 w-px bg-line" />
        {theme}
        {langs}
      </nav>

      {/* celular: tema sempre à mão, links num menu */}
      <div className="flex items-center gap-4 md:hidden">
        {theme}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="sheet-menu"
          onClick={() => setOpen((v) => !v)}
          className="border border-fg px-2 py-1"
        >
          {open ? t("close") : t("menu")}
        </button>
      </div>
      {open && (
        <nav
          id="sheet-menu"
          aria-label={t("aria")}
          className="absolute top-full right-0 left-0 flex flex-col gap-4 border-b border-fg bg-[var(--bg)] px-[var(--gut)] py-6 md:hidden"
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              aria-current={current(l.href) ? "page" : undefined}
              className="t-title"
            >
              {t(l.key)}
            </Link>
          ))}
          <div className="pt-2">{langs}</div>
        </nav>
      )}
    </header>
  );
}
