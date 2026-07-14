/** Texto bilíngue (PT default, EN alavanca de dólar). */
export interface Localized {
  pt: string;
  en: string;
}

/** Resultado com métrica (ex.: { label: "LCP", value: "4.1s → 1.8s" }). */
export interface ProjectResult {
  label: string;
  value: string;
}

/** Bloco de corpo de case (para PDPs ricas). Texto suporta `inline code` com crases. */
export type CaseBlock =
  | { kind: "heading"; text: string }
  | { kind: "text"; text: string }
  | { kind: "list"; items: { label?: string; text: string }[] };

/**
 * Case study tratada como página editorial de engenharia.
 * Espelha a coleção `projects` do Firestore.
 */
export interface Project {
  slug: string; // único, canonical
  title: string;
  client: Localized; // "Projeto próprio" / "Own product"
  role: Localized; // "Design, front-end e back-end serverless"
  year: number;
  type: Localized; // "Product · Full-stack"
  stack: string[];
  summary: Localized;
  problem: Localized;
  contribution: Localized;
  results: ProjectResult[];
  /** Corpo rico opcional. Quando presente, a PDP o renderiza no lugar de problema/contribuição. */
  body?: { pt: CaseBlock[]; en: CaseBlock[] };
  cover: string; // Cloudinary public_id
  gallery: string[]; // Cloudinary public_ids
  featured: boolean;
  published: boolean;
  order: number;
}
