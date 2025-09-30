import { KeyValueTTLCaching } from "@infrastructure/cache/redis/KeyValueTTLCaching";
import { userModel } from "@infrastructure/db/models/userModel";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { OtpEmailContentGenerator } from "@infrastructure/services/Email/EmailContentGenerator/otpEmailContentGenerator";
import { EmailService } from "@infrastructure/services/Email/emailService";
import { HashPassword } from "@infrastructure/services/hashPasswordService";
import { JWTService } from "@infrastructure/services/jwtService";
import { OtpService } from "@infrastructure/services/otpService";
import { SignUpSendOtpUseCase } from "application/useCases/auth/user/signUpSendOtpUseCase";
import { VerifyOtpUseCase } from "application/useCases/auth/verifyOtpUseCase";
import { RegisterUserUseCase } from "application/useCases/auth/user/registerUserUseCase";
import { UserAuthController } from "interfaceAdapters/controller/Auth/userAuthController";
import { UserLoginUseCase } from "application/useCases/auth/user/loginUserUseCase";
import { TokenCreationUseCase } from "application/useCases/auth/tokenCreationUseCase";
import { CacheUserUseCase } from "application/useCases/auth/user/cacheUserUseCase";

//Repositories & Services
const userRepository = new UserRepository(userModel);
const hashService = new HashPassword();
const otpService = new OtpService();
const otpContentGenerator = new OtpEmailContentGenerator();
const emailService = new EmailService();
const cacheStorage = new KeyValueTTLCaching();
const jwtService = new JWTService();

//UseCases
const registerUserUseCase = new RegisterUserUseCase(userRepository, hashService);
const userSendOtpUseCase = new SignUpSendOtpUseCase(
  otpService,
  otpContentGenerator,
  emailService,
  userRepository,
  cacheStorage
);
const verifyOtpUseCase = new VerifyOtpUseCase(cacheStorage);
const userLoginUseCase = new UserLoginUseCase(userRepository, hashService);
const tokenCreationUseCase = new TokenCreationUseCase(jwtService);
const cacheUserUseCase = new CacheUserUseCase(cacheStorage);

//Controller
export const userAuthController = new UserAuthController(
  registerUserUseCase,
  userSendOtpUseCase,
  verifyOtpUseCase,
  userLoginUseCase,
  tokenCreationUseCase,
  cacheUserUseCase
);
