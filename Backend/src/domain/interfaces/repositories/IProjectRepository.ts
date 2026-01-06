import { ProjectEntity } from "@domain/entities/project/projectEntity";
import { IBaseRepository } from "./IBaseRepository";
import { PopulatedProjectRepoDTO } from "application/dto/project/projectDTO";
import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";

export interface IProjectRepository extends IBaseRepository<ProjectEntity> {
  findPersonalProjects(
    userId: string,
    skip: number,
    limit: number
  ): Promise<{ projects: ProjectEntity[]; total: number }>;

  findAllProjects(
    skip: number,
    limit: number,
    search?: string,
    stage?: string,
    sector?: string
  ): Promise<{ projects: ProjectEntity[]; total: number; hasNextPage: boolean }>;

  fetchPopulatedProjectById(id: string): Promise<PopulatedProjectRepoDTO | null>;

  addLike(projectId: string, likerId: string, likerRole: UserRole): Promise<void>;
  removeLike(projectId: string, likerId: string): Promise<void>;
  updateStatus(projectId: string, status: UserStatus): Promise<ProjectEntity | null>;
  findAllAdmin(
    skip: number,
    limit: number,
    status?: string,
    stage?: string,
    sector?: string,
    search?: string
  ): Promise<ProjectEntity[]>;

  countAdmin(status?: string, search?: string): Promise<number>;
  countProjectsByAuthor(userId: string): Promise<number>;
}
