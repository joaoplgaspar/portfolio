import { Link } from "@/i18n/navigation";
import type { Project } from "@/types/project";
import type { Locale } from "@/i18n/routing";
import ProjectCover from "./ProjectCover";

export default function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  return (
    <Link href={`/trabalho/${project.slug}`} className="group block">
      <ProjectCover
        project={project}
        className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
      />
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="text-h3 transition-colors group-hover:text-accent-lift">
          {project.title}
        </h3>
        <span className="shrink-0 text-label text-muted">↗</span>
      </div>
      <p className="mt-2 text-muted">{project.summary[locale]}</p>
      <p className="mt-3 text-label">
        <span className="text-accent-lift">{project.role}</span>
        <span className="text-muted"> · {project.type}</span>
      </p>
    </Link>
  );
}
