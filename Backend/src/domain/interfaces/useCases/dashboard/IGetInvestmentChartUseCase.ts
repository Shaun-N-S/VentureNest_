import { InvestmentChartDTO } from "application/dto/dashboard/investmentChartDTO";

export interface IGetInvestmentChartUseCase {
  execute(investorId: string): Promise<InvestmentChartDTO>;
}
