import { LoginUserResponseDTO } from "application/dto/auth/LoginUserDTO";

export interface IUserLoginUseCase {
  userLogin(email: string, password: string): Promise<LoginUserResponseDTO>;
}
