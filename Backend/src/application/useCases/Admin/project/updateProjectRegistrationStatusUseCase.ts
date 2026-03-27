import { IProjectRegistrationRepository } from "@domain/interfaces/repositories/IProjectRegistrationRepository";
import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";
import { NotFoundExecption } from "application/constants/exceptions";
import { ProjectRegistrationMapper } from "application/mappers/projectRegistrationMapper";
import { Errors, PROJECT_ERRORS } from "@shared/constants/error";
import { IUpdateProjectRegistrationStatusUseCase } from "@domain/interfaces/useCases/admin/project/IUpdateProjectRegistrationStatusUseCase";

export class UpdateProjectRegistrationStatusUseCase
  implements IUpdateProjectRegistrationStatusUseCase
{
  constructor(private _repo: IProjectRegistrationRepository) {}

  async execute(registrationId: string, status: ProjectRegistrationStatus, reason?: string) {
    if (status === ProjectRegistrationStatus.REJECTED && (!reason || reason.trim() === "")) {
      throw new NotFoundExecption(Errors.INVALID_DATA);
    }

    const updated = await this._repo.verifyProjectRegistration(registrationId, status, reason);

    if (!updated) {
      throw new NotFoundExecption(PROJECT_ERRORS.PROJECT_REGISTRATION_NOT_FOUND);
    }

    const populated = await this._repo.findByIdPopulated(registrationId);

    if (!populated) {
      throw new NotFoundExecption(PROJECT_ERRORS.PROJECT_REGISTRATION_NOT_FOUND);
    }

    return ProjectRegistrationMapper.toAdminDTO(populated);
  }
}
