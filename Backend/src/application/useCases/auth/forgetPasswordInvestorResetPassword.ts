import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IHashPasswordService } from "@domain/interfaces/services/IHashPasswordService";
import { IForgetPasswordInvestorResetPasswordUseCase } from "@domain/interfaces/useCases/auth/IForgetPasswordInvestorResetPassword";
import { Errors } from "@shared/constants/error";
import { ForgetPasswordResetPasswordRequestDTO } from "application/dto/auth/forgetPasswordDTO";

export class ForgetPasswordInvestorResetPasswordUseCase
  implements IForgetPasswordInvestorResetPasswordUseCase
{
  constructor(
    private _cacheStorage: IKeyValueTTLCaching,
    private _hashService: IHashPasswordService,
    private _investorRepository: IInvestorRepository
  ) {}

  async reset({ email, password, token }: ForgetPasswordResetPasswordRequestDTO): Promise<void> {
    const cachedToken = await this._cacheStorage.getData(`FToken/${email}`);
    console.log(email, password, token, "in useCaes");

    if (!cachedToken) {
      throw new Error(Errors.TOKEN_EXPIRED);
    }

    if (cachedToken !== token) {
      throw new Error(Errors.TOKEN_MISMATCH);
    }

    const hashedPassword = await this._hashService.hashPassword(password);

    await this._investorRepository.findByIdAndUpdatePassword(email, hashedPassword);

    await this._cacheStorage.deleteData(`FToken/${email}`);
  }
}
