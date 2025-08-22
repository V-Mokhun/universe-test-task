import { Project as DbProject } from "@db";

export type Project = DbProject;
export type ProjectCreate = Omit<
  Project,
  "id" | "userId" | "createdAt" | "updatedAt"
>;
export type ProjectUpdate = Partial<ProjectCreate>;
