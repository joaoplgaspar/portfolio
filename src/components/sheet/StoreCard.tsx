import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { LAB, fmtLab, type Store } from "@/data/stores";

/**
 * Loja no quadro: a primeira dobra da loja no ar dentro de uma janela
 * desenhada, a legenda fora da moldura (marca e nome à esquerda, plataforma à
 * direita) e, quando houver print do PageSpeed, os números com a data.
 */
export default function StoreCard({
  store,
  locale,
  t,
  size = "large",
}: {
  store: Store;
  locale: Locale;
  t: { pending: string; score: string; measured: string };
  /** large: destaque · small: três por linha · compact: faixa da home */
  size?: "large" | "small" | "compact";
}) {
  const compact = size === "compact";
  const frame = (
    <div className="border border-fg bg-[var(--plate)] transition-colors group-hover:border-accent">
      <div className="flex items-center justify-between gap-3 border-b border-fg px-3 py-1.5">
        <span className="t-code truncate text-muted">{store.domain ?? "—"}</span>
        <span className="t-fig shrink-0">{store.mark}</span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        {store.cover ? (
          <Image
            src={store.cover}
            alt=""
            fill
            sizes={size === "large" ? "(min-width: 1024px) 45vw, 100vw" : "(min-width: 1024px) 30vw, 50vw"}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, var(--line) 0 1px, transparent 1px 7px)",
            }}
          >
            <span className="t-small bg-[var(--bg)] px-2 text-faint">{t.pending}</span>
          </div>
        )}
      </div>
    </div>
  );

  // Destaque abre o case; o resto abre a própria página do projeto.
  const href = store.caseSlug ? `/trabalho/${store.caseSlug}` : `/projetos/${store.slug}`;

  return (
    <article>
      <Link href={href} className="group block">
        {frame}
      </Link>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <h3 className="t-small">{store.name}</h3>
        <span className="t-small shrink-0 text-faint">
          {store.platform} · {store.year}
        </span>
      </div>
      {!compact && <p className="t-small mt-0.5 text-muted">{store.scope[locale]}</p>}
      {size === "small" && store.psi && (
        <p className={`t-small mt-1 tabular-nums ${store.psi.score >= LAB.score.good ? "" : "text-accent"}`}>
          {t.score} {store.psi.score} · LCP {fmtLab("lcp", store.psi.lcp)}
        </p>
      )}
      {size === "large" && store.psi && (
        <dl className="mt-3 grid grid-cols-4 border-t border-line pt-2">
          <div>
            <dt className="tb-key !mb-0">{t.score}</dt>
            <dd className={`t-small tabular-nums ${store.psi.score >= LAB.score.good ? "" : "text-accent"}`}>
              {store.psi.score}
            </dd>
          </div>
          {(["lcp", "tbt", "cls"] as const).map((m) => (
            <div key={m}>
              <dt className="tb-key !mb-0">{m.toUpperCase()}</dt>
              <dd className={`t-small tabular-nums ${store.psi![m] <= LAB[m].good ? "" : "text-accent"}`}>
                {fmtLab(m, store.psi![m])}
              </dd>
            </div>
          ))}
          <p className="t-code col-span-4 mt-1 text-faint">
            {t.measured} {store.psi.date}
          </p>
        </dl>
      )}
    </article>
  );
}
