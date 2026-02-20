import { CONFIG } from "@config/config";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IFetchProjectByIdUseCase } from "@domain/interfaces/useCases/project/IFetchProjectByIdUseCase";
import { PROJECT_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { ProjectResDTO } from "application/dto/project/projectDTO";
import { ProjectMapper } from "application/mappers/projectMapper";

export class FetchProjectByIdUseCase implements IFetchProjectByIdUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _storageService: IStorageService
  ) {}

  async fetchProjectById(projectId: string, userId: string): Promise<ProjectResDTO> {
    const populatedProject = await this._projectRepo.fetchPopulatedProjectById(projectId);

    if (!populatedProject) throw new NotFoundExecption(PROJECT_ERRORS.NO_PROJECTS_FOUND);

    const dto = ProjectMapper.toDTOFromPopulatedRepo(populatedProject);

    if (dto.user) {
      dto.user.profileImg = dto.user.profileImg
        ? await this._storageService.createSignedUrl(dto.user.profileImg, CONFIG.SIGNED_URL_EXPIRY)
        : null;
    }

    if (dto.logoUrl) {
      dto.logoUrl = await this._storageService.createSignedUrl(
        dto.logoUrl,
        CONFIG.SIGNED_URL_EXPIRY
      );
    }

    if (dto.coverImageUrl) {
      dto.coverImageUrl = await this._storageService.createSignedUrl(
        dto.coverImageUrl,
        CONFIG.SIGNED_URL_EXPIRY
      );
    }

    if (dto.pitchDeckUrl) {
      dto.pitchDeckUrl = await this._storageService.createSignedUrl(
        dto.pitchDeckUrl,
        CONFIG.SIGNED_URL_EXPIRY
      );
    }

    dto.liked = dto.likes.some((u) => u.likerId === userId);

    return dto;
  }
}
