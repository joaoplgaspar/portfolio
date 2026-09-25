import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { sans, mono } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import Sweep from "@/components/fx/Sweep";
import SheetFrame from "@/components/sheet/SheetFrame";
import SheetHead from "@/components/sheet/SheetHead";
import SheetCursor from "@/components/sheet/SheetCursor";
import { THEME_SCRIPT } from "@/components/sheet/ThemeSwitch";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("title"), template: `%s — ${siteConfig.name}` },
    description: t("description"),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    keywords: [
      "front-end",
      "e-commerce",
      "Shopify",
      "headless",
      "React",
      "Next.js",
      "Shopify Hydrogen",
      "performance",
      "portfolio",
    ],
    icons: { icon: "/favicon-32x32.png" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      title: t("title"),
      description: t("description"),
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
            className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        <NextIntlClientProvider messages={messages}>
          <Sweep />
          <SheetFrame />
          <SheetHead />
          <SheetCursor />
          <main className="sheet">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
