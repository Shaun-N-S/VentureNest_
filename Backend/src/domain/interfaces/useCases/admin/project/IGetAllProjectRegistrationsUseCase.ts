import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";
import { AdminProjectRegistrationDTO } from "application/dto/admin/adminProjectRegistrationDTO";

export interface IGetAllProjectRegistrationsUseCase {
  execute(
    page: number,
    limit: number,
    status?: ProjectRegistrationStatus
  ): Promise<{
    registrations: AdminProjectRegistrationDTO[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>;
}
