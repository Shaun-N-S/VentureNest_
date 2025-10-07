import { ForgetPasswordResetPasswordRequestDTO } from "application/dto/auth/forgetPasswordDTO";

export interface IForgetPasswordResetPasswordUseCase {
  reset(dto: ForgetPasswordResetPasswordRequestDTO): Promise<void>;
}
