"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import LocaleSwitch from "@/components/i18n/LocaleSwitch";

const LINKS = [
  { href: "/", key: "work" },
  { href: "/lab", key: "lab" },
  { href: "/sobre", key: "about" },
] as const;

export default function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open
          ? "border-b border-line bg-bg/85 backdrop-blur"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="text-label tracking-[0.12em] text-fg"
          onClick={() => setOpen(false)}
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-label transition-colors hover:text-fg ${
                pathname === l.href ? "text-fg" : "text-muted"
              }`}
            >
              {t(l.key)}
            </Link>
          ))}
          <LocaleSwitch />
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="text-label text-fg md:hidden"
        >
          {open ? t("close") : t("menu")}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" className="border-t border-line bg-bg md:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 py-8">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-h3 text-fg"
              >
                {t(l.key)}
              </Link>
            ))}
            <div className="mt-2">
              <LocaleSwitch />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
