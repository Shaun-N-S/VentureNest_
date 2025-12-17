import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IFetchPersonalProjectsUseCase } from "@domain/interfaces/useCases/project/IFetchPersonalProjectsUseCase";
import { ProjectMapper } from "application/mappers/projectMapper";
import { ProjectResDTO } from "application/dto/project/projectDTO";

export class FetchPersonalProjectsUseCase implements IFetchPersonalProjectsUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _storageService: IStorageService
  ) {}

  async fetchPersonalProjects(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const { projects, total } = await this._projectRepository.findPersonalProjects(
      userId,
      skip,
      limit
    );

    const dtoProjects: ProjectResDTO[] = await Promise.all(
      projects.map(async (project) => {
        const dto = ProjectMapper.toDTO(project);

        dto.liked = project.likes.some((l) => l.likerId.toString() === userId);

        if (dto.logoUrl)
          dto.logoUrl = await this._storageService.createSignedUrl(dto.logoUrl, 10 * 60);

        if (dto.coverImageUrl)
          dto.coverImageUrl = await this._storageService.createSignedUrl(
            dto.coverImageUrl,
            10 * 60
          );

        return dto;
      })
    );

    return {
      projects: dtoProjects,
      totalProjects: total,
      hasNextPage: total > page * limit,
    };
  }
}
