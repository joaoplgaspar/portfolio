import type { Project } from "@/types/project";

/**
 * "Product shot" do projeto. Sem Cloudinary ainda → placeholder tipográfico
 * com dimensões fixas (aspect-ratio) = zero layout shift.
 * Quando os covers reais entrarem (Fase 4), trocar por <CldImage>.
 */
export default function ProjectCover({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-[4px] border border-line bg-raised ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 120% at 82% 0%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 58%)",
        }}
      />
      <span className="absolute left-5 top-5 text-label text-muted">{project.type}</span>
      <span className="absolute right-5 top-5 text-label text-muted">{project.year}</span>
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <span className="font-display text-4xl font-semibold tracking-tight text-fg/90 sm:text-5xl">
          {project.client}
        </span>
      </div>
    </div>
  );
}
