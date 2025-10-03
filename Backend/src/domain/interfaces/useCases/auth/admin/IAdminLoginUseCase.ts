import { LoginAdminResponseDTO } from "application/dto/auth/LoginAdminDTO";

export interface IAdminLoginUseCase {
  adminLogin(email: string, password: string): Promise<LoginAdminResponseDTO>;
}
