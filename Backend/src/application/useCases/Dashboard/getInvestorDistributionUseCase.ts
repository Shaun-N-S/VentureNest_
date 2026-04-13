import { IGetInvestorDistributionUseCase } from "@domain/interfaces/useCases/dashboard/IGetInvestorDistributionUseCase";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { InvestorDistributionDTO } from "application/dto/dashboard/investorDistributionDTO";
import { InvestorDashboardMapper } from "application/mappers/investorDashboardMapper";

export class GetInvestorDistributionUseCase implements IGetInvestorDistributionUseCase {
  constructor(
    private _dealRepo: IDealRepository,
    private _projectRepo: IProjectRepository
  ) {}

  async execute(investorId: string): Promise<InvestorDistributionDTO> {
    const projectInvestments = await this._dealRepo.getInvestorProjectInvestment(investorId);

    const projectIds = projectInvestments.map((p) => p.projectId);

    const projects = await this._projectRepo.findByIds(projectIds);

    return InvestorDashboardMapper.toDistributionDTO(projectInvestments, projects);
  }
}
