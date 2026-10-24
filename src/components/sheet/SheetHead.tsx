"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import JpgMark from "@/components/brand/JpgMark";
import ThemeSwitch from "./ThemeSwitch";

const LINKS = [
  { href: "/", key: "work" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/resume", key: "resume" },
  { href: "/contact", key: "contact" },
] as const;

export default function SheetHead() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  const current = (href: string) =>
    href === "/"
      ? pathname === "/" || pathname.startsWith("/work")
      : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Rota nova (inclusive pela faixa de transição, que atrasa a troca): fecha.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Aberto, o menu cobre a página: ela não rola por baixo. Se a tela crescer
  // até o menu de desktop, ele fecha sozinho para não deixar a rolagem presa.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const wide = window.matchMedia("(min-width: 768px)");
    const onWide = () => wide.matches && setOpen(false);
    wide.addEventListener("change", onWide);
    return () => {
      root.style.overflow = prev;
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    toggle.current?.focus({ preventScroll: true });
  };

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
      {/* a marca senta na linha de base do nome; o -mb compensa as descendentes
          (j, p, g ocupam 20% da altura abaixo da linha) */}
      <Link href="/" className="flex min-w-0 items-baseline gap-3 text-fg" onClick={() => setOpen(false)}>
        <JpgMark className="h-[30px] w-auto shrink-0 -mb-[6px]" />
        <span className="sr-only truncate sm:not-sr-only">{siteConfig.name}</span>
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
          ref={toggle}
          type="button"
          aria-expanded={open}
          aria-controls="sheet-menu"
          onClick={() => setOpen((v) => !v)}
          className="min-w-[4.5rem] border border-fg px-2 py-1"
        >
          {open ? t("close") : t("menu")}
        </button>
      </div>
      {/* Sempre montado: abrir e fechar são a mesma transição (.sheet-menu no
          globals.css). Fechado, o inert tira os links do foco e do leitor. */}
      <nav id="sheet-menu" aria-label={t("aria")} data-open={open} inert={!open} className="sheet-menu md:hidden">
        <ol>
          {LINKS.map((l, i) => (
            <li key={l.href} className="menu-item border-b border-line" style={{ "--i": i } as CSSProperties}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={current(l.href) ? "page" : undefined}
                className="menu-link"
              >
                <span className="t-fig menu-num">{String(i + 1).padStart(2, "0")}</span>
                {t(l.key)}
              </Link>
            </li>
          ))}
        </ol>
        <div className="menu-item mt-auto flex flex-col gap-4 pt-6" style={{ "--i": LINKS.length } as CSSProperties}>
          {langs}
          {/* Segundo fechar, no alcance do polegar. */}
          <button type="button" data-menu-close onClick={close} className="ctl !h-12 w-full justify-center">
            {t("close")} ✕
          </button>
        </div>
      </nav>
    </header>
  );
}
