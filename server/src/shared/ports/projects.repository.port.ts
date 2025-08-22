import { GetProjectsQuery } from "@/modules/projects/projects.schema";
import { Project, ProjectCreate } from "./project.port";
import { IRepositoryData } from "./projects.provider.port";

export interface IProjectsRepository {
  create(userId: string, projectData: ProjectCreate): Promise<Project>;
  findAllByUserId(
    userId: string,
    options: GetProjectsQuery
  ): Promise<{ projects: Project[]; total: number }>;
  findById(id: string): Promise<Project | null>;
  refresh(id: string, repositoryData: IRepositoryData): Promise<Project>;
  delete(id: string): Promise<void>;
  findByUserAndRepo(
    userId: string,
    owner: string,
    name: string
  ): Promise<Project | null>;
}
