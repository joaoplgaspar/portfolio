/** Slugs que têm figura. Módulo neutro: server e client importam daqui. */
export const FIGURED = ["roland-boss", "integral-medica-darkness", "hsm-singularity", "livra"] as const;

export function hasFigure(slug: string) {
  return (FIGURED as readonly string[]).includes(slug);
}

/**
 * Entra no índice: tem figura e está publicado. Em dev o rascunho com figura
 * também aparece, para revisar antes de publicar.
 */
export function isShown(p: { slug: string; published: boolean }) {
  return hasFigure(p.slug) && (p.published || process.env.NODE_ENV !== "production");
}
