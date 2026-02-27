import { AdminPlatformWalletDTO } from "application/dto/admin/adminPlatformWalletDTO";

export interface IGetAdminPlatformWalletUseCase {
  execute(): Promise<AdminPlatformWalletDTO>;
}
