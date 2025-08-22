import { IDatabase } from "@/shared/ports";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { ProjectsRepository } from "@/infrastructure/repositories/projects.repository";
import { GitHubProvider } from "@/infrastructure/providers/github.provider";
import { ILogger } from "@/shared/logger/logger.interface";

export const createProjectsController = (dependencies: {
  db: IDatabase;
  logger: ILogger;
  accessToken: string;
}) => {
  const { db, logger, accessToken } = dependencies;

  const projectsRepository = new ProjectsRepository(db);
  const githubProvider = new GitHubProvider(logger, accessToken);

  const projectsService = new ProjectsService(
    projectsRepository,
    githubProvider
  );

  const projectsController = new ProjectsController(projectsService);

  return projectsController;
};
