import { ProjectResDTO } from "application/dto/project/projectDTO";

export interface IFetchPersonalProjectsUseCase {
  fetchPersonalProjects(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    projects: ProjectResDTO[];
    totalProjects: number;
    hasNextPage: boolean;
  }>;
}
