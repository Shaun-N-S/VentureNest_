import { ProjectEntity } from "@domain/entities/project/projectEntity";
import { StorageFolderNames } from "@domain/enum/storageFolderNames";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { ICreateProjectUseCase } from "@domain/interfaces/useCases/project/ICreateProjectUseCase";
import { CreateProjectDTO } from "application/dto/project/projectDTO";
import { ProjectMapper } from "application/mappers/projectMapper";

export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _storageService: IStorageService
  ) {}

  async createProject(data: CreateProjectDTO): Promise<{ projectId: string; logoUrl?: string }> {
    const { userId } = data;

    const uploadedPitchDeckUrl = data.pitchDeckUrl
      ? await this._storageService.upload(
          data.pitchDeckUrl,
          `${StorageFolderNames.PROJECT_PITCH_DECK}/${userId}-${Date.now()}`
        )
      : "";

    const uploadedLogoUrl = data.logoUrl
      ? await this._storageService.upload(
          data.logoUrl,
          `${StorageFolderNames.PROJECT_LOGO}/${userId}-${Date.now()}`
        )
      : "";

    const uploadedCoverImageUrl = data.coverImageUrl
      ? await this._storageService.upload(
          data.coverImageUrl,
          `${StorageFolderNames.PROJECT_COVER_IMAGE}/${userId}-${Date.now()}`
        )
      : "";

    const projectEntity: ProjectEntity = ProjectMapper.createToEntity({
      ...data,
      pitchDeckUrl: uploadedPitchDeckUrl,
      logoUrl: uploadedLogoUrl,
      coverImageUrl: uploadedCoverImageUrl,
    });

    const savedProject = await this._projectRepository.save(projectEntity);

    const signedLogoUrl = uploadedLogoUrl
      ? await this._storageService.createSignedUrl(uploadedLogoUrl, 600)
      : undefined;

    return {
      projectId: savedProject._id!,
      logoUrl: signedLogoUrl ?? "",
    };
  }
}
