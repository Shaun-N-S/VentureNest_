import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { AdminProjectMapper } from "application/mappers/adminProjectMapper";
import { NotFoundExecption } from "application/constants/exceptions";
import { PROJECT_ERRORS } from "@shared/constants/error";
import { IGetProjectByIdUseCase } from "@domain/interfaces/useCases/admin/project/IGetProjectByIdUseCase";
import { AdminProjectResDTO } from "application/dto/project/projectDTO";
import { CONFIG } from "@config/config";

export class GetProjectByIdUseCase implements IGetProjectByIdUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _storageService: IStorageService
  ) {}

  async execute(projectId: string): Promise<AdminProjectResDTO> {
    const project = await this._projectRepo.fetchPopulatedProjectById(projectId);

    if (!project) {
      throw new NotFoundExecption(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }

    const dto = AdminProjectMapper.toDTO(project);

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

    if (dto.owner.profileImg) {
      dto.owner.profileImg = await this._storageService.createSignedUrl(
        dto.owner.profileImg,
        CONFIG.SIGNED_URL_EXPIRY
      );
    }

    return dto;
  }
}
