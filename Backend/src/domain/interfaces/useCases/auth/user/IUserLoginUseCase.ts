import { LoginUserDTO } from "application/dto/user/LoginUserDTO";

export interface IUserLoginUseCase {
  userLogin(email: string, password: string): Promise<LoginUserDTO>;
}
