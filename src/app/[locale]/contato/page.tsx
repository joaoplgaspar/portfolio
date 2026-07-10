import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import Container from "@/components/layout/Container";
import Reveal from "@/components/fx/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMeta({
    locale: locale as Locale,
    path: "/contato",
    title: t("title"),
    description: t("lede"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <Container className="pb-24 pt-32 md:pb-40 md:pt-40">
      <div className="grid gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <div>
          <Reveal>
            <p className="text-label text-accent-lift">{t("eyebrow")}</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-display mt-4 max-w-[14ch] text-balance">
              {t("title")}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-md text-lg text-muted">{t("lede")}</p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-10">
              <p className="text-label text-muted">{t("or")}</p>
              <div className="mt-3 flex flex-col gap-2 text-lg">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="w-fit transition-colors hover:text-accent-lift"
                >
                  {siteConfig.email}
                </a>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit transition-colors hover:text-accent-lift"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </Container>
  );
}
