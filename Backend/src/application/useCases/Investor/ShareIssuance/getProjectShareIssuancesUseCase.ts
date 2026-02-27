import { IGetProjectShareIssuancesUseCase } from "@domain/interfaces/useCases/shareIssuance/IGetProjectShareIssuancesUseCase";
import { IShareIssuanceRepository } from "@domain/interfaces/repositories/IShareIssuanceRepository";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { NotFoundExecption } from "application/constants/exceptions";
import { Errors } from "@shared/constants/error";
import { ProjectShareIssuanceDTO } from "application/dto/investor/shareIssuance/getProjectShareIssuancesDTO";
import { ProjectShareIssuanceMapper } from "application/mappers/projectShareIssuanceMapper";

export class GetProjectShareIssuancesUseCase implements IGetProjectShareIssuancesUseCase {
  constructor(
    private readonly _shareIssuanceRepository: IShareIssuanceRepository,
    private readonly _investorRepository: IInvestorRepository
  ) {}

  async execute(projectId: string): Promise<ProjectShareIssuanceDTO[]> {
    if (!projectId) {
      throw new NotFoundExecption(Errors.INVALID_DATA);
    }

    const issuances = await this._shareIssuanceRepository.findByProjectId(projectId);

    if (!issuances.length) {
      return [];
    }

    const investorIds = issuances.map((i) => i.investorId);

    const investors = await this._investorRepository.findByIds(investorIds);

    const investorMap: Map<string, string> = new Map(
      investors.map((investor) => [investor._id!, investor.userName])
    );

    return issuances.map((issuance) =>
      ProjectShareIssuanceMapper.toDTO(issuance, investorMap.get(issuance.investorId) ?? "Unknown")
    );
  }
}
