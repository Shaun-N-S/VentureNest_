import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { ProjectMapper } from "application/mappers/projectMapper";
import { ProjectResDTO } from "application/dto/project/projectDTO";
import { IGetAllProjectsUseCase } from "@domain/interfaces/useCases/admin/project/IGetAlllProjectUseCase";

export class GetAllProjectsUseCase implements IGetAllProjectsUseCase {
  constructor(private _projectRepository: IProjectRepository) {}

  async getAllProjects(
    page: number,
    limit: number,
    status?: string,
    stage?: string[],
    search?: string
  ): Promise<{
    projects: ProjectResDTO[];
    totalPages: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;

    console.log("stages : ", stage);

    const [projects, totalProjects] = await Promise.all([
      this._projectRepository.findAllAdmin(skip, limit, status, stage, search),
      this._projectRepository.countAdmin(status, search),
    ]);

    const projectDTOs = projects.map((project) => ProjectMapper.toDTO(project));

    return {
      projects: projectDTOs,
      totalPages: Math.ceil(totalProjects / limit),
      currentPage: page,
    };
  }
}
