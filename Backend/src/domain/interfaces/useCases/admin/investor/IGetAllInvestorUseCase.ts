import { InvestorDTO } from "application/dto/investor/investorDTO";

export interface IGetAllInvestorUseCase {
  getAllInvestors(
    page: number,
    limit: number
  ): Promise<{
    investors: InvestorDTO[];
    totalInvestors: number;
    totalPages: number;
    currentPage: number;
  }>;
}
