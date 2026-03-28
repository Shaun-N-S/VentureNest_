import { IGetUserDashboardUseCase } from "@domain/interfaces/useCases/dashboard/IGetUserDashboardUseCase";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { ICapTableRepository } from "@domain/interfaces/repositories/ICapTableRepository";
import { IProjectMonthlyReportRepository } from "@domain/interfaces/repositories/IProjectMonthlyReportRepository";
import { UserDashboardResponseDTO } from "application/dto/dashboard/userDashboardDTO";
import { DashboardMapper } from "application/mappers/dashboardMapper";
import { ProjectEntity } from "@domain/entities/project/projectEntity";

export class GetUserDashboardUseCase implements IGetUserDashboardUseCase {
  constructor(
    private _projectRepo: IProjectRepository,
    private _dealRepo: IDealRepository,
    private _capTableRepo: ICapTableRepository,
    private _reportRepo: IProjectMonthlyReportRepository
  ) {}

  async execute(userId: string): Promise<UserDashboardResponseDTO> {
    const projects = await this._projectRepo.findByUserId(userId);

    let totalInvestment = 0;
    let totalInvestors = 0;

    const projectData = await Promise.all(
      projects.map(async (project: ProjectEntity) => {
        const deals = await this._dealRepo.findByProjectId(project._id!);
        const capTable = await this._capTableRepo.findByProjectId(project._id!);
        const latestReport = await this._reportRepo.findLatestByProjectId(project._id!);

        const dto = DashboardMapper.toProjectPerformanceDTO(project, deals, capTable, latestReport);

        // aggregate totals
        totalInvestment += dto.totalInvestment;
        totalInvestors += dto.investorsCount;

        return dto;
      })
    );

    return {
      totalProjects: projects.length,
      totalInvestment,
      totalInvestors,
      projects: projectData,
    };
  }
}
