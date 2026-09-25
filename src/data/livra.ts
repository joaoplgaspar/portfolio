import type { Localized } from "@/types/project";

/**
 * LIVRA — telas anotadas e fluxo do scanner.
 *
 * Fonte das imagens: os prints de produção da landing do app
 * (lura/public/assets/landing, já públicos em uselivra.com) e capturas do
 * scanner feitas em aparelho (livra-marketing/prints). A captura com "buscas
 * recentes" ficou fora: mostra @ de outras pessoas.
 *
 * Posições (x, y) em % da imagem. Todo texto de nota sai do case, da própria
 * tela ou do STATUS do app — nada de feature que o print não mostra.
 */

export type ScreenNote = { n: number; x: number; y: number; text: Localized };
export type Screen = { src: string; w: number; h: number; title: Localized; notes: ScreenNote[] };

export const screens: Screen[] = [
  {
    src: "/livra/app-inicio.webp",
    w: 429,
    h: 788,
    title: { en: "Home", pt: "Início" },
    notes: [
      {
        n: 30,
        x: 62,
        y: 4.5,
        text: {
          en: "Streak. Only Cloud Functions write it, in idempotent transactions keyed by user, reason and day.",
          pt: "Ofensiva. Só Cloud Functions escrevem, em transações idempotentes por usuário, motivo e dia.",
        },
      },
      {
        n: 32,
        x: 44,
        y: 24,
        text: {
          en: "Physical books track pages, Kindle tracks percent. One progress model, two inputs.",
          pt: "Livro físico conta páginas, Kindle conta porcentagem. Um modelo de progresso, duas entradas.",
        },
      },
      {
        n: 34,
        x: 30,
        y: 41,
        text: {
          en: "Logging progress is what feeds the streak, the XP and the weekly league.",
          pt: "Marcar progresso é o que alimenta a ofensiva, o XP e a liga da semana.",
        },
      },
      {
        n: 36,
        x: 30,
        y: 86,
        text: {
          en: "Lura, the AI librarian. Gemini picks, and every pick is checked against the real catalog before it becomes a card.",
          pt: "Lura, a bibliotecária de IA. O Gemini escolhe, e cada escolha é checada contra o catálogo real antes de virar card.",
        },
      },
    ],
  },
  {
    src: "/livra/app-liga.webp",
    w: 420,
    h: 785,
    title: { en: "Leagues", pt: "Ligas" },
    notes: [
      {
        n: 40,
        x: 82,
        y: 23,
        text: {
          en: "XP and position are computed on the server. The client never writes money or rank.",
          pt: "XP e posição são calculados no servidor. O cliente nunca escreve moeda nem posição.",
        },
      },
      {
        n: 42,
        x: 50,
        y: 32,
        text: {
          en: "Promotion and relegation zones for the week: who goes up, who stays, who drops.",
          pt: "Zonas de subida e queda da semana: quem sobe, quem fica, quem cai.",
        },
      },
      {
        n: 44,
        x: 36,
        y: 46,
        text: {
          en: "Coins by final position. A contract since real users arrived: changing it needs a recorded decision.",
          pt: "Moedas pela posição final. Contrato desde que chegaram usuários reais: mudar exige decisão registrada.",
        },
      },
      {
        n: 46,
        x: 56,
        y: 62,
        text: { en: "Four divisions, Bronze to Diamond.", pt: "Quatro divisões, do Bronze ao Diamante." },
      },
    ],
  },
  {
    src: "/livra/app-foco.webp",
    w: 420,
    h: 787,
    title: { en: "Focus mode", pt: "Modo foco" },
    notes: [
      {
        n: 50,
        x: 50,
        y: 30,
        text: { en: "A timed reading session.", pt: "Uma sessão de leitura cronometrada." },
      },
      {
        n: 52,
        x: 62,
        y: 55,
        text: {
          en: "Tied to the book and the page you're on, so the session ends as progress.",
          pt: "Presa ao livro e à página em que você está: a sessão termina como progresso.",
        },
      },
      {
        n: 54,
        x: 86,
        y: 86,
        text: {
          en: "Ambient sound. Two of them unlock with coins earned in the app.",
          pt: "Som ambiente. Dois deles se desbloqueiam com moedas ganhas no app.",
        },
      },
    ],
  },
  {
    src: "/livra/app-lura.webp",
    w: 420,
    h: 789,
    title: { en: "Lura", pt: "Lura" },
    notes: [
      {
        n: 60,
        x: 22,
        y: 13,
        text: {
          en: "Pick by mood: for you, light, suspense, fantasy.",
          pt: "Escolha por humor: para você, leve, suspense, fantasia.",
        },
      },
      {
        n: 62,
        x: 30,
        y: 36,
        text: {
          en: "Every pick is a book that exists in the catalog. The model can't invent a title.",
          pt: "Toda indicação é um livro que existe no catálogo. O modelo não consegue inventar um título.",
        },
      },
      {
        n: 64,
        x: 40,
        y: 60,
        text: {
          en: "The reason is written for this reader, from what's already on their shelf.",
          pt: "O motivo é escrito para esta leitora, a partir do que já está na estante dela.",
        },
      },
    ],
  },
];

export const themes = [
  { src: "/livra/app-perfil.webp", name: "Linho" },
  { src: "/livra/tema-cafe.webp", name: "Café" },
  { src: "/livra/tema-alcova.webp", name: "Alcova" },
  { src: "/livra/tema-aurora.webp", name: "Aurora" },
];

export type ScanStep = { src: string; dur: number; caption: Localized };

export const scanner: ScanStep[] = [
  {
    src: "/livra/scan-1.webp",
    dur: 3.4,
    caption: {
      en: "Point at the barcode on the back cover. It's decoded on the phone. No barcode? “Photograph the cover” sends it to multimodal AI instead.",
      pt: "Aponte para o código de barras da contracapa. A leitura é no aparelho. Sem código? “Fotografar a capa” manda para a IA multimodal.",
    },
  },
  {
    src: "/livra/scan-2.webp",
    dur: 3,
    caption: {
      en: "Batch mode: the camera stays on and every book goes straight in.",
      pt: "Modo em lote: a câmera fica ligada e cada livro entra direto.",
    },
  },
  {
    src: "/livra/scan-3.webp",
    dur: 3,
    caption: {
      en: "Choose how they enter: want to read, reading, read, or just owned.",
      pt: "Escolha como entram: quero ler, lendo, lido ou só tenho.",
    },
  },
  {
    src: "/livra/scan-4.webp",
    dur: 3.4,
    caption: {
      en: "What comes back is the reconciled record: Ruído, Objetiva, 432 pages, ISBN 9788547001339.",
      pt: "O que volta é o registro reconciliado: Ruído, Objetiva, 432 páginas, ISBN 9788547001339.",
    },
  },
  {
    src: "/livra/scan-5.webp",
    dur: 2.8,
    caption: {
      en: "Next book. No waiting between scans.",
      pt: "Próximo livro. Sem esperar entre uma leitura e outra.",
    },
  },
  {
    src: "/livra/scan-6.webp",
    dur: 3,
    caption: {
      en: "The session list grows as you go, and each entry can be undone.",
      pt: "A lista da sessão cresce enquanto você lê, e cada entrada pode ser desfeita.",
    },
  },
];
