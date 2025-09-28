import { KeyValueTTLCaching } from "@infrastructure/cache/redis/KeyValueTTLCaching";
import { userModel } from "@infrastructure/db/models/userModel";
import { UserRepository } from "@infrastructure/repostiories/userRepository";
import { OtpEmailContentGenerator } from "@infrastructure/services/Email/EmailContentGenerator/otpEmailContentGenerator";
import { EmailService } from "@infrastructure/services/Email/emailService";
import { HashPassword } from "@infrastructure/services/hashPasswordService";
import { JWTService } from "@infrastructure/services/jwtService";
import { OtpService } from "@infrastructure/services/otpService";
import { SendOtpUseCase } from "application/useCases/auth/sendOtpUseCase";
import { VerifyOtpUseCase } from "application/useCases/auth/verifyOtpUseCase";
import { RegisterUserUseCase } from "application/useCases/User/Signup/registerUserUseCase";
import { UserAuthController } from "interfaceAdapters/controller/Auth/userAuthController";

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
const userSendOtpUseCase = new SendOtpUseCase(
  otpService,
  otpContentGenerator,
  emailService,
  userRepository,
  cacheStorage
);
const verifyOtpUseCase = new VerifyOtpUseCase(cacheStorage);

//Controller
export const userAuthController = new UserAuthController(
  registerUserUseCase,
  userSendOtpUseCase,
  verifyOtpUseCase
);
