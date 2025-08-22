import {
  IProjectsRepository,
  IProjectsProvider,
  Project,
} from "@/shared/ports";
import { IProjectsService } from "./projects.controller";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@/shared/exceptions";
import { getRepositoryPath, splitRepositoryPath } from "./projects.lib";
import { GetProjectsQuery } from "./projects.schema";

export class ProjectsService implements IProjectsService {
  constructor(
    private readonly repo: IProjectsRepository,
    private readonly provider: IProjectsProvider
  ) {}

  async getAllProjects(
    userId: string,
    options: GetProjectsQuery
  ): Promise<{ projects: Project[]; total: number }> {
    return this.repo.findAllByUserId(userId, options);
  }

  async getProjectById(id: string): Promise<Project> {
    const project = await this.repo.findById(id);
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    return project;
  }

  async addProject(userId: string, repositoryPath: string): Promise<Project> {
    const { owner, name } = splitRepositoryPath(repositoryPath);
    const existingProject = await this.repo.findByUserAndRepo(
      userId,
      owner,
      name
    );
    if (existingProject) {
      throw new BadRequestException("Project already exists");
    }

    const repositoryData = await this.provider.getRepositoryData(
      repositoryPath
    );

    const project = await this.repo.create(userId, repositoryData);

    return project;
  }

  async refreshProject(id: string, userId: string): Promise<Project> {
    const existingProject = await this.repo.findById(id);
    if (!existingProject) {
      throw new NotFoundException("Project not found");
    }
    if (existingProject.userId !== userId) {
      throw new ForbiddenException("Project does not belong to user");
    }

    const repositoryPath = getRepositoryPath(
      existingProject.owner,
      existingProject.name
    );
    const repositoryData = await this.provider.getRepositoryData(
      repositoryPath
    );

    const project = await this.repo.refresh(id, repositoryData);
    return project;
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    const existingProject = await this.repo.findById(id);
    if (!existingProject) {
      throw new NotFoundException("Project not found");
    }
    if (existingProject.userId !== userId) {
      throw new ForbiddenException("Project does not belong to user");
    }

    await this.repo.delete(id);
  }
}
