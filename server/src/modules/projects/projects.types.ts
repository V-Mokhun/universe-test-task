import { AddProjectBody } from "./projects.schema";
import { AuthenticatedRequest } from "@/middleware";
import { GetProjectsQuery } from "./projects.schema";

export type GetProjectsRequest = AuthenticatedRequest<
  {},
  {},
  {},
  GetProjectsQuery
>;
export type AddProjectRequest = AuthenticatedRequest<{}, {}, AddProjectBody>;
export type RefreshProjectRequest = AuthenticatedRequest<{ id: string }>;
export type DeleteProjectRequest = AuthenticatedRequest<{ id: string }>;
