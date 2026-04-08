import { InvestorDashboardSummaryDTO } from "application/dto/dashboard/investorDashboardSummaryDTO";

export interface IGetInvestorDashboardSummaryUseCase {
  execute(investorId: string): Promise<InvestorDashboardSummaryDTO>;
}
