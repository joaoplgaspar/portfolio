"use client";

import { useState } from "react";

/**
 * LIVRA — reconciliação de catálogo, em miniatura.
 *
 * Quatro fontes respondem pelo mesmo livro, cada uma com o seu defeito
 * típico (descrito no case). "Reconciliar" escolhe campo a campo de quem
 * confiar e mostra a procedência. "Queda da CBL" simula a fonte devolvendo
 * `[]`: o registro se recompõe com as outras, e o painel de cache mostra a
 * regra "nunca cachear lista vazia" contra a versão ingênua.
 *
 * Os valores são ilustrativos e abreviados; as regras de procedência são as
 * do case.
 */

type Src = "google" | "apple" | "cbl" | "openlibrary";
type Field = "title" | "author" | "publisher" | "pages" | "cover" | "id";
type Cell = { v: string | null; bad?: boolean };

const NAMES: Record<Src, string> = {
  google: "Google Books",
  apple: "Apple Books",
  cbl: "CBL",
  openlibrary: "Open Library",
};
const FIELDS: Field[] = ["title", "author", "publisher", "pages", "cover", "id"];

const DATA: Record<Src, Record<Field, Cell>> = {
  google: {
    title: { v: "Torto arado" },
    author: { v: "Itamar Vieira Junior" },
    publisher: { v: "Todavia" },
    pages: { v: null },
    cover: { v: "thumb 128px" },
    id: { v: "google-…" },
  },
  apple: {
    title: { v: "Torto Arado" },
    author: { v: "Itamar Vieira Junior" },
    publisher: { v: null },
    pages: { v: "✓" },
    cover: { v: "hi-res" },
    id: { v: "apple-…" },
  },
  cbl: {
    title: { v: "Torto arado" },
    author: { v: "Vieira Junior, Itamar" },
    publisher: { v: "Todavia" },
    pages: { v: "✓" },
    cover: { v: "catalog card", bad: true },
    id: { v: "isbn:978…" },
  },
  openlibrary: {
    title: { v: "Torto arado" },
    author: { v: "Itamar Vieira Junior" },
    publisher: { v: null },
    pages: { v: null },
    cover: { v: null },
    id: { v: "OL…" },
  },
};

/** Ordem de confiança por campo. A primeira fonte que responde bem vence. */
const TRUST: Record<Exclude<Field, "id">, Src[]> = {
  title: ["apple", "cbl", "google", "openlibrary"],
  author: ["google", "apple", "openlibrary", "cbl"],
  publisher: ["cbl", "google", "apple", "openlibrary"],
  pages: ["cbl", "apple", "google", "openlibrary"],
  cover: ["apple", "google", "openlibrary", "cbl"],
};

export type ReconcileText = {
  run: string;
  undo: string;
  outage: string;
  canonical: string;
  from: string;
  empty: string;
  naive: string;
  guarded: string;
  naiveOut: string;
  guardedOut: string;
  fields: Record<Field, string>;
};

export default function Reconcile({ t }: { t: ReconcileText }) {
  const [merged, setMerged] = useState(false);
  const [down, setDown] = useState(false);

  const alive = (s: Src) => !(down && s === "cbl");
  const pick = (f: Exclude<Field, "id">) => {
    const s = TRUST[f].find((src) => alive(src) && DATA[src][f].v && !DATA[src][f].bad);
    return s ? { src: s, v: DATA[s][f].v as string } : null;
  };
  const ids = (["apple", "google", "cbl"] as Src[]).filter(alive).map((s) => DATA[s].id.v);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="ctl" aria-pressed={merged} onClick={() => setMerged((m) => !m)}>
          {merged ? t.undo : t.run}
        </button>
        <button type="button" className="ctl" aria-pressed={down} onClick={() => setDown((d) => !d)}>
          {t.outage}
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <div className="grid grid-cols-2 gap-px border border-fg bg-fg md:grid-cols-4">
          {(Object.keys(NAMES) as Src[]).map((s) => (
            <div key={s} className="bg-raised p-3">
              <p className="t-small mb-2 flex justify-between">
                {NAMES[s]}
                {!alive(s) && <span className="t-code text-accent">503</span>}
              </p>
              {alive(s) ? (
                <dl>
                  {FIELDS.map((f) => {
                    const c = DATA[s][f];
                    const used = merged && f !== "id" && pick(f)?.src === s;
                    return (
                      <div key={f} className="border-t border-line py-1">
                        <dt className="tb-key !mb-0">{t.fields[f]}</dt>
                        <dd
                          className={`text-[0.8125rem] leading-tight ${
                            c.v === null
                              ? "text-faint"
                              : c.bad
                                ? "text-accent line-through"
                                : used
                                  ? "font-[650]"
                                  : ""
                          } ${f === "id" ? "t-code" : ""}`}
                        >
                          {c.v ?? "—"}
                          {used && <span className="text-accent"> ●</span>}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              ) : (
                <p className="t-code border-t border-line pt-2 text-muted">[]</p>
              )}
            </div>
          ))}
        </div>

        <div className={`border border-fg p-3 transition-colors ${merged ? "bg-bg" : "bg-raised"}`} aria-live="polite">
          <p className="t-small mb-2">{t.canonical}</p>
          {merged ? (
            <dl>
              {(Object.keys(TRUST) as Exclude<Field, "id">[]).map((f) => {
                const r = pick(f);
                return (
                  <div key={f} className="flex items-baseline justify-between gap-3 border-t border-line py-1">
                    <dt className="tb-key !mb-0 shrink-0">{t.fields[f]}</dt>
                    <dd className="text-right text-[0.8125rem] leading-tight">
                      <span className="font-[650]">{r?.v ?? "—"}</span>
                      {r && <span className="t-code ml-2 text-muted">{t.from} {NAMES[r.src]}</span>}
                    </dd>
                  </div>
                );
              })}
              <div className="border-t border-fg pt-2">
                <dt className="tb-key !mb-0">{t.fields.id}</dt>
                <dd className="t-code">
                  {ids.join(" · ")} → <span className="text-fg">work/torto-arado</span>
                </dd>
              </div>
            </dl>
          ) : (
            <p className="t-small text-faint">{t.empty}</p>
          )}
        </div>
      </div>

      {down && (
        <div className="mt-4 grid border border-fg md:grid-cols-2">
          <div className="border-b border-fg p-3 md:border-r md:border-b-0">
            <span className="tb-key">{t.naive}</span>
            <p className="t-code">cache.set(&quot;cbl:torto arado&quot;, [], &quot;7d&quot;)</p>
            <p className="t-small mt-1 text-accent">{t.naiveOut}</p>
          </div>
          <div className="p-3">
            <span className="tb-key">{t.guarded}</span>
            <p className="t-code">if (!results.length) return results</p>
            <p className="t-small mt-1">{t.guardedOut}</p>
          </div>
        </div>
      )}
    </div>
  );
}
