import { ProjectEntity } from "@domain/entities/project/projectEntity";
import { IBaseRepository } from "./IBaseRepository";

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
}
