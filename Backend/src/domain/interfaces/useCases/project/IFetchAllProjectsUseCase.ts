import { ProjectResDTO } from "application/dto/project/projectDTO";

export interface IFetchAllProjectsUseCase {
  fetchAllProjects(
    page: number,
    limit: number
  ): Promise<{
    projects: ProjectResDTO[];
    totalProjects: number;
    hasNextPage: boolean;
  }>;
}
