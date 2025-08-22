export * from "./http-client";
export * from "./base-service";
export * from "./auth-service";
export * from "./projects-service";

import { AuthService } from "./auth-service";
import { ProjectsService } from "./projects-service";

export const authService = new AuthService();
export const projectsService = new ProjectsService();
