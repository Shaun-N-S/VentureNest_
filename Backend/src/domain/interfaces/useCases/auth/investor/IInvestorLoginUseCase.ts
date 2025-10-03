import { LoginUserResponseDTO } from "application/dto/auth/LoginUserDTO";

export interface IInvestorLoginUseCase {
  investorLogin(email: string, password: string): Promise<LoginUserResponseDTO>;
}
