import { ProjectResDTO } from "application/dto/project/projectDTO";

export interface IFetchAllProjectsUseCase {
  fetchAllProjects(
    userId: string,
    page: number,
    limit: number,
    search?: string,
    stage?: string,
    sector?: string
  ): Promise<{
    projects: ProjectResDTO[];
    totalProjects: number;
    hasNextPage: boolean;
  }>;
}
