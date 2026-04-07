import { InvestorPortfolioData } from "application/dto/dashboard/investorPortfolioDTO";

export interface IGetInvestorPortfolioUseCase {
  execute(investorId: string): Promise<InvestorPortfolioData>;
}
