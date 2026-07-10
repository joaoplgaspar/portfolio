"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import LocaleSwitch from "@/components/i18n/LocaleSwitch";

/** Cabeçalho minimal com estado ao scroll. Nav completa entra na Fase 1. */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-line bg-bg/80 backdrop-blur"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link href="/" className="text-label tracking-[0.12em] text-fg">
          {siteConfig.name}
        </Link>
        <LocaleSwitch />
      </div>
    </header>
  );
}
