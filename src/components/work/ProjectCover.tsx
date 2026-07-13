import { CldImage } from "next-cloudinary";
import type { Project } from "@/types/project";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Cover do projeto. Se houver `cover` (Cloudinary public_id) e cloud configurado,
 * renderiza a imagem; senão, placeholder tipográfico (dimensões fixas = zero CLS).
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
      {CLOUD && project.cover ? (
        <CldImage
          src={project.cover}
          width={1280}
          height={960}
          crop="fill"
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
