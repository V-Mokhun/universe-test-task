import { ProjectCard } from "./project-card";
import type { Project } from "@/services";

interface ProjectsGridProps {
  projects: Project[];
  onDelete: (projectId: string) => Promise<void>;
  onRefresh: (projectId: string) => Promise<void>;
  isDeletePending: boolean;
  isRefreshPending: boolean;
}

export const ProjectsGrid = ({
  projects,
  onDelete,
  onRefresh,
  isDeletePending,
  isRefreshPending,
}: ProjectsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={onDelete}
          onRefresh={onRefresh}
          isDeletePending={isDeletePending}
          isRefreshPending={isRefreshPending}
        />
      ))}
    </div>
  );
};
