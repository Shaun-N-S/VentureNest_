import { KYCStatus } from "@domain/enum/kycStatus";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetAllInvestorKycUseCase } from "@domain/interfaces/useCases/admin/kyc/IGetAllInvestorKycUseCase";
import { KycDTO } from "application/dto/admin/kycDTO";
import { KycMapper } from "application/mappers/kycMapper";

export class GetAllInvestorKycUseCase implements IGetAllInvestorKycUseCase {
  constructor(
    private _investorRepository: IInvestorRepository,
    private _storageService: IStorageService
  ) {}

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
    const query: Record<string, string> = {};
    if (status) query.kycStatus = status;
    const [investorsKyc, totalUsersKyc] = await Promise.all([
      this._investorRepository.findAll(skip, limit, undefined, search, query),
      this._investorRepository.count(status, search, query),
    ]);

    const investorsKycDTOs = await Promise.all(
      investorsKyc.map(async (investor) => {
        const dto = KycMapper.investorKycRes(investor);

        if (dto.selfieImg) {
          dto.selfieImg = await this._storageService.createSignedUrl(dto.selfieImg, 10 * 60);
        }
        if (dto.aadharImg) {
          dto.aadharImg = await this._storageService.createSignedUrl(dto.aadharImg, 10 * 60);
        }
        if (dto.profileImg) {
          dto.profileImg = await this._storageService.createSignedUrl(dto.profileImg, 10 * 60);
        }

        return dto;
      })
    );

    return {
      investorsKyc: investorsKycDTOs,
      totalUsersKyc,
      totalPages: Math.ceil(totalUsersKyc / limit),
      currentPage: page,
    };
  }
}
