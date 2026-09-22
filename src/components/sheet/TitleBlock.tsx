import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";
import LocalTime from "./LocalTime";
import { Link } from "@/i18n/navigation";

/**
 * Carimbo da prancha — o rodapé de toda página. Quem desenhou, qual folha,
 * como falar comigo. Os campos são os de um title block de verdade; o valor
 * de cada um é verdadeiro (a revisão é o commit do build).
 */
export default async function TitleBlock({
  sheet,
  of,
  title,
}: {
  sheet: number;
  of: number;
  title: string;
}) {
  const t = await getTranslations("sheet");
  const rev = process.env.NEXT_PUBLIC_BUILD_SHA;
  const date = (process.env.NEXT_PUBLIC_BUILD_TIME ?? "").slice(0, 10);

  return (
    <footer className="mt-[clamp(64px,10vw,160px)]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
        <p className="t-title">{t("contact")}</p>
        <span className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <a href={`mailto:${siteConfig.email}`} className="t-small tb-link">
            {siteConfig.email}
          </a>
          <Link href="/contato" className="t-small tb-link">
            {t("form")} →
          </Link>
        </span>
      </div>

      <div className="title-block">
        <div className="tb-cell col-span-6 md:col-span-2">
          <span className="tb-key">{t("drawn")}</span>
          <span className="tb-val">{siteConfig.name}</span>
        </div>
        <div className="tb-cell col-span-6 md:col-span-3">
          <span className="tb-key">{t("title")}</span>
          <span className="tb-val">{title}</span>
        </div>
        <div className="tb-cell col-span-2 md:col-span-1">
          <span className="tb-key">{t("sheet")}</span>
          <span className="tb-val tabular-nums">
            {sheet} / {of}
          </span>
        </div>

        <div className="tb-cell col-span-4 md:col-span-2">
          <span className="tb-key">{t("location")}</span>
          <span className="tb-val">
            São Paulo · <LocalTime />
          </span>
        </div>
        <div className="tb-cell col-span-6 md:col-span-3">
          <span className="tb-key">{t("elsewhere")}</span>
          <span className="tb-val flex flex-wrap gap-x-3">
            <a className="tb-link" href={siteConfig.social.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="tb-link" href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </span>
        </div>
        <div className="tb-cell col-span-3 md:col-span-1">
          <span className="tb-key">{t("rev")}</span>
          <span className="tb-val t-code">{rev ? `${rev} · ${date}` : date}</span>
        </div>
      </div>
    </footer>
  );
}
