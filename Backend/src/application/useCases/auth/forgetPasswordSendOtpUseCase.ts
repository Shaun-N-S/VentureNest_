import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IEmailContentGenerator } from "@domain/interfaces/services/IEmail/IEmailContentGenerator";
import { IEmailService } from "@domain/interfaces/services/IEmail/IEmailService";
import { IOtpEmailTemplate } from "@domain/interfaces/services/IEmail/IOtpEmailTemplate";
import { IOtpService } from "@domain/interfaces/services/IOtp/IOtp";
import { IForgetPasswordSendOtpUseCaes } from "@domain/interfaces/useCases/auth/IForgetPasswordSendOtp";
import { Errors, USER_ERRORS } from "@shared/constants/error";
import { MESSAGES } from "@shared/constants/messages";
import { emailSchema } from "@shared/validations/emailValidator";

export class ForgetPasswordOtpUseCase implements IForgetPasswordSendOtpUseCaes {
  constructor(
    private _userRepository: IUserRepository,
    private _investorRepository: IInvestorRepository,
    private _otpService: IOtpService,
    private _OtpEmailContentGenerator: IEmailContentGenerator,
    private _emailService: IEmailService,
    private _cacheStorage: IKeyValueTTLCaching
  ) {}

  async sendOtp(email: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new Error(USER_ERRORS.USER_NOT_FOUND);
    }

    const otp = this._otpService.generateOtp();
    console.log("forgetpassword otp : ", otp);
    const emailTemplate: IOtpEmailTemplate = {
      receiverEmail: email,
      subject: MESSAGES.EMAIL.FORGET_PASSWORD_OTP,
      otp: otp,
    };

    emailTemplate.content = this._OtpEmailContentGenerator.generateTemplate(otp);
    this._emailService.sendEmail(emailTemplate as Required<IOtpEmailTemplate>);
    this._cacheStorage.setData(`FOTP/${email}`, 5 * 60, otp);
  }
}
