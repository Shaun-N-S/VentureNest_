import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IFetchAllProjectsUseCase } from "@domain/interfaces/useCases/project/IFetchAllProjectsUseCase";
import { ProjectMapper } from "application/mappers/projectMapper";
import { ProjectResDTO } from "application/dto/project/projectDTO";
import { CONFIG } from "@config/config";
import { IProjectRegistrationRepository } from "@domain/interfaces/repositories/IProjectRegistrationRepository";

export class FetchAllProjectsUseCase implements IFetchAllProjectsUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectRegistrationRepository: IProjectRegistrationRepository,
    private _storageService: IStorageService
  ) {}

  async fetchAllProjects(
    userId: string,
    page: number,
    limit: number,
    search?: string,
    stage?: string,
    sector?: string
  ) {
    const skip = (page - 1) * limit;

    const { projects, total, hasNextPage } = await this._projectRepository.findAllProjects(
      skip,
      limit,
      search,
      stage,
      sector
    );

    const dtoProjects: ProjectResDTO[] = await Promise.all(
      projects.map(async (project) => {
        const dto = ProjectMapper.toDTO(project);

        const registration = await this._projectRegistrationRepository.findRegistrationByProjectId(
          project._id!
        );

        dto.registrationStatus = registration?.status ?? null;
        dto.rejectionReason = registration?.rejectionReason ?? null;

        dto.liked = project.likes.some((l) => l.likerId.toString() === userId);

        if (dto.logoUrl)
          dto.logoUrl = await this._storageService.createSignedUrl(
            dto.logoUrl,
            CONFIG.SIGNED_URL_EXPIRY
          );

        if (dto.coverImageUrl)
          dto.coverImageUrl = await this._storageService.createSignedUrl(
            dto.coverImageUrl,
            CONFIG.SIGNED_URL_EXPIRY
          );

        return dto;
      })
    );

    return {
      projects: dtoProjects,
      totalProjects: total,
      hasNextPage,
    };
  }
}
