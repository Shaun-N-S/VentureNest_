import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";
import { AdminProjectRegistrationDTO } from "application/dto/admin/adminProjectRegistrationDTO";

export interface IUpdateProjectRegistrationStatusUseCase {
  execute(
    registrationId: string,
    status: ProjectRegistrationStatus,
    reason?: string
  ): Promise<AdminProjectRegistrationDTO>;
}
