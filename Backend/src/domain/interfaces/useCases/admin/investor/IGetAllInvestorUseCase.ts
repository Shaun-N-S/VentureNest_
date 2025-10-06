import { InvestorDTO } from "application/dto/investor/investorDTO";

export interface IGetAllInvestorUseCase {
  getAllInvestors(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<{
    investors: InvestorDTO[];
    totalInvestors: number;
    totalPages: number;
    currentPage: number;
  }>;
}
