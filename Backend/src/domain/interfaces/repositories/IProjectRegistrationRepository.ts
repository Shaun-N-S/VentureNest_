import { ProjectRegistrationEntity } from "domain/entities/project/projectRegistrationEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IProjectRegistrationRepository extends IBaseRepository<ProjectRegistrationEntity> {
  findRegistrationByProjectId(projectId: string): Promise<ProjectRegistrationEntity | null>;

  findRegistrationsByFounderId(
    founderId: string,
    skip: number,
    limit: number
  ): Promise<{
    registrations: ProjectRegistrationEntity[];
    total: number;
    hasNextPage: boolean;
  }>;

  verifyProjectRegistration(
    registrationId: string,
    status: string,
    verifyProfile: boolean
  ): Promise<ProjectRegistrationEntity | null>;
}
