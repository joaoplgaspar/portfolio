import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { now } from "@/data/now";

/**
 * Bloco AGORA — peça 2 da composição B (ver docs/composicao.md).
 *
 * Hoje fica abaixo do índice, logo antes da faixa de clientes: é a ordem que
 * os três blocos vivos (AGORA · CLIENTES · TELEMETRIA) terão na coluna direita
 * quando a peça 3 entrar. Assim a peça 3 vira mudança de layout, não de
 * conteúdo.
 *
 * Vocabulário do índice, de propósito: filete no topo, rótulo mono, título em
 * display, meta alinhada à direita. Não é card — cartão flutuante aqui puxaria
 * a composição de volta para o bento que já foi revertido (commit 7d39e0e).
 */
export default async function NowBlock({ locale }: { locale: Locale }) {
  // Regra do bloco: sem entrada verdadeira, não existe bloco.
  if (now.entries.length === 0) return null;

  const t = await getTranslations("now");
  const stamp = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(`${now.updatedAt}T12:00:00Z`));

  return (
    <section className="mt-16 border-t border-line pt-8 md:mt-24">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-label text-muted">{t("title")}</h2>
        <p className="font-mono text-xs text-stone-400">{t("updated", { date: stamp })}</p>
      </div>

      <ul className="mt-5">
        {now.entries.map((entry) => {
          const body = (
            <>
              <span className="now-kind">{t(entry.kind)}</span>
              <span className="now-title">{entry.title}</span>
              <span className="now-detail">{entry.detail[locale]}</span>
              <span className="now-meta">{entry.meta[locale]}</span>
            </>
          );

          return (
            <li key={entry.title}>
              {entry.href ? (
                <Link href={entry.href} className="now-row is-link">
                  {body}
                  <span className="now-arrow" aria-hidden>
                    ↗
                  </span>
                </Link>
              ) : (
                <div className="now-row">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
