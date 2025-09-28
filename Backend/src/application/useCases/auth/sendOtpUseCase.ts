import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IEmailContentGenerator } from "@domain/interfaces/services/IEmail/IEmailContentGenerator";
import { IEmailService } from "@domain/interfaces/services/IEmail/IEmailService";
import { IOtpEmailTemplate } from "@domain/interfaces/services/IEmail/IOtpEmailTemplate";
import { IOtpService } from "@domain/interfaces/services/IOtp/IOtp";
import { ISendOtpUseCase } from "@domain/interfaces/useCases/auth/ISendOtp";
import { RegisterUserType } from "@domain/types/RegisterUserTypes";
import { USER_ERRORS } from "@shared/constants/error";

export class SendOtpUseCase implements ISendOtpUseCase {
  private _otpService: IOtpService;
  private _otpTemplateGenerator: IEmailContentGenerator;
  private _emailService: IEmailService;
  private _userRepository: IUserRepository;
  private _cacheStorage: IKeyValueTTLCaching;

  constructor(
    otpService: IOtpService,
    otpTemplateGenerator: IEmailContentGenerator,
    emailService: IEmailService,
    userRepository: IUserRepository,
    cacheStorage: IKeyValueTTLCaching
  ) {
    this._otpService = otpService;
    this._otpTemplateGenerator = otpTemplateGenerator;
    this._emailService = emailService;
    this._userRepository = userRepository;
    this._cacheStorage = cacheStorage;
  }

  async sendOtp(email: string): Promise<void> {
    const existingEmail = await this._userRepository.findByEmail(email);
    if (existingEmail) {
      throw new Error(USER_ERRORS.USER_ALREADY_EXISTS);
    }
    const OTP = this._otpService.generateOtp();
    console.log(`OTP : ${OTP} and email: ${email}`);
    const emailTemplate: IOtpEmailTemplate = {
      receiverEmail: email,
      subject: "Your VentureNest OTP",
      otp: OTP,
    };

    emailTemplate.content = this._otpTemplateGenerator.generateTemplate(OTP);
    this._emailService.sendEmail(emailTemplate as Required<IOtpEmailTemplate>);
    this._cacheStorage.setData(`otp/${email}`, 5 * 60, OTP);
  }
}
