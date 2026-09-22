import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { sheetPlan } from "@/lib/sheets";
import TitleBlock from "@/components/sheet/TitleBlock";
import ContactForm from "@/components/sheet/ContactForm";
import { isShown } from "@/components/figures/registry";
import { fetchPublishedProjects } from "@/data/projects";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMeta({ locale: locale as Locale, path: "/contato", title: t("title"), description: t("title") });
}

/** Contato: o e-mail e um formulário curto. Nada de "disponível para". */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const cases = (await fetchPublishedProjects()).filter(isShown);
  const plan = sheetPlan(cases.length);

  return (
    <>
      <h1 className="t-hero">{t("title")}</h1>
      <div className="mt-[clamp(40px,6vw,96px)] grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-[var(--gut)]">
        <div className="border-t border-fg pt-5">
          <span className="tb-key">E-mail</span>
          <a href={`mailto:${siteConfig.email}`} className="t-small tb-link">
            {siteConfig.email}
          </a>
          <span className="tb-key mt-5">LinkedIn · GitHub</span>
          <span className="t-small flex gap-3">
            <a className="tb-link" href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="tb-link" href={siteConfig.social.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </span>
        </div>
        <div className="max-w-[720px]">
          <ContactForm
            t={{
              name: t("name"),
              email: t("email"),
              message: t("message"),
              send: t("send"),
              sending: t("sending"),
              sent: t("sent"),
              sentMail: t("sentMail"),
              error: t("error"),
              subject: t("subject"),
            }}
          />
        </div>
      </div>
      <TitleBlock sheet={plan.contact} of={plan.total} title={t("title")} />
    </>
  );
}
