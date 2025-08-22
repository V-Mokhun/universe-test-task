import { z } from "zod";

export interface Project {
  id: string;
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  repoCreatedAt: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export const createProjectSchema = z.object({
  repositoryPath: z
    .string()
    .min(1, "Repository path is required")
    .regex(
      /^[^/]+\/[^/]+$/,
      "Repository path must be in format: owner/repository-name"
    ),
});

export type CreateProjectBody = z.infer<typeof createProjectSchema>;
export type CreateProjectResponse = {
  project: Project;
};

export const getProjectsOptionsSchema = z.object({
  page: z.coerce.number().min(1, "Page must be greater than 0").default(1),
  limit: z.coerce
    .number()
    .min(1, "Limit must be greater than 0")
    .max(100, "Limit must be less than 100")
    .default(10),
  search: z.string().optional(),
});
export type GetProjectsOptions = z.infer<typeof getProjectsOptionsSchema>;

export type GetProjectsResponse = {
  projects: Project[];
  total: number;
};

export type RefreshProjectResponse = {
  project: Project;
};
