import { NextFunction, Response } from "express";
import { Project } from "@/shared/ports";
import {
  AddProjectRequest,
  DeleteProjectRequest,
  GetProjectsRequest,
  RefreshProjectRequest,
} from "./projects.types";
import { AuthenticatedRequest } from "@/middleware";
import { GetProjectsQuery } from "./projects.schema";

export interface IProjectsService {
  getAllProjects(
    userId: string,
    options: GetProjectsQuery
  ): Promise<{ projects: Project[]; total: number }>;
  getProjectById(id: string): Promise<Project>;
  addProject(userId: string, repositoryPath: string): Promise<Project>;
  refreshProject(id: string, userId: string): Promise<Project>;
  deleteProject(id: string, userId: string): Promise<void>;
}

export class ProjectsController {
  constructor(private readonly service: IProjectsService) {}

  async getAllProjects(
    req: GetProjectsRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, limit } = req.parsedQuery;

      const { projects, total } = await this.service.getAllProjects(
        req.user.id,
        {
          page,
          limit,
        }
      );
      res.status(200).json({ projects, total });
    } catch (error) {
      next(error);
    }
  }

  async getProjectById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const project = await this.service.getProjectById(id);
      res.status(200).json({ project });
    } catch (error) {
      next(error);
    }
  }

  async addProject(req: AddProjectRequest, res: Response, next: NextFunction) {
    try {
      const { repositoryPath } = req.body;
      const userId = (req as AuthenticatedRequest).user.id;

      const project = await this.service.addProject(userId, repositoryPath);
      res.status(201).json({ project });
    } catch (error) {
      next(error);
    }
  }

  async refreshProject(
    req: RefreshProjectRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const userId = (req as AuthenticatedRequest).user.id;

      const project = await this.service.refreshProject(id, userId);
      res.status(200).json({ project });
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(
    req: DeleteProjectRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const userId = (req as AuthenticatedRequest).user.id;

      await this.service.deleteProject(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
