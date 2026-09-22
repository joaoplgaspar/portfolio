import type { Localized } from "@/types/project";

/**
 * Bloco AGORA — o que é verdade sobre o trabalho neste momento.
 *
 * Inspirado no "Currently at" do xiangyidesign (ver docs/teardown-xiangyidesign.md),
 * mas com duas diferenças deliberadas:
 *
 * 1. **Carrega data de atualização.** Um bloco que se chama "agora" e não diz
 *    desde quando é uma mentira esperando acontecer. A data aparece na tela:
 *    se envelhecer, o site denuncia sozinho — é o mesmo contrato da telemetria.
 * 2. **Entrada sem verdade sai da lista.** Nada de "em breve" nem vaga aqui.
 *    Se `entries` ficar vazio, o bloco inteiro não renderiza.
 *
 * Manutenção: editar este arquivo e mover `updatedAt` junto. É a única fonte.
 */

export interface NowEntry {
  /** Rótulo da linha; a tradução vive em `messages/*.json` → `now.<kind>`. */
  kind: "role" | "building";
  title: string;
  detail: Localized;
  /** Coluna direita, mono e curta: período ou status. */
  meta: Localized;
  /** Quando existe, a entrada vira link (case interno). */
  href?: string;
}

export const now = {
  /** ISO. Renderizado na barra do bloco. */
  updatedAt: "2026-09-22",
  entries: [
    {
      kind: "role",
      title: "SHAKERS",
      detail: {
        pt: "Líder de squad de suporte · Shopify Hydrogen, React",
        en: "Support squad lead · Shopify Hydrogen, React",
      },
      meta: { pt: "desde 2024", en: "since 2024" },
    },
    {
      kind: "building",
      title: "LIVRA",
      detail: {
        pt: "6 APIs de catálogo convergindo numa identidade canônica de livro",
        en: "6 catalog APIs converging into one canonical book identity",
      },
      meta: { pt: "beta fechado", en: "closed beta" },
      href: "/trabalho/livra",
    },
  ] satisfies NowEntry[],
};
