import { ProjectEntity } from "@domain/entities/project/projectEntity";
import { IBaseRepository } from "./IBaseRepository";
import { PopulatedProjectRepoDTO } from "application/dto/project/projectDTO";

export interface IProjectRepository extends IBaseRepository<ProjectEntity> {
  findPersonalProjects(
    userId: string,
    skip: number,
    limit: number
  ): Promise<{ projects: ProjectEntity[]; total: number }>;

  findAllProjects(
    skip: number,
    limit: number
  ): Promise<{ projects: ProjectEntity[]; total: number; hasNextPage: boolean }>;

  fetchPopulatedProjectById(id: string): Promise<PopulatedProjectRepoDTO | null>;
}
