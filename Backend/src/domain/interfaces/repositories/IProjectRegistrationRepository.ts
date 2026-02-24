import { ProjectRegistrationEntity } from "domain/entities/project/projectRegistrationEntity";
import { IBaseRepository } from "./IBaseRepository";
import { ClientSession } from "mongoose";
import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";
import { PopulatedProjectRegistrationRepoDTO } from "application/dto/admin/projectRegistrationRepoDTO";

export interface IProjectRegistrationRepository extends IBaseRepository<ProjectRegistrationEntity> {
  findRegistrationByProjectId(
    projectId: string,
    session?: ClientSession
  ): Promise<ProjectRegistrationEntity | null>;

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
    status: ProjectRegistrationStatus,
    rejectionReason?: string
  ): Promise<ProjectRegistrationEntity | null>;

  findAllAdmin(
    skip: number,
    limit: number,
    status?: ProjectRegistrationStatus,
    search?: string
  ): Promise<PopulatedProjectRegistrationRepoDTO[]>;

  countAdmin(status?: ProjectRegistrationStatus, search?: string): Promise<number>;

  findByIdPopulated(registrationId: string): Promise<PopulatedProjectRegistrationRepoDTO | null>;
}
