import { KeyValueTTLCaching } from "@infrastructure/cache/redis/KeyValueTTLCaching";
import { userModel } from "@infrastructure/db/models/userModel";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { OtpEmailContentGenerator } from "@infrastructure/services/Email/EmailContentGenerator/otpEmailContentGenerator";
import { EmailService } from "@infrastructure/services/Email/emailService";
import { HashPassword } from "@infrastructure/services/hashPasswordService";
import { JWTService } from "@infrastructure/services/jwtService";
import { OtpService } from "@infrastructure/services/otpService";
import { SignUpSendOtpUseCase } from "application/useCases/auth/signUpSendOtpUseCase";
import { VerifyOtpUseCase } from "application/useCases/auth/verifyOtpUseCase";
import { RegisterUserUseCase } from "application/useCases/auth/user/registerUserUseCase";
import { UserAuthController } from "interfaceAdapters/controller/Auth/userAuthController";
import { UserLoginUseCase } from "application/useCases/auth/user/loginUserUseCase";
import { TokenCreationUseCase } from "application/useCases/auth/tokenCreationUseCase";
import { CacheUserUseCase } from "application/useCases/auth/user/cacheUserUseCase";
import { InvestorRepository } from "@infrastructure/repostiories/investorRepository";
import { investorModel } from "@infrastructure/db/models/investorModel";
import { InvestorAuthController } from "interfaceAdapters/controller/Auth/investorAuthController";
import { RegisterInvestorUseCase } from "application/useCases/auth/investor/registerInvestorUseCase";
import { InvestorLoginUseCase } from "application/useCases/auth/investor/investorLoginUseCase";
import { CacheInvestorUseCase } from "application/useCases/auth/investor/CacheInvestorUseCase";

//Repositories & Services
const userRepository = new UserRepository(userModel);
const hashService = new HashPassword();
const otpService = new OtpService();
const otpContentGenerator = new OtpEmailContentGenerator();
const emailService = new EmailService();
const cacheStorage = new KeyValueTTLCaching();
const jwtService = new JWTService();
const investorRepository = new InvestorRepository(investorModel);

//UseCases
const registerUserUseCase = new RegisterUserUseCase(userRepository, cacheStorage);
const registerInvestorUseCase = new RegisterInvestorUseCase(investorRepository, cacheStorage);
const sendOtpUseCase = new SignUpSendOtpUseCase(
  otpService,
  otpContentGenerator,
  emailService,
  userRepository,
  investorRepository,
  cacheStorage,
  hashService
);
const verifyOtpUseCase = new VerifyOtpUseCase(cacheStorage);
const userLoginUseCase = new UserLoginUseCase(userRepository, hashService);
const tokenCreationUseCase = new TokenCreationUseCase(jwtService);
const cacheUserUseCase = new CacheUserUseCase(cacheStorage);
const investorLoginUseCase = new InvestorLoginUseCase(investorRepository, hashService);
const cacheInvestorUseCase = new CacheInvestorUseCase(cacheStorage);

//Controller
export const userAuthController = new UserAuthController(
  registerUserUseCase,
  sendOtpUseCase,
  verifyOtpUseCase,
  userLoginUseCase,
  tokenCreationUseCase,
  cacheUserUseCase,
  cacheStorage
);

export const investorAuthController = new InvestorAuthController(
  registerInvestorUseCase,
  sendOtpUseCase,
  verifyOtpUseCase,
  investorLoginUseCase,
  tokenCreationUseCase,
  cacheInvestorUseCase
);
