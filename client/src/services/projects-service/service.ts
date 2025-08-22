import { BaseService } from "../base-service";
import type { IHttpClient } from "../http-client";
import type {
  CreateProjectBody,
  GetProjectsOptions,
  GetProjectsResponse,
  RefreshProjectResponse,
  CreateProjectResponse,
} from "./types";

export class ProjectsService extends BaseService {
  constructor(httpClient?: IHttpClient) {
    super(httpClient);
  }

  async getProjects(
    options: GetProjectsOptions
  ): Promise<{ data?: GetProjectsResponse; error?: string }> {
    const queryString = await this.httpClient.constructQueryString({
      page: options.page.toString(),
      limit: options.limit.toString(),
      ...(options.search ? { search: options.search } : {}),
    });

    const response = await this.get<GetProjectsResponse>(
      `/projects${queryString}`
    );

    if (response.data) {
      return { data: response.data };
    }

    return { error: response.error || "Failed to fetch projects" };
  }

  async createProject(
    data: CreateProjectBody
  ): Promise<{ data?: CreateProjectResponse; error?: string; status: number }> {
    const response = await this.post<CreateProjectResponse>("/projects", data);

    if (response.data) {
      return { data: response.data, status: response.status };
    }

    return {
      error: response.error || "Failed to create project",
      status: response.status,
    };
  }

  async deleteProject(
    projectId: string
  ): Promise<{ success?: boolean; error?: string }> {
    const response = await this.delete(`/projects/${projectId}`);

    if (response.status === 200 || response.status === 204) {
      return { success: true };
    }

    return { error: response.error || "Failed to delete project" };
  }

  async refreshProject(
    projectId: string
  ): Promise<{ data?: RefreshProjectResponse; error?: string }> {
    const response = await this.put<RefreshProjectResponse>(
      `/projects/${projectId}/refresh`
    );

    if (response.data) {
      return { data: response.data };
    }

    return { error: response.error || "Failed to refresh project" };
  }
}
