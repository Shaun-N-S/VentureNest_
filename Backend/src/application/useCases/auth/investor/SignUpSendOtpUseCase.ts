// import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
// import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
// import { IEmailContentGenerator } from "@domain/interfaces/services/IEmail/IEmailContentGenerator";
// import { IEmailService } from "@domain/interfaces/services/IEmail/IEmailService";
// import { IOtpService } from "@domain/interfaces/services/IOtp/IOtp";
// import { IInvestorSignUpSendOtpUseCase } from "@domain/interfaces/useCases/auth/investor/IInvestorSignUpSendOtp";
// import { INVESTOR_ERRORS } from "@shared/constants/error";

// export class SignUpSentOtpUseCase implements IInvestorSignUpSendOtpUseCase {
//   private _otpService: IOtpService;
//   private _otpTemplateGenerator: IEmailContentGenerator;
//   private _emailService: IEmailService;
//   private _investorRepository: IInvestorRepository;
//   private _cacheStorage: IKeyValueTTLCaching;

//   constructor(
//     otpService: IOtpService,
//     otpTemplateGenerator: IEmailContentGenerator,
//     emailService: IEmailService,
//     investorRepository: IInvestorRepository,
//     cacheStorage: IKeyValueTTLCaching
//   ) {
//     this._otpService = otpService;
//     this._otpTemplateGenerator = otpTemplateGenerator;
//     this._emailService = emailService;
//     this._investorRepository = investorRepository;
//     this._cacheStorage = cacheStorage;
//   }

//   async signUpSendOtp(email: string): Promise<void> {
//     const existingEmail = await this._investorRepository.findByEmail(email);
//     if (existingEmail) {
//       throw new Error(INVESTOR_ERRORS.INVESTOR_ALREADY_EXISTS);
//     }
//     const OTP = this._otpService.generateOtp();
//     console.log(`Investor signup OTP : ${OTP} and email : ${email}`);
//     // const emailTemplate:IO
//   }
// }
