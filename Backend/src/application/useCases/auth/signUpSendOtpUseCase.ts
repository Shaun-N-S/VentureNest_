import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { IEmailContentGenerator } from "@domain/interfaces/services/IEmail/IEmailContentGenerator";
import { IEmailService } from "@domain/interfaces/services/IEmail/IEmailService";
import { IOtpEmailTemplate } from "@domain/interfaces/services/IEmail/IOtpEmailTemplate";
import { IHashPasswordService } from "@domain/interfaces/services/IHashPasswordService";
import { IOtpService } from "@domain/interfaces/services/IOtp/IOtp";
import { ISignUpSendOtpUseCase } from "@domain/interfaces/useCases/auth/user/ISignUpSendOtp";
import { USER_ERRORS } from "@shared/constants/error";
import { CreateUserDTO } from "application/dto/auth/createUserDTO";

export class SignUpSendOtpUseCase implements ISignUpSendOtpUseCase {
  private _otpService: IOtpService;
  private _otpTemplateGenerator: IEmailContentGenerator;
  private _emailService: IEmailService;
  private _userRepository: IUserRepository;
  private _investorRepository: IInvestorRepository;
  private _cacheStorage: IKeyValueTTLCaching;
  private _hashService: IHashPasswordService;

  constructor(
    otpService: IOtpService,
    otpTemplateGenerator: IEmailContentGenerator,
    emailService: IEmailService,
    userRepository: IUserRepository,
    investorRepository: IInvestorRepository,
    cacheStorage: IKeyValueTTLCaching,
    hashService: IHashPasswordService
  ) {
    this._otpService = otpService;
    this._otpTemplateGenerator = otpTemplateGenerator;
    this._emailService = emailService;
    this._userRepository = userRepository;
    this._investorRepository = investorRepository;
    this._cacheStorage = cacheStorage;
    this._hashService = hashService;
  }

  async signUpSendOtp(userData: CreateUserDTO): Promise<void> {
    const existingUserEmail = this._userRepository.findByEmail(userData.email);
    const existingInvestorEmail = this._investorRepository.findByEmail(userData.email);
    const [existingUser, existingInvestor] = await Promise.all([
      existingUserEmail,
      existingInvestorEmail,
    ]);
    if (existingUser || existingInvestor) {
      throw new Error(USER_ERRORS.USER_ALREADY_EXISTS);
    }
    const OTP = this._otpService.generateOtp();
    console.log(`OTP : ${OTP} and email: ${userData.email}`);
    const emailTemplate: IOtpEmailTemplate = {
      receiverEmail: userData.email,
      subject: "Your VentureNest OTP",
      otp: OTP,
    };

    emailTemplate.content = this._otpTemplateGenerator.generateTemplate(OTP);
    this._emailService.sendEmail(emailTemplate as Required<IOtpEmailTemplate>);
    this._cacheStorage.setData(`otp/${userData.email}`, 5 * 60, OTP);
    userData.password = await this._hashService.hashPassword(userData.password);
    this._cacheStorage.setData(`USERDATA/${userData.email}`, 30 * 60, JSON.stringify(userData));
  }
}
