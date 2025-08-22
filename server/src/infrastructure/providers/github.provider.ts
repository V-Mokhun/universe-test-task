import { ILogger } from "@/shared/logger/logger.interface";
import {
  IProjectsProvider,
  IRepositoryData,
  repositorySchema,
} from "@/shared/ports";
import { BadRequestException, NotFoundException } from "@/shared/exceptions";

export class GitHubProvider implements IProjectsProvider {
  constructor(
    private readonly logger: ILogger,
    private readonly accessToken: string
  ) {}

  private async getOctokit() {
    const { Octokit } = await import("@octokit/core");
    return new Octokit({ auth: this.accessToken });
  }

  async getRepositoryData(repositoryPath: string): Promise<IRepositoryData> {
    try {
      const [owner, repo] = repositoryPath.split("/");
      const octokit = await this.getOctokit();
      const response = await octokit.request("GET /repos/{owner}/{repo}", {
        owner,
        repo,
      });

      if (response.status !== 200) {
        if (response.status === 404) {
          throw new NotFoundException("Repository not found");
        }
        this.logger.error({
          message: `GitHub API error: ${response.status}`,
          meta: {
            owner,
            repo,
            response: response.data,
          },
        });
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = repositorySchema.safeParse({
        owner: response.data.owner.login,
        name: response.data.name,
        url: response.data.html_url,
        stars: response.data.stargazers_count,
        forks: response.data.forks_count,
        openIssues: response.data.open_issues_count,
        repoCreatedAt: Math.floor(new Date(response.data.created_at).getTime() / 1000),
      });

      if (!data.success) {
        this.logger.error({
          message: "Invalid repository data",
          error: {
            message: data.error.message,
            name: data.error.name,
            stack: data.error.stack,
          },
        });
        throw new BadRequestException("Invalid repository data");
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      this.logger.error({
        message: "Failed to fetch repository data from GitHub",
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          name: error instanceof Error ? error.name : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        },
      });
      throw new Error("Failed to fetch repository data from GitHub");
    }
  }
}
