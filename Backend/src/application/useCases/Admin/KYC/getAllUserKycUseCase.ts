import { KYCStatus } from "@domain/enum/kycStatus";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { IGetAllUserKycUseCase } from "@domain/interfaces/useCases/admin/kyc/IGetAllUserKycUseCase";
import { KycDTO } from "application/dto/admin/kycDTO";
import { KycMapper } from "application/mappers/kycMapper";

export class GetAllUsersKycUseCases implements IGetAllUserKycUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _storageService: IStorageService
  ) {}

  async getAllUsersKyc(
    page: number,
    limit: number,
    status?: string,
    search?: string
  ): Promise<{
    usersKyc: KycDTO[];
    totalUsersKyc: number;
    totalPages: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;
    const query: Record<string, unknown> = {};
    query.kycStatus = status ? status : { $ne: KYCStatus.PENDING };
    const [usersKyc, totalUsersKyc] = await Promise.all([
      this._userRepository.findAll(skip, limit, undefined, search, query),
      this._userRepository.count(status, search, query),
    ]);

    const usersKycDTOs = await Promise.all(
      usersKyc.map(async (user) => {
        const dto = KycMapper.userKycRes(user);

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
      usersKyc: usersKycDTOs,
      totalUsersKyc,
      totalPages: Math.ceil(totalUsersKyc / limit),
      currentPage: page,
    };
  }
}
