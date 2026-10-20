import type { Localized } from "@/types/project";

export interface LabItem {
  title: Localized;
  desc: Localized;
  tag: string;
  href?: string;
}

/** ⚠️ PLACEHOLDER — experimentos do /lab (3D, GSAP, curiosidades). */
export const lab: LabItem[] = [
  {
    title: { pt: "Bat-Signal 3D", en: "3D Bat-Signal" },
    desc: {
      pt: "Estudo de facho volumétrico e bloom em React Three Fiber.",
      en: "Study of volumetric light and bloom in React Three Fiber.",
    },
    tag: "R3F",
  },
  {
    title: { pt: "Descida oceânica", en: "Ocean descent" },
    desc: {
      pt: "Scroll controlando profundidade, névoa e bioluminescência.",
      en: "Scroll driving depth, fog and bioluminescence.",
    },
    tag: "GSAP",
  },
  {
    title: { pt: "Pack opening", en: "Pack opening" },
    desc: {
      pt: "Microinteração de abertura de carta com brilho e stagger.",
      en: "Card-reveal microinteraction with shine and stagger.",
    },
    tag: "Motion",
  },
];
