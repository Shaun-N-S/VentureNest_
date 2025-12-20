import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IRemoveProjectUseCase } from "@domain/interfaces/useCases/project/IRemoveProjectsUseCase";
import { Errors, PROJECT_ERRORS } from "@shared/constants/error";
import { InvalidDataException, NotFoundExecption } from "application/constants/exceptions";

export class RemoveProjectUseCase implements IRemoveProjectUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _storageService: IStorageService
  ) {}

  async removeProject(projectId: string, userId: string): Promise<{ projectId: string }> {
    const project = await this._projectRepository.findById(projectId);

    if (!project) throw new NotFoundExecption(PROJECT_ERRORS.NO_PROJECTS_FOUND);

    if (project.userId.toString() !== userId) {
      throw new InvalidDataException(Errors.UNAUTHORIZED_ACCESS);
    }

    await this._projectRepository.update(projectId, { isActive: false });

    const assets = [project.logoUrl, project.coverImageUrl, project.pitchDeckUrl].filter(Boolean);

    await Promise.all(assets.map((a) => this._storageService.delete(a!)));

    return { projectId };
  }
}
