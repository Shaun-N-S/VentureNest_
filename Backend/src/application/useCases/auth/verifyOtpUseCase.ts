import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IVerifyOtpUseCase } from "@domain/interfaces/useCases/auth/IVerifyOtp";
import { Errors } from "@shared/constants/error";
import { OTPExpiredException } from "application/constants/exceptions";

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  private _cacheStorage: IKeyValueTTLCaching;

  constructor(cacheStorage: IKeyValueTTLCaching) {
    this._cacheStorage = cacheStorage;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const cachedOtp = await this._cacheStorage.getData(`otp/${email}`);
    console.log("cachedOtp : ", cachedOtp);
    if (!cachedOtp) {
      throw new OTPExpiredException(Errors.OTP_MISSING);
    }
    const otpVerified = otp === cachedOtp;
    if (otpVerified) {
      await this._cacheStorage.deleteData(`otp/${email}`);
    }
    return otpVerified;
  }
}
