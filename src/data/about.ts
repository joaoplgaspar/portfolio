import type { Localized } from "@/types/project";

/** Entrada da trajetória (timeline factual em mono). */
export interface TrajectoryEntry {
  period: Localized;
  body: Localized;
}

export const about = {
  paragraphs: {
    pt: [
      "Sou engenheiro front-end em São Paulo. Trabalho no limite do que plataformas de e-commerce permitem — e um pouco além: quando a solução não existe nativa, eu construo. Kits, assinaturas, carrinhos otimistas, seções dinâmicas — coisas que “não davam” em Liquid até darem.",
      "Penso e-commerce com a cabeça de quem opera um: conversão primeiro, performance e SEO como fundação, e cada decisão técnica passando pela balança de ganho × risco. Trabalho com IA no dia a dia para acelerar entrega — o critério do que aceitar, recusar e refatorar continua sendo meu.",
    ],
    en: [
      "I'm a front-end engineer based in São Paulo. I work at the edge of what e-commerce platforms allow — and slightly past it: when a solution doesn't exist natively, I build it. Kits, subscriptions, optimistic carts, template-driven dynamic sections — things that “couldn't be done” in Liquid, until they could.",
      "I think about e-commerce like someone who runs one: conversion first, performance and SEO as the foundation, and every technical decision weighed as gain × risk. I use AI daily to move faster — the judgment about what to accept, reject and refactor stays mine.",
    ],
  } satisfies Record<"pt" | "en", string[]>,
  trajectory: [
    {
      period: { pt: "2024—", en: "2024—" },
      body: {
        pt: "SHAKERS · estágio → júnior em ~9 meses → líder de squad de suporte (Hydrogen React). E-commerces em Shopify: componentes de lib, técnicas não-nativas da plataforma.",
        en: "SHAKERS · intern → junior in ~9 months → support squad lead (Hydrogen React). Shopify e-commerce: library components, beyond-native platform techniques.",
      },
    },
    {
      period: { pt: "2023—", en: "2023—" },
      body: {
        pt: "Ciência da Computação (em andamento).",
        en: "B.Sc. Computer Science (ongoing).",
      },
    },
    {
      period: { pt: "Antes", en: "Before" },
      body: {
        pt: "Ensino médio técnico em TI — design, banco de dados, robótica, front-end.",
        en: "Technical high school in IT — design, databases, robotics, front-end.",
      },
    },
  ] satisfies TrajectoryEntry[],
  interests: {
    pt: "Fora do código: música, vinil e a cena de eventos de São Paulo.",
    en: "Off the clock: music, vinyl records and São Paulo's event scene.",
  } satisfies Record<"pt" | "en", string>,
};
