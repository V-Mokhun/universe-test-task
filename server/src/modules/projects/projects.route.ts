import { authMiddleware, queryValidator } from "@/middleware";
import { Router } from "express";
import { ProjectsController } from "./projects.controller";
import {
  AddProjectRequest,
  DeleteProjectRequest,
  GetProjectsRequest,
  RefreshProjectRequest,
} from "./projects.types";
import { GetProjectsQuerySchema } from "./projects.schema";

export const createProjectsRouter = (controller: ProjectsController) => {
  const router = Router();

  router.use(authMiddleware);

  router.get("/", queryValidator(GetProjectsQuerySchema), (req, res, next) =>
    controller.getAllProjects(req as unknown as GetProjectsRequest, res, next)
  );

  router.post("/", (req, res, next) =>
    controller.addProject(req as AddProjectRequest, res, next)
  );

  router.delete("/:id", (req, res, next) =>
    controller.deleteProject(req as DeleteProjectRequest, res, next)
  );

  router.put("/:id/refresh", (req, res, next) =>
    controller.refreshProject(req as RefreshProjectRequest, res, next)
  );

  return router;
};
