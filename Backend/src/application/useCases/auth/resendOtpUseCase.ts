import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IEmailContentGenerator } from "@domain/interfaces/services/IEmail/IEmailContentGenerator";
import { IEmailService } from "@domain/interfaces/services/IEmail/IEmailService";
import { IOtpEmailTemplate } from "@domain/interfaces/services/IEmail/IOtpEmailTemplate";
import { IOtpService } from "@domain/interfaces/services/IOtp/IOtp";
import { IResendOtpUseCase } from "@domain/interfaces/useCases/auth/IResendOtp";
import { USER_ERRORS } from "@shared/constants/error";

export class ResendOtpUseCase implements IResendOtpUseCase {
  private _otpService: IOtpService;
  private _otpTemplateGenerator: IEmailContentGenerator;
  private _emailService: IEmailService;
  private _userRepository: IUserRepository;
  private _investorRepository: IInvestorRepository;
  private _cacheStorage: IKeyValueTTLCaching;

  constructor(
    otpService: IOtpService,
    otpTemplateGenerator: IEmailContentGenerator,
    emailService: IEmailService,
    userRepository: IUserRepository,
    investorRepository: IInvestorRepository,
    cacheStorage: IKeyValueTTLCaching
  ) {
    this._otpService = otpService;
    this._otpTemplateGenerator = otpTemplateGenerator;
    this._emailService = emailService;
    this._userRepository = userRepository;
    this._investorRepository = investorRepository;
    this._cacheStorage = cacheStorage;
  }

  async resendOtp(email: string): Promise<void> {
    const existingInvestorEmail = this._investorRepository.findByEmail(email);
    const existingUserEmail = this._userRepository.findByEmail(email);
    const [existingInvestor, existingUser] = await Promise.all([
      existingUserEmail,
      existingInvestorEmail,
    ]);

    if (existingUser || existingInvestor) {
      throw new Error(USER_ERRORS.USER_ALREADY_EXISTS);
    }
    const OTP = this._otpService.generateOtp();
    console.log("new OTP : ", OTP);
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
