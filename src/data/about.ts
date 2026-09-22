import type { Localized } from "@/types/project";

/** Estágio da trajetória — vira um degrau (ou a torre, no caso do LIVRA). */
export interface Stage {
  n: number;
  /** Período exibido. Vazio quando a data exata não foi confirmada. */
  period: Localized;
  title: Localized;
  body: Localized;
  kind: "edu" | "shakers" | "cert" | "founder";
}

export const about = {
  paragraphs: {
    en: [
      "I'm a front-end engineer in São Paulo, and I build Shopify stores end to end: from basic sections to product pages, cart and checkout, in Liquid or headless Hydrogen. Large stores, thirty pages and up, solo, in days or weeks.",
      "What I optimize for is what a customer on a phone actually gets. Performance, SEO and structured data go in from the first section. When the platform doesn't do something, I build it: custom apps, Shopify Functions, optimistic carts in Liquid and in React.",
      "In 2026 I shipped LIVRA, a reading app I designed, built and run alone: iOS, Android and web, 300 registered users in its first month.",
    ],
    pt: [
      "Sou engenheiro front-end em São Paulo e construo lojas Shopify de ponta a ponta: das seções básicas à página de produto, carrinho e checkout, em Liquid ou Hydrogen headless. Lojas grandes, de trinta páginas para cima, sozinho, em dias ou semanas.",
      "O que eu otimizo é o que o cliente no celular recebe de fato. Performance, SEO e dados estruturados entram desde a primeira seção. Quando a plataforma não faz alguma coisa, eu construo: custom apps, Shopify Functions, carrinho otimista em Liquid e em React.",
      "Em 2026 lancei o LIVRA, um app de leitura que eu desenhei, construí e opero sozinho: iOS, Android e web, 300 usuários cadastrados no primeiro mês.",
    ],
  } satisfies Record<"pt" | "en", string[]>,

  // Ordem = ordem da escada. Datas sem confirmação ficam vazias (o degrau
  // existe; a data aparece quando for confirmada).
  stages: [
    {
      n: 10,
      kind: "edu",
      period: { en: "Before", pt: "Antes" },
      title: { en: "Technical high school, IT", pt: "Técnico em TI" },
      body: {
        en: "Design, databases, robotics and front-end. Where the first websites came from.",
        pt: "Design, banco de dados, robótica e front-end. De onde vieram os primeiros sites.",
      },
    },
    {
      n: 12,
      kind: "edu",
      period: { en: "2023—", pt: "2023—" },
      title: { en: "B.Sc. Computer Science", pt: "Ciência da Computação" },
      body: { en: "In progress, alongside the work.", pt: "Em andamento, junto com o trabalho." },
    },
    {
      n: 14,
      kind: "shakers",
      period: { en: "2024", pt: "2024" },
      title: { en: "SHAKERS · Intern", pt: "SHAKERS · Estágio" },
      body: {
        en: "Shopify e-commerce: library components and techniques the platform doesn't ship.",
        pt: "E-commerce em Shopify: componentes de biblioteca e técnicas que a plataforma não entrega.",
      },
    },
    {
      n: 16,
      kind: "shakers",
      period: { en: "+9 months", pt: "+9 meses" },
      title: { en: "SHAKERS · Junior", pt: "SHAKERS · Júnior" },
      body: { en: "Promoted about nine months after starting.", pt: "Promovido cerca de nove meses depois de entrar." },
    },
    {
      n: 18,
      kind: "shakers",
      period: { en: "", pt: "" },
      title: { en: "SHAKERS · Squad lead", pt: "SHAKERS · Líder de squad" },
      body: {
        en: "Leading a support squad on Hydrogen React storefronts, including the first shared cart the agency shipped.",
        pt: "Liderando um squad de suporte em vitrines Hydrogen React, incluindo o primeiro carrinho compartilhado da agência.",
      },
    },
    {
      n: 20,
      kind: "shakers",
      period: { en: "Now", pt: "Hoje" },
      title: { en: "SHAKERS · Solo, several stores a month", pt: "SHAKERS · Solo, várias lojas por mês" },
      body: {
        en: "Whole stores alone, thirty pages end to end, Liquid and headless, in days or weeks. Still with a hand in leading the team.",
        pt: "Lojas inteiras sozinho, trinta páginas de ponta a ponta, Liquid e headless, em dias ou semanas. Ainda com atuação de liderança no time.",
      },
    },
    {
      n: 22,
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
      kind: "founder",
      period: { en: "2026", pt: "2026" },
      title: { en: "LIVRA · Founder and CEO", pt: "LIVRA · Fundador e CEO" },
      body: {
        en: "A real app with real users: designed, built and run alone. iOS, Android and web, 300 registered users in the first month.",
        pt: "Um app de verdade com usuários de verdade: desenhado, construído e operado sozinho. iOS, Android e web, 300 usuários cadastrados no primeiro mês.",
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
    { en: "My own starter pack, built on by AI agents, for new and existing projects", pt: "Starter pack próprio, usado por agentes de IA, para projetos novos e existentes" },
  ] satisfies Localized[],

  interests: {
    pt: "Fora do código: música, vinil e a cena de eventos de São Paulo.",
    en: "Off the clock: music, vinyl records and São Paulo's event scene.",
  } satisfies Record<"pt" | "en", string>,
};
