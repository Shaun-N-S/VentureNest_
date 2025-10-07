import { LoginUserResponseDTO } from "application/dto/auth/LoginUserDTO";

export interface ICacheInvestorUseCase {
  cacheInvestor(investor: LoginUserResponseDTO): void;
}
