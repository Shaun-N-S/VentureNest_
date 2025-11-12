import { KycDTO } from "application/dto/admin/kycDTO";

export interface IGetAllUserKycUseCase {
  getAllUsersKyc(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<{
    usersKyc: KycDTO[];
    totalUsersKyc: number;
    totalPages: number;
    currentPage: number;
  }>;
}
