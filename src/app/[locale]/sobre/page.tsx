import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/metadata";
import { sheetPlan } from "@/lib/sheets";
import TitleBlock from "@/components/sheet/TitleBlock";
import Stair from "@/components/sheet/Stair";
import CaseText from "@/components/cases/CaseText";
import { isShown } from "@/components/figures/registry";
import { fetchPublishedProjects } from "@/data/projects";
import { about } from "@/data/about";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMeta({ locale: l, path: "/sobre", title: t("eyebrow"), description: about.paragraphs[l][0] });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations("about");
  const th = await getTranslations("home");
  const projects = (await fetchPublishedProjects()).filter(isShown);
  const plan = sheetPlan(projects.length);

  return (
    <>
      <p className="t-fig uppercase text-faint">{t("eyebrow")}</p>
      <h1 className="t-hero mt-6 max-w-[16ch] text-[clamp(2.6rem,6.4vw,7rem)]">{t("title")}</h1>

      <div className="mt-[clamp(48px,7vw,112px)] grid gap-10 border-t border-fg pt-5 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-[var(--gut)]">
        <div>
          <h2 className="tb-key">{t("does")}</h2>
          <ul className="mt-2">
            {about.capabilities.map((c) => (
              <li key={c.en} className="t-small border-b border-line py-2">
                {c[l]}
              </li>
            ))}
          </ul>
          <p className="t-small mt-4 text-muted">{about.interests[l]}</p>
        </div>
        <div className="max-w-[62ch] space-y-5 text-[1.125rem] leading-[1.6]">
          {about.paragraphs[l].map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="mt-[clamp(56px,8vw,128px)]">
        <CaseText blocks={about.method[l]} />
      </div>

      <div className="mt-[clamp(24px,4vw,64px)]">
        <Stair
          stages={about.stages}
          locale={l}
          fig={`${th("fig")} ${projects.length + 1}`}
          caption={t("stairCaption")}
          labels={{ play: th("play"), pause: th("pause"), prev: th("prev"), next: th("next") }}
        />
      </div>

      <TitleBlock sheet={plan.about} of={plan.total} title={t("eyebrow")} />
    </>
  );
}
