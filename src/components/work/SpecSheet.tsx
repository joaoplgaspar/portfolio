import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { Project } from "@/types/project";

/** Ficha técnica em mono (etiqueta analógica) — Seção 5.2. */
export default async function SpecSheet({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const t = await getTranslations("project.spec");
  const rows = [
    { label: t("client"), value: project.client[locale] },
    { label: t("role"), value: project.role[locale] },
    { label: t("type"), value: project.type[locale] },
    { label: t("year"), value: String(project.year) },
    { label: t("stack"), value: project.stack.join(" · ") },
  ];

  return (
    <dl className="overflow-hidden rounded-[4px] border border-line bg-raised">
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={`flex items-baseline justify-between gap-6 px-5 py-3.5 ${
            i > 0 ? "border-t border-line" : ""
          }`}
        >
          <dt className="text-label text-muted">{r.label}</dt>
          <dd className="text-right font-mono text-sm text-fg">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
