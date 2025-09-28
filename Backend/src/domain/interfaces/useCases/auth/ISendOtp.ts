import { RegisterUserType } from "@domain/types/RegisterUserTypes";

export interface ISendOtpUseCase {
  sendOtp(email: string): Promise<void>;
}
