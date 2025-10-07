import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IHashPasswordService } from "@domain/interfaces/services/IHashPasswordService";
import { IForgetPasswordResetPasswordUseCase } from "@domain/interfaces/useCases/auth/IForgetPasswordResetPassword";
import { Errors } from "@shared/constants/error";
import { ForgetPasswordResetPasswordRequestDTO } from "application/dto/auth/forgetPasswordDTO";

export class ForgetPasswordResetPasswordUseCase implements IForgetPasswordResetPasswordUseCase {
  constructor(
    private _cacheStorage: IKeyValueTTLCaching,
    private _hashService: IHashPasswordService,
    private _userRepository: IUserRepository
  ) {}

  async reset({ email, password, token }: ForgetPasswordResetPasswordRequestDTO): Promise<void> {
    const cachedToken = await this._cacheStorage.getData(`FToken/${email}`);

    if (!cachedToken) {
      throw new Error(Errors.TOKEN_EXPIRED);
    }

    if (cachedToken !== token) {
      throw new Error(Errors.TOKEN_MISMATCH);
    }

    const hashedPassword = await this._hashService.hashPassword(password);

    await this._userRepository.findByIdAndUpdatePassword(email, hashedPassword);

    await this._cacheStorage.deleteData(`FToken/${email}`);
  }
}
