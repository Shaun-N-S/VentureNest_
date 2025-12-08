import { StorageFolderNames } from "@domain/enum/storageFolderNames";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IUpdateProjectUseCase } from "@domain/interfaces/useCases/project/IUpdateProjectUseCase";
import { ProjectRepository } from "@infrastructure/repostiories/projectRepository";
import { PROJECT_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { UpdateProjectDTO } from "application/dto/project/projectDTO";
import { ProjectMapper } from "application/mappers/projectMapper";

export class UpdateProjectUseCase implements IUpdateProjectUseCase {
  constructor(
    private _projectRepository: ProjectRepository,
    private _storageService: IStorageService
  ) {}

  async updateProject(data: UpdateProjectDTO): Promise<{ projectId: string; logoUrl?: string }> {
    const { projectId, userId } = data;

    const existingProject = await this._projectRepository.findById(projectId);
    if (!existingProject) {
      throw new NotFoundExecption(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }

    const uploadedPitchDeckUrl = data.pitchDeckUrl
      ? await this._storageService.upload(
          data.pitchDeckUrl,
          `${StorageFolderNames.PROJECT_PITCH_DECK}/${userId}-${Date.now()}`
        )
      : undefined;

    const uploadedCoverImageUrl = data.coverImageUrl
      ? await this._storageService.upload(
          data.coverImageUrl,
          `${StorageFolderNames.PROJECT_COVER_IMAGE}/${userId}-${Date.now()}`
        )
      : undefined;

    const uploadedLogoUrl = data.logoUrl
      ? await this._storageService.upload(
          data.logoUrl,
          `${StorageFolderNames.PROJECT_LOGO}/${userId}-${Date.now()}`
        )
      : undefined;

    const dtoForUpdate = {
      ...data,
      pitchDeckUrl: uploadedPitchDeckUrl ?? existingProject.pitchDeckUrl,
      coverImageUrl: uploadedCoverImageUrl ?? existingProject.coverImageUrl,
      logoUrl: uploadedLogoUrl ?? existingProject.logoUrl,
    };

    const updatedEntity = ProjectMapper.updateToEntity(existingProject, dtoForUpdate);

    await this._projectRepository.update(projectId, updatedEntity);

    let signedLogoUrl: string | undefined;
    if (uploadedLogoUrl) {
      signedLogoUrl = await this._storageService.createSignedUrl(uploadedLogoUrl, 600);
    }

    return { projectId, logoUrl: signedLogoUrl! };
  }
}
