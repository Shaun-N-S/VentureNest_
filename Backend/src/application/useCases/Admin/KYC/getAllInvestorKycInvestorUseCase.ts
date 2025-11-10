import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IGetAllInvestorKycUseCase } from "@domain/interfaces/useCases/admin/kyc/IGetAllInvestorKycUseCase";
import { KycDTO } from "application/dto/admin/kycDTO";
import { KycMapper } from "application/mappers/kycMapper";

export class GetAllInvestorKycUseCase implements IGetAllInvestorKycUseCase {
  constructor(private _investorRepository: IInvestorRepository) {}

  async getAllInvestorsKyc(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<{
    investorsKyc: KycDTO[];
    totalUsersKyc: number;
    totalPages: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;

    const [investorsKyc, totalUsersKyc] = await Promise.all([
      this._investorRepository.findAll(skip, limit, status, search),
      this._investorRepository.count(status, search),
    ]);

    const investorsKycDTOs = investorsKyc.map((i) => KycMapper.investorKycRes(i));

    return {
      investorsKyc: investorsKycDTOs,
      totalUsersKyc,
      totalPages: Math.ceil(totalUsersKyc / limit),
      currentPage: page,
    };
  }
}
