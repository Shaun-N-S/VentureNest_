import { ForgetPasswordResetPasswordRequestDTO } from "application/dto/auth/forgetPasswordDTO";

export interface IForgetPasswordInvestorResetPasswordUseCase {
  reset(dto: ForgetPasswordResetPasswordRequestDTO): Promise<void>;
}
