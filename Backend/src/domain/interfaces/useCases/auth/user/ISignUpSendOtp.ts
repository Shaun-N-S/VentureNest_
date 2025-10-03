import { CreateUserDTO } from "application/dto/auth/createUserDTO";

export interface ISignUpSendOtpUseCase {
  signUpSendOtp(userData: CreateUserDTO): Promise<void>;
}
