import { UserStatus } from "@domain/enum/userStatus";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { IUpdateProjectStatusUseCase } from "@domain/interfaces/useCases/admin/project/IUpdateProjectStatusUseCase";
import { PROJECT_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { ProjectMapper } from "application/mappers/projectMapper";
import { ProjectResDTO } from "application/dto/project/projectDTO";

export class UpdateProjectStatusUseCase implements IUpdateProjectStatusUseCase {
  constructor(private _projectRepository: IProjectRepository) {}

  async updateProjectStatus(
    projectId: string,
    currentStatus: UserStatus
  ): Promise<{ project: ProjectResDTO }> {
    const newStatus = currentStatus === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE;

    const updatedProject = await this._projectRepository.updateStatus(projectId, newStatus);

    if (!updatedProject) {
      throw new NotFoundExecption(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }

    return {
      project: ProjectMapper.toDTO(updatedProject),
    };
  }
}
