import type { CaseBlock, Localized } from "@/types/project";

/** Estágio da trajetória — vira um degrau (ou a torre, no caso do Livra). */
export interface Stage {
  n: number;
  /** Período exibido. Vazio quando a data exata não foi confirmada. */
  period: Localized;
  title: Localized;
  /** Nome curto: vai na régua da narração e escrito no degrau. */
  short: Localized;
  body: Localized;
  kind: "edu" | "shakers" | "cert" | "founder";
  /**
   * Início e fim (AAAA-MM) para pôr o degrau no tempo de verdade: a largura
   * do piso é o tempo no cargo. Sem data, o estágio fica fora do eixo.
   */
  from?: string;
  to?: string;
}

export const about = {
  paragraphs: {
    en: [
      "I'm a front-end engineer in São Paulo, and I build Shopify stores end to end: from basic sections to product pages, cart and checkout, in Liquid or headless Hydrogen. Large stores, thirty pages and up, solo, in days or weeks.",
      "What I optimize for is what a customer on a phone actually gets. Performance, SEO and structured data go in from the first section. When the platform doesn't do something, I build it: custom apps, Shopify Functions, optimistic carts in Liquid and in React.",
      "In 2026 I shipped Livra, a reading app I designed, built and run alone: iOS, Android and web, 600 registered users in its first month.",
    ],
    pt: [
      "Sou engenheiro front-end em São Paulo e construo lojas Shopify de ponta a ponta: das seções básicas à página de produto, carrinho e checkout, em Liquid ou Hydrogen headless. Lojas grandes, de trinta páginas para cima, sozinho, em dias ou semanas.",
      "O que eu otimizo é o que o cliente no celular recebe de fato. Performance, SEO e dados estruturados entram desde a primeira seção. Quando a plataforma não faz alguma coisa, eu construo: custom apps, Shopify Functions, carrinho otimista em Liquid e em React.",
      "Em 2026 lancei o Livra, um app de leitura que eu desenhei, construí e opero sozinho: iOS, Android e web, 600 usuários cadastrados no primeiro mês.",
    ],
  } satisfies Record<"pt" | "en", string[]>,

  // Ordem = ordem da escada. Datas sem confirmação ficam vazias (o degrau
  // existe; a data aparece quando for confirmada).
  stages: [
    {
      n: 10,
      short: { en: "Tech school", pt: "Técnico" },
      kind: "edu",
      period: { en: "Before", pt: "Antes" },
      title: { en: "Technical high school, IT", pt: "Técnico em TI" },
      body: {
        en: "Design, databases, robotics and front-end. Where I built my first websites.",
        pt: "Design, banco de dados, robótica e front-end. De onde vieram os primeiros sites.",
      },
    },
    {
      n: 12,
      short: { en: "Degree", pt: "Faculdade" },
      from: "2023-01",
      to: "2026-12",
      kind: "edu",
      period: { en: "2023–2026", pt: "2023–2026" },
      title: { en: "B.Sc. Computer Science", pt: "Ciência da Computação" },
      body: { en: "At UNASP, São Paulo campus. Finishing in 2026, while working.", pt: "No UNASP, campus São Paulo. Termina em 2026, junto com o trabalho." },
    },
    {
      n: 14,
      short: { en: "Intern", pt: "Estágio" },
      from: "2024-05",
      to: "2025-04",
      kind: "shakers",
      period: { en: "May 2024", pt: "mai. 2024" },
      title: { en: "SHAKERS · Intern", pt: "SHAKERS · Estágio" },
      body: {
        en: "Shopify e-commerce: reusable components and techniques the platform doesn't ship.",
        pt: "E-commerce em Shopify: componentes reutilizáveis e técnicas que a plataforma não entrega.",
      },
    },
    {
      n: 16,
      short: { en: "Junior", pt: "Júnior" },
      from: "2025-04",
      to: "2025-08",
      kind: "shakers",
      period: { en: "Apr 2025", pt: "abr. 2025" },
      title: { en: "SHAKERS · Junior", pt: "SHAKERS · Júnior" },
      body: { en: "Promoted eleven months after starting.", pt: "Promovido onze meses depois de entrar." },
    },
    {
      n: 18,
      short: { en: "Squad leader", pt: "Squad leader" },
      from: "2025-08",
      kind: "shakers",
      period: { en: "Aug 2025", pt: "ago. 2025" },
      title: { en: "SHAKERS · Squad lead", pt: "SHAKERS · Líder de squad" },
      body: {
        en: "Leading a support squad on Hydrogen React storefronts, including the first shared cart the agency shipped.",
        pt: "Liderando um squad de suporte em vitrines Hydrogen React, incluindo o primeiro carrinho compartilhado da agência.",
      },
    },
    {
      n: 20,
      short: { en: "Now", pt: "Hoje" },
      kind: "shakers",
      period: { en: "Now", pt: "Hoje" },
      title: { en: "SHAKERS · Solo, several stores a month", pt: "SHAKERS · Solo, várias lojas por mês" },
      body: {
        en: "Whole stores alone, thirty pages end to end, Liquid and headless, in days or weeks. Still helping lead the team.",
        pt: "Lojas inteiras sozinho, trinta páginas de ponta a ponta, Liquid e headless, em dias ou semanas. Ainda com atuação de liderança no time.",
      },
    },
    {
      n: 22,
      short: { en: "Certification", pt: "Certificação" },
      kind: "cert",
      period: { en: "In progress", pt: "Em andamento" },
      title: { en: "Shopify specialist", pt: "Especialista Shopify" },
      body: {
        en: "Certifications on the way. Drawn dashed: under construction.",
        pt: "Certificações a caminho. Desenhado tracejado: em construção.",
      },
    },
    {
      n: 30,
      short: { en: "Livra", pt: "Livra" },
      kind: "founder",
      period: { en: "2026", pt: "2026" },
      title: { en: "Livra · Founder and CEO", pt: "Livra · Fundador e CEO" },
      body: {
        en: "A real app with real users: designed, built and run alone. iOS, Android and web, 600 registered users in the first month.",
        pt: "Um app de verdade com usuários de verdade: desenhado, construído e operado sozinho. iOS, Android e web, 600 usuários cadastrados no primeiro mês.",
      },
    },
  ] satisfies Stage[],

  capabilities: [
    { en: "Liquid themes, sections and blocks", pt: "Temas Liquid, seções e blocos" },
    { en: "Headless with Shopify Hydrogen", pt: "Headless com Shopify Hydrogen" },
    { en: "Cart and checkout: optimistic carts, extensions, Functions", pt: "Carrinho e checkout: carrinho otimista, extensões, Functions" },
    { en: "Custom apps for what the platform doesn't do", pt: "Custom apps para o que a plataforma não faz" },
    { en: "Performance (Core Web Vitals)", pt: "Performance (Core Web Vitals)" },
    { en: "SEO and structured data (JSON-LD)", pt: "SEO e dados estruturados (JSON-LD)" },
    { en: "A shared base of sections and checks, for new and existing stores", pt: "Base compartilhada de seções e verificações, para lojas novas e existentes" },
  ] satisfies Localized[],

  /**
   * Como eu trabalho: o método, sem produto. O código que existe é do
   * empregador; aqui fica só o conceito, sem nome, comando ou regra interna.
   */
  method: {
    en: [
      { kind: "heading", text: "How I work" },
      { kind: "text", text: "Most of my stores start from the same base, and the base gets better with every store." },
      {
        kind: "list",
        items: [
          { label: "A base every store pulls from:", text: "sections, blocks and snippets live in one place, and each project takes them as a versioned dependency. When a base is copied into every project, each copy fixes its own bugs and the fixes never leave it." },
          { label: "Fixes go back to the base:", text: "what one store corrects returns to the base, so the next store already has it." },
          { label: "Checked by tools:", text: "whatever can be verified automatically is, like breakpoints, schema and spacing. Every section is measured at several widths before anyone reviews it by eye. That works the same for people and for AI agents building on the base." },
          { label: "Existing stores too:", text: "on a store that already exists, hand-built pieces are swapped for pieces from the base one at a time, without a rewrite." },
        ],
      },
    ],
    pt: [
      { kind: "heading", text: "Como eu trabalho" },
      { kind: "text", text: "A maioria das minhas lojas começa da mesma base, e a base melhora a cada loja." },
      {
        kind: "list",
        items: [
          { label: "Uma base de onde toda loja puxa:", text: "seções, blocos e snippets ficam num lugar só, e cada projeto os usa como dependência versionada. Quando a base é copiada para cada projeto, cada cópia corrige os próprios bugs e a correção fica presa ali." },
          { label: "A correção volta para a base:", text: "o que uma loja corrige volta para a base, e a próxima já começa com isso." },
          { label: "Verificado por ferramenta:", text: "o que dá para verificar é verificado: breakpoints, schema, espaçamento. Cada seção é medida em várias larguras antes de alguém revisar no olho. Vale igual para pessoas e para agentes de IA construindo sobre a base." },
          { label: "Lojas existentes também:", text: "numa loja que já existe, as peças feitas à mão são trocadas por unidades da base uma a uma, sem reescrever tudo." },
        ],
      },
    ],
  } satisfies Record<"pt" | "en", CaseBlock[]>,

  interests: {
    pt: "Fora do código: música, vinil e a cena de eventos de São Paulo.",
    en: "Off the clock: music, vinyl records and São Paulo's event scene.",
  } satisfies Record<"pt" | "en", string>,
};
