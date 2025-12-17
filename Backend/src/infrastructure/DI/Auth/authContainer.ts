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
import { ResendOtpUseCase } from "application/useCases/auth/resendOtpUseCase";
import { ForgetPasswordOtpUseCase } from "application/useCases/auth/forgetPasswordSendOtpUseCase";
import { ForgetPasswordVerifyOtpUseCase } from "application/useCases/auth/forgetPasswordVerifyOtpUseCase";
import { TokenSerivce } from "@infrastructure/services/tokenService";
import { ForgetPasswordResetPasswordUseCase } from "application/useCases/auth/forgetPasswordResetPasswordUseCase";
import { AdminAuthController } from "interfaceAdapters/controller/Auth/adminAuthController";
import { AdminLoginUseCase } from "application/useCases/auth/admin/adminLoginUseCase";
import { RefreshTokenUseCase } from "application/useCases/auth/refreshTokenUseCase";
import { TokenInvalidationUseCase } from "application/useCases/auth/tokenInvalidationUseCase";
import { ForgetPasswordInvestorResetPasswordUseCase } from "application/useCases/auth/forgetPasswordInvestorResetPassword";
import { AuthMiddleware } from "interfaceAdapters/middleware/authMiddleware";
import { UserGoogleLoginUseCase } from "application/useCases/auth/user/userGoogleLoginUseCase";
import { GoogleAuthService } from "@infrastructure/services/googleAuthService";
import { InvestorGoogleLoginUseCase } from "application/useCases/auth/investor/investorGoogleLoginUseCase";
import { GetProfileImgUseCase } from "application/useCases/auth/getProfileImgUseCase";
import { StorageService } from "@infrastructure/services/storageService";
import { InterestedTopicsUseCase } from "application/useCases/auth/interestedTopicsUseCase";

//Repositories & Services
const userRepository = new UserRepository(userModel);
const hashService = new HashPassword();
const otpService = new OtpService();
const otpContentGenerator = new OtpEmailContentGenerator();
const emailService = new EmailService();
const cacheStorage = new KeyValueTTLCaching();
const jwtService = new JWTService();
const investorRepository = new InvestorRepository(investorModel);
const tokenSerivce = new TokenSerivce();
const googleAuthService = new GoogleAuthService();
const storageService = new StorageService();

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
const userLoginUseCase = new UserLoginUseCase(
  userRepository,
  hashService,
  storageService,
  cacheStorage
);
const tokenCreationUseCase = new TokenCreationUseCase(jwtService);
const cacheUserUseCase = new CacheUserUseCase(cacheStorage);
const investorLoginUseCase = new InvestorLoginUseCase(
  investorRepository,
  hashService,
  storageService,
  cacheStorage
);
const cacheInvestorUseCase = new CacheInvestorUseCase(cacheStorage);
const resendOtpUseCase = new ResendOtpUseCase(
  otpService,
  otpContentGenerator,
  emailService,
  userRepository,
  investorRepository,
  cacheStorage
);
const forgetPasswordSendOtpUseCase = new ForgetPasswordOtpUseCase(
  userRepository,
  investorRepository,
  otpService,
  otpContentGenerator,
  emailService,
  cacheStorage
);
const forgetPasswordVerifyOtpUseCase = new ForgetPasswordVerifyOtpUseCase(
  cacheStorage,
  tokenSerivce
);
const forgetPasswordResetPasswordUseCase = new ForgetPasswordResetPasswordUseCase(
  cacheStorage,
  hashService,
  userRepository
);
const forgetPasswordInvestorResetPasswordUseCase = new ForgetPasswordInvestorResetPasswordUseCase(
  cacheStorage,
  hashService,
  investorRepository
);
const adminLoginUseCase = new AdminLoginUseCase(userRepository, hashService);
const tokenRefreshUseCase = new RefreshTokenUseCase(jwtService, cacheStorage);
const tokenValidationUseCase = new TokenInvalidationUseCase(jwtService, cacheStorage);
const googleLoginUseCase = new UserGoogleLoginUseCase(
  userRepository,
  googleAuthService,
  storageService,
  cacheStorage
);
const investorGoogleLoginUseCase = new InvestorGoogleLoginUseCase(
  investorRepository,
  googleAuthService,
  storageService,
  cacheStorage
);
const getProfileImgUseCase = new GetProfileImgUseCase(
  userRepository,
  investorRepository,
  storageService
);

const interestedTopicsUseCase = new InterestedTopicsUseCase(userRepository, investorRepository);

//Controller
export const userAuthController = new UserAuthController(
  registerUserUseCase,
  sendOtpUseCase,
  verifyOtpUseCase,
  userLoginUseCase,
  tokenCreationUseCase,
  cacheUserUseCase,
  cacheStorage,
  resendOtpUseCase,
  forgetPasswordSendOtpUseCase,
  forgetPasswordVerifyOtpUseCase,
  forgetPasswordResetPasswordUseCase,
  tokenRefreshUseCase,
  tokenValidationUseCase,
  jwtService,
  googleLoginUseCase,
  getProfileImgUseCase,
  interestedTopicsUseCase
);

export const investorAuthController = new InvestorAuthController(
  registerInvestorUseCase,
  sendOtpUseCase,
  verifyOtpUseCase,
  investorLoginUseCase,
  tokenCreationUseCase,
  cacheInvestorUseCase,
  resendOtpUseCase,
  forgetPasswordSendOtpUseCase,
  forgetPasswordVerifyOtpUseCase,
  forgetPasswordInvestorResetPasswordUseCase,
  investorGoogleLoginUseCase,
  jwtService
);

export const adminAuthController = new AdminAuthController(
  adminLoginUseCase,
  cacheUserUseCase,
  tokenCreationUseCase
);

export const authMiddleware = new AuthMiddleware(
  jwtService,
  cacheStorage,
  userRepository,
  investorRepository
);
