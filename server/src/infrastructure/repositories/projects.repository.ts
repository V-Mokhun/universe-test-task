import { IDatabase, IRepositoryData, ProjectCreate } from "@/shared/ports";
import { IProjectsRepository, Project } from "@/shared/ports";
import { GetProjectsQuery } from "@/modules/projects/projects.schema";
import { Prisma } from "@db";

export class ProjectsRepository implements IProjectsRepository {
  constructor(private readonly db: IDatabase) {}

  async create(userId: string, projectData: ProjectCreate): Promise<Project> {
    const project = await this.db.project.create({
      data: {
        ...projectData,
        userId,
      },
    });

    return project;
  }

  async findAllByUserId(
    userId: string,
    options: GetProjectsQuery
  ): Promise<{ projects: Project[]; total: number }> {
    const whereClause: Prisma.ProjectWhereInput = { userId };

    if (options.search && options.search.trim()) {
      const searchTerm = options.search.trim();
      whereClause.OR = [
        {
          owner: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    const [projects, total] = await Promise.all([
      this.db.project.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      }),
      this.db.project.count({
        where: whereClause,
      }),
    ]);

    return {
      projects,
      total,
    };
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.db.project.findUnique({
      where: { id },
    });

    return project;
  }

  async refresh(id: string, repositoryData: IRepositoryData): Promise<Project> {
    const project = await this.db.project.update({
      where: { id },
      data: repositoryData,
    });

    return project;
  }

  async delete(id: string): Promise<void> {
    await this.db.project.delete({
      where: { id },
    });
  }

  async findByUserAndRepo(
    userId: string,
    owner: string,
    name: string
  ): Promise<Project | null> {
    const project = await this.db.project.findFirst({
      where: {
        userId,
        owner,
        name,
      },
    });

    return project;
  }
}
