import { KYCStatus } from "@domain/enum/kycStatus";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IUpdateUserKycStatusUseCase } from "@domain/interfaces/useCases/admin/kyc/IUpdateUserKycUseCase";
import { USER_ERRORS } from "@shared/constants/error";
import { NotFoundExecption } from "application/constants/exceptions";
import { KycDTO } from "application/dto/admin/kycDTO";
import { KycMapper } from "application/mappers/kycMapper";

export class UpdateUserKycUseCase implements IUpdateUserKycStatusUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async updateUserKycStatus(userId: string, newStatus: KYCStatus): Promise<{ user: KycDTO }> {
    const updatedUser = await this._userRepository.updateKycStatus(userId, newStatus);

    if (!updatedUser) throw new NotFoundExecption(USER_ERRORS.NO_USERS_FOUND);

    return { user: KycMapper.userKycRes(updatedUser) };
  }
}
