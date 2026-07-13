import type { Localized } from "@/types/project";

export interface Fact {
  label: Localized;
  value: string;
}

/** ⚠️ Copy PLACEHOLDER — ajustar com a história real. */
export const about = {
  paragraphs: {
    pt: [
      "Sou desenvolvedor front-end com foco em e-commerce premium. Gosto do encontro entre engenharia e estética: código limpo que também é bonito de usar.",
      "Trabalho com Shopify, headless (Hydrogen) e experiências em 3D/motion — sempre com performance como requisito. Um dev de e-commerce que carrega devagar contradiz o próprio pitch.",
      "Multidisciplinar por natureza: passo do variant selector ao shader, da arquitetura de componentes ao design de interação, sem perder o fio.",
    ],
    en: [
      "I'm a front-end developer focused on premium e-commerce. I like where engineering meets aesthetics: clean code that's also a pleasure to use.",
      "I work with Shopify, headless (Hydrogen) and 3D/motion experiences — always with performance as a requirement. An e-commerce dev that loads slowly contradicts the pitch.",
      "Multidisciplinary by nature: I go from variant selector to shader, from component architecture to interaction design, without losing the thread.",
    ],
  } satisfies Record<"pt" | "en", string[]>,
  facts: [
    { label: { pt: "Base", en: "Based in" }, value: "Brasil" },
    { label: { pt: "Foco", en: "Focus" }, value: "E-commerce · Front-end" },
    { label: { pt: "Stack", en: "Stack" }, value: "React · Next.js · Shopify" },
    { label: { pt: "Extra", en: "Extra" }, value: "3D · GSAP · Performance" },
  ] satisfies Fact[],
  interests: {
    pt: "Fora do código: música, vinil e times de futebol perdidos.",
    en: "Off the clock: music, vinyl and hopeless football teams.",
  } satisfies Record<"pt" | "en", string>,
};
