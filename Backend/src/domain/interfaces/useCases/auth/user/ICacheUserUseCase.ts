import { LoginUserResponseDTO } from "application/dto/auth/LoginUserDTO";

export interface ICacheUserUseCase {
  cacheUser(user: LoginUserResponseDTO): void;
}
