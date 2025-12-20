import { ProjectResDTO } from "application/dto/project/projectDTO";

export interface IGetAllProjectsUseCase {
  getAllProjects(
    page: number,
    limit: number,
    status?: string,
    stage?: string[],
    search?: string
  ): Promise<{
    projects: ProjectResDTO[];
    totalPages: number;
    currentPage: number;
  }>;
}
