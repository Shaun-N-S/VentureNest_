import { KycDTO } from "application/dto/admin/kycDTO";

export interface IGetAllInvestorKycUseCase {
  getAllInvestorsKyc(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<{
    investorsKyc: KycDTO[];
    totalUsersKyc: number;
    totalPages: number;
    currentPage: number;
  }>;
}
