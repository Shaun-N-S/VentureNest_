import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { ITokenService } from "@domain/interfaces/services/ITokenService";
import { IForgetPasswordVerifyOtpUseCase } from "@domain/interfaces/useCases/auth/IForgetPasswordVerifyOtp";
import { Errors } from "@shared/constants/error";
import { ForgetPasswordVerifyOtpRequestDTO } from "application/dto/auth/forgetPasswordDTO";

export class ForgetPasswordVerifyOtpUseCase implements IForgetPasswordVerifyOtpUseCase {
  constructor(
    private _cacheStorage: IKeyValueTTLCaching,
    private _tokenService: ITokenService
  ) {}

  async verify({ email, otp }: ForgetPasswordVerifyOtpRequestDTO): Promise<string> {
    const cachedOtp = await this._cacheStorage.getData(`FOTP/${email}`);

    if (!cachedOtp) {
      throw new Error(Errors.OTP_MISSING);
    }

    if (otp !== cachedOtp) {
      throw new Error(Errors.INVALID_OTP);
    }

    const token = await this._tokenService.createToken();
    await this._cacheStorage.setData(`FToken/${email}`, 15 * 60, token);
    await this._cacheStorage.deleteData(`FOTP/${email}`);
    return token;
  }
}
