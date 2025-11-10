import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IGetAllUserKycUseCase } from "@domain/interfaces/useCases/admin/kyc/IGetAllUserKycUseCase";
import { KycDTO } from "application/dto/admin/kycDTO";
import { KycMapper } from "application/mappers/kycMapper";

export class GetAllUsersKycUseCases implements IGetAllUserKycUseCase {
  constructor(private _userRepository: IUserRepository) {}

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

    const [usersKyc, totalUsersKyc] = await Promise.all([
      this._userRepository.findAll(skip, limit, status, search),
      this._userRepository.count(status, search),
    ]);

    const usersKycDTOs = usersKyc.map((i) => KycMapper.userKycRes(i));

    return {
      usersKyc: usersKycDTOs,
      totalUsersKyc,
      totalPages: Math.ceil(totalUsersKyc / limit),
      currentPage: page,
    };
  }
}
