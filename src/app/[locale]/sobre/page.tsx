import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import Container from "@/components/layout/Container";
import Reveal from "@/components/fx/Reveal";
import { about } from "@/data/about";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMeta({
    locale: l,
    path: "/sobre",
    title: t("eyebrow"),
    description: about.paragraphs[l][0],
  });
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
        <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(2.5rem,6vw,4.8rem)] font-semibold leading-[0.95] tracking-tight text-balance">
          {t("title")}
        </h1>
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
            <p className="mt-2 font-mono text-sm text-stone-400">
              {about.interests[l]}
            </p>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}
