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
  "hsm-singularity": [
    { n: 10, label: { en: "checkout", pt: "checkout" } },
    { n: 12, label: { en: "native CPF/CNPJ field", pt: "campo nativo de CPF/CNPJ" } },
    { n: 14, label: { en: "checkout UI extension", pt: "extensão de checkout" } },
    { n: 16, label: { en: "cart metafield with the CNPJ", pt: "metafield do carrinho com o CNPJ" } },
    { n: 18, label: { en: "discount Function: the withholding rule", pt: "Function de desconto: a regra de retenção" } },
    { n: 20, label: { en: "value tiers and rates, JSON in a metafield", pt: "faixas de valor e alíquotas, JSON em metafield" } },
    { n: 22, label: { en: "withholding line, fixed amount in cents", pt: "linha de retenção, valor fixo em centavos" } },
    { n: 24, label: { en: "validation Function: CNPJ check digits", pt: "Function de validação: dígitos do CNPJ" } },
    { n: 26, label: { en: "settings form in the admin", pt: "formulário de configuração no admin" } },
  ],
};
