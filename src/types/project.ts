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

/**
 * Case study tratada como página de produto (PDP).
 * Espelha a coleção `projects` do Firestore (Seção 8 do brief).
 */
export interface Project {
  slug: string; // único, canonical
  title: string;
  client: string;
  role: string; // "Front-end · Motion"
  year: number;
  type: string; // "E-commerce" | "Landing" | "App" | ...
  stack: string[];
  summary: Localized;
  problem: Localized;
  contribution: Localized;
  results: ProjectResult[];
  cover: string; // Cloudinary public_id
  gallery: string[]; // Cloudinary public_ids
  featured: boolean; // aparece na home
  published: boolean;
  order: number;
}
