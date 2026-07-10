import { getTranslations, setRequestLocale } from "next-intl/server";
import Container from "@/components/layout/Container";
import Reveal from "@/components/fx/Reveal";
import { siteConfig } from "@/lib/site";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const f = await getTranslations("foundation");

  return (
    <Container className="flex min-h-screen flex-col justify-center py-32">
      <Reveal>
        <p className="text-label text-accent-lift">{t("eyebrow")}</p>
      </Reveal>

      <Reveal delay={80}>
        <h1 className="text-display-xl mt-6 max-w-[14ch] text-balance">
          {t("headline")}
        </h1>
      </Reveal>

      <Reveal delay={160}>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
          {t("lede")}
        </p>
      </Reveal>

      <Reveal delay={240}>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={`mailto:${siteConfig.email}`}
            className="rounded-[3px] bg-accent px-6 py-3 font-medium text-fg transition-colors duration-200 hover:bg-accent-lift"
          >
            {t("cta")}
          </a>
          <span className="inline-flex items-center gap-2 text-label text-muted">
            <span className="size-2 rounded-full bg-accent-lift" />
            {t("availability")}
          </span>
        </div>
      </Reveal>

      <Reveal delay={320}>
        <div className="mt-24 max-w-2xl rounded-[4px] border border-line bg-raised p-6">
          <p className="text-label text-muted">{f("badge")}</p>
          <p className="mt-3 leading-relaxed text-muted">{f("note")}</p>
        </div>
      </Reveal>
    </Container>
  );
}
