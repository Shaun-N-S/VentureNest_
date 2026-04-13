import { InvestorDistributionDTO } from "application/dto/dashboard/investorDistributionDTO";

export interface IGetInvestorDistributionUseCase {
  execute(investorId: string): Promise<InvestorDistributionDTO>;
}
