import { z } from "zod";

export const GetProjectsQuerySchema = z.object({
  page: z.coerce.number().min(1, "Page must be greater than 0").default(1),
  limit: z.coerce
    .number()
    .min(1, "Limit must be greater than 0")
    .max(100, "Limit must be less than 100")
    .default(10),
  search: z.string().optional(),
});

export type GetProjectsQuery = z.infer<typeof GetProjectsQuerySchema>;

export const AddProjectSchema = z
  .object({
    repositoryPath: z
      .string()
      .min(1, "Repository path is required")
      .regex(
        /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/,
        "Invalid repository path format. Use: owner/repo"
      ),
  })
  .strict();

export type AddProjectBody = z.infer<typeof AddProjectSchema>;
