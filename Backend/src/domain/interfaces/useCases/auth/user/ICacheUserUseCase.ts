import { LoginUserDTO } from "application/dto/user/LoginUserDTO";

export interface ICacheUserUseCase {
  cacheUser(user: LoginUserDTO): void;
}
