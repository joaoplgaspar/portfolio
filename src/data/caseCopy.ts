import type { Locale } from "@/i18n/routing";
import type { CartLabText } from "@/components/cases/CartLab";
import type { DiscountText } from "@/components/cases/DiscountCalc";
import type { ReconcileText } from "@/components/cases/Reconcile";

/**
 * Textos das peças interativas dos cases. Ficam fora de messages/*.json
 * porque pertencem a um case só, e o tipo de cada bloco vem do componente.
 */
type L<T> = Record<Locale, T>;

export const cartLab: L<{ title: string; lede: string; ui: CartLabText }> = {
  en: {
    title: "Break the rejected version yourself",
    lede: "Both architectures, running in your browser. With one cart, order and latency don't matter. With two carts synced by snapshot, add from both stores before the sync lands and watch them disagree.",
    ui: {
      one: "One cart (shipped)",
      sync: "Two carts, synced (rejected)",
      both: "Add on both at once",
      reset: "Reset",
      add: "Add",
      cart: "Cart",
      empty: "empty",
      inSync: "Both stores agree.",
      syncing: "Sync in flight…",
      diverged: "Diverged",
      expected: "expected lines:",
      hint: "Latency is simulated (350–1200 ms). The race is not.",
      log: "network log",
    },
  },
  pt: {
    title: "Quebre você mesmo a versão descartada",
    lede: "As duas arquiteturas, rodando no seu navegador. Com um carrinho, ordem e latência não importam. Com dois carrinhos sincronizados por snapshot, adicione nas duas lojas antes da sincronização chegar e veja os dois discordarem.",
    ui: {
      one: "Um carrinho (entregue)",
      sync: "Dois carrinhos, sincronizados (descartado)",
      both: "Adicionar nos dois ao mesmo tempo",
      reset: "Zerar",
      add: "Adicionar",
      cart: "Carrinho",
      empty: "vazio",
      inSync: "As duas lojas concordam.",
      syncing: "Sincronização em trânsito…",
      diverged: "Divergiu",
      expected: "linhas esperadas:",
      hint: "A latência é simulada (350–1200 ms). A corrida não.",
      log: "log de rede",
    },
  },
};

export const brands: L<{ wipe: string; a: string; b: string; discountTitle: string; discountLede: string; ui: DiscountText }> = {
  en: {
    wipe: "Same template — drag",
    a: "integralmedica.com.br",
    b: "darkness.com.br",
    discountTitle: "A rule small to state, impossible to configure",
    discountLede: "Employee discount, computed from the compare-at price instead of the selling price. Every off-the-shelf app does the second. So it became an app.",
    ui: {
      compareAt: "Compare-at price",
      price: "Selling price",
      shelf: "Off-the-shelf app",
      rule: "This store's rule",
      shelfHow: "price × 0.5",
      ruleHow: "compareAt × 0.5",
      diff: "Difference per item",
    },
  },
  pt: {
    wipe: "Mesmo template — arraste",
    a: "integralmedica.com.br",
    b: "darkness.com.br",
    discountTitle: "Uma regra pequena de enunciar e impossível de configurar",
    discountLede: "Desconto de funcionário calculado sobre o preço comparado, não sobre o preço de venda. Todo app de prateleira faz o segundo. Então virou app.",
    ui: {
      compareAt: "Preço comparado",
      price: "Preço de venda",
      shelf: "App de prateleira",
      rule: "Regra desta loja",
      shelfHow: "price × 0.5",
      ruleHow: "compareAt × 0.5",
      diff: "Diferença por item",
    },
  },
};

export const reconcile: L<{ title: string; lede: string; ui: ReconcileText }> = {
  en: {
    title: "Four answers for one book",
    lede: "Every source answers, none of them fully right. Reconcile picks each field from the source that's trusted for it. Then take CBL down.",
    ui: {
      run: "Reconcile",
      undo: "Show raw sources",
      outage: "CBL outage",
      canonical: "Canonical record",
      from: "←",
      empty: "Four partial answers. Nothing to show yet.",
      naive: "Naive cache",
      guarded: "LIVRA",
      naiveOut: "Stores the empty answer. The book disappears from search for 7 days.",
      guardedOut: "Empty never persists. The next request asks CBL again.",
      fields: { title: "title", author: "author", publisher: "publisher", pages: "pages", cover: "cover", id: "ids" },
    },
  },
  pt: {
    title: "Quatro respostas para um livro",
    lede: "Toda fonte responde, nenhuma totalmente certa. Reconciliar escolhe cada campo da fonte confiável para ele. Depois derrube a CBL.",
    ui: {
      run: "Reconciliar",
      undo: "Ver fontes cruas",
      outage: "Queda da CBL",
      canonical: "Registro canônico",
      from: "←",
      empty: "Quatro respostas parciais. Nada para mostrar ainda.",
      naive: "Cache ingênuo",
      guarded: "LIVRA",
      naiveOut: "Guarda a resposta vazia. O livro some da busca por 7 dias.",
      guardedOut: "Vazio nunca persiste. A próxima requisição pergunta à CBL de novo.",
      fields: { title: "título", author: "autor", publisher: "editora", pages: "páginas", cover: "capa", id: "ids" },
    },
  },
};

export const livraCopy: L<{
  appTitle: string;
  appLede: string;
  appNote: string;
  scanTitle: string;
  scanLede: string;
  scanCaption: string;
  themesTitle: string;
  themesLede: string;
  themesCaption: string;
}> = {
  en: {
    appTitle: "The app, annotated",
    appLede: "Screens from the version in the stores. Each numeral points at something on screen and says what runs underneath it.",
    appNote: "Production screenshots.",
    scanTitle: "The shortest way into the catalog",
    scanLede: "A barcode, decoded on the phone, then the same reconciliation that search uses. Recorded on a device.",
    scanCaption: "Scanner, batch mode, from the camera to the shelf.",
    themesTitle: "One layout, four palettes",
    themesLede: "Themes are sold in the app. Every screen re-skins, from the profile to the league.",
    themesCaption: "The same profile in Linho, Café, Alcova and Aurora.",
  },
  pt: {
    appTitle: "O app, anotado",
    appLede: "Telas da versão que está nas lojas. Cada numeral aponta uma coisa na tela e diz o que roda por baixo dela.",
    appNote: "Prints de produção.",
    scanTitle: "O caminho mais curto até o catálogo",
    scanLede: "Um código de barras, lido no aparelho, e depois a mesma reconciliação que a busca usa. Gravado em aparelho.",
    scanCaption: "Scanner em lote, da câmera à estante.",
    themesTitle: "Um layout, quatro paletas",
    themesLede: "Temas são vendidos no app. Toda tela troca de pele, do perfil à liga.",
    themesCaption: "O mesmo perfil em Linho, Café, Alcova e Aurora.",
  },
};
