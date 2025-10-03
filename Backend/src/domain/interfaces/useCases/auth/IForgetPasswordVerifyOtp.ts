import { ForgetPasswordVerifyOtpRequestDTO } from "application/dto/auth/forgetPasswordDTO";

export interface IForgetPasswordVerifyOtpUseCase {
  verify(dto: ForgetPasswordVerifyOtpRequestDTO): Promise<string>;
}
