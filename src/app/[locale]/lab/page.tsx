import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import Container from "@/components/layout/Container";
import Reveal from "@/components/fx/Reveal";
import { lab } from "@/data/lab";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "lab" });
  return pageMeta({
    locale: locale as Locale,
    path: "/lab",
    title: t("title"),
    description: t("lede"),
  });
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations("lab");

  return (
    <Container className="pb-24 pt-32 md:pb-40 md:pt-40">
      <Reveal>
        <p className="text-label text-accent-lift">{t("eyebrow")}</p>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="text-display mt-4">{t("title")}</h1>
      </Reveal>
      <Reveal delay={140}>
        <p className="mt-4 max-w-xl text-lg text-muted">{t("lede")}</p>
      </Reveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lab.map((item, i) => (
          <Reveal key={i} delay={i * 70}>
            <div className="flex h-full flex-col rounded-[4px] border border-line bg-raised p-6 transition-colors hover:border-fg/30">
              <span className="text-label text-accent-lift">{item.tag}</span>
              <h3 className="text-h3 mt-3">{item.title[l]}</h3>
              <p className="mt-2 leading-relaxed text-muted">{item.desc[l]}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
