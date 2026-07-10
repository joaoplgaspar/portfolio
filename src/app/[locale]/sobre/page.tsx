import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import Container from "@/components/layout/Container";
import Reveal from "@/components/fx/Reveal";
import { btn } from "@/components/ui/button";
import { about } from "@/data/about";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("eyebrow") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations("about");

  return (
    <Container className="pb-24 pt-32 md:pb-40 md:pt-40">
      <Reveal>
        <p className="text-label text-accent-lift">{t("eyebrow")}</p>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="text-display mt-4 max-w-[18ch] text-balance">{t("title")}</h1>
      </Reveal>

      <div className="mt-14 grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div className="aspect-[4/5] w-full rounded-[4px] border border-line bg-raised" />
          <dl className="mt-6 overflow-hidden rounded-[4px] border border-line bg-raised">
            {about.facts.map((fct, i) => (
              <div
                key={i}
                className={`flex items-baseline justify-between gap-6 px-5 py-3 ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <dt className="text-label text-muted">{fct.label[l]}</dt>
                <dd className="font-mono text-sm text-fg">{fct.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="flex flex-col gap-6">
          {about.paragraphs[l].map((p, i) => (
            <Reveal key={i} delay={i * 60}>
              <p className="text-lg leading-relaxed text-muted">{p}</p>
            </Reveal>
          ))}
          <Reveal delay={200}>
            <Link href="/contato" className={`${btn("primary")} mt-4 self-start`}>
              {t("cta")}
            </Link>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}
