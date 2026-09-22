import type { Localized } from "@/types/project";

/**
 * Legenda de cada figura: numeral → o que ele aponta. É a "lista de
 * referências" de uma patente — o texto que dá nome às peças do desenho.
 * A figura em si vive em components/figures; o slug liga as duas.
 */
export type Legend = { n: number; label: Localized; code?: boolean }[];

export const legends: Record<string, Legend> = {
  "roland-boss": [
    { n: 10, label: { en: "store.roland.com.br", pt: "store.roland.com.br" }, code: true },
    { n: 12, label: { en: "store.bossmusic.com.br", pt: "store.bossmusic.com.br" }, code: true },
    { n: 14, label: { en: "one cart, owned in one place", pt: "um carrinho, com um dono só" } },
    { n: 16, label: { en: "Storefront API", pt: "Storefront API" } },
    { n: 18, label: { en: "one Shopify store underneath", pt: "uma loja Shopify por baixo" } },
    { n: 20, label: { en: "single checkout", pt: "checkout único" } },
    { n: 22, label: { en: "domain boundary — the session stops here", pt: "fronteira de domínio — a sessão para aqui" } },
    { n: 24, label: { en: "two carts kept in sync (rejected)", pt: "dois carrinhos sincronizados (descartado)" } },
    { n: 26, label: { en: "optimistic line — dashed until the server confirms", pt: "linha otimista — tracejada até o servidor confirmar" } },
  ],
  "integral-medica-darkness": [
    { n: 10, label: { en: "Integralmédica storefront", pt: "vitrine Integralmédica" } },
    { n: 12, label: { en: "Darkness storefront", pt: "vitrine Darkness" } },
    { n: 14, label: { en: "account area, rebuilt per brand", pt: "“Minha conta” refeita por marca" } },
    { n: 16, label: { en: "checkout extensions", pt: "extensões de checkout" } },
    { n: 18, label: { en: "Shopify Functions — promo rules", pt: "Shopify Functions — regras de promoção" } },
    { n: 20, label: { en: "custom apps", pt: "custom apps" } },
    { n: 22, label: { en: "one Shopify admin, two brands", pt: "um admin Shopify, duas marcas" } },
  ],
  livra: [
    { n: 10, label: { en: "Google Books — no page count in search", pt: "Google Books — sem nº de páginas na busca" } },
    { n: 12, label: { en: "Apple Books — best covers, forced locale", pt: "Apple Books — melhores capas, locale forçado" } },
    { n: 14, label: { en: "CBL — edition authority, wrong covers", pt: "CBL — autoridade de edição, capa errada" } },
    { n: 16, label: { en: "Open Library — fallback", pt: "Open Library — fallback" } },
    { n: 18, label: { en: "work × edition reconciliation", pt: "reconciliação obra × edição" } },
    { n: 20, label: { en: "one canonical record", pt: "um registro canônico" } },
    { n: 22, label: { en: "barcode → ISBN, decoded on device", pt: "código de barras → ISBN, no aparelho" } },
    { n: 24, label: { en: "cache that never stores []", pt: "cache que nunca guarda []" } },
  ],
  "starter-pack": [
    { n: 10, label: { en: "the starter pack, a versioned dependency", pt: "o starter pack, dependência versionada" } },
    { n: 12, label: { en: "lock: version and sha256 per file", pt: "lock: versão e sha256 por arquivo" } },
    { n: 14, label: { en: "a project's fix returns as a pull request", pt: "correção do projeto volta como pull request" } },
    { n: 16, label: { en: "a pattern promoted after three projects", pt: "padrão promovido depois de três projetos" } },
    { n: 18, label: { en: "measured at six widths before human QA", pt: "medido em seis larguras antes do QA humano" } },
    { n: 20, label: { en: "new projects built on the pack", pt: "projetos novos construídos sobre o pack" } },
    { n: 30, label: { en: "the usual way: a base copied into each project", pt: "o jeito comum: base copiada em cada projeto" } },
    { n: 32, label: { en: "an existing project adopting the pack", pt: "projeto existente adotando o pack" } },
  ],
};
