import { z } from "zod";

export const repositorySchema = z.object({
  owner: z.string(),
  name: z.string(),
  url: z.url(),
  stars: z.coerce.number(),
  forks: z.coerce.number(),
  openIssues: z.coerce.number(),
  repoCreatedAt: z.coerce.number(),
});

export type IRepositoryData = z.infer<typeof repositorySchema>;

export interface IProjectsProvider {
  getRepositoryData(repositoryPath: string): Promise<IRepositoryData>;
}
