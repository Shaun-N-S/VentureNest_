import { IGetAdminPlatformWalletUseCase } from "@domain/interfaces/useCases/admin/finance/IGetAdminPlatformWalletUseCase";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { UserRole } from "@domain/enum/userRole";
import { AdminPlatformWalletDTO } from "application/dto/admin/adminPlatformWalletDTO";
import { NotFoundExecption } from "application/constants/exceptions";
import { Errors, WALLET_ERRORS } from "@shared/constants/error";
import { AdminPlatformWalletMapper } from "application/mappers/adminPlatformWalletMapper";

export class GetAdminPlatformWalletUseCase implements IGetAdminPlatformWalletUseCase {
  constructor(
    private readonly _walletRepository: IWalletRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(): Promise<AdminPlatformWalletDTO> {
    const admin = await this._userRepository.findByRole(UserRole.ADMIN);

    if (!admin) {
      throw new NotFoundExecption(Errors.ADMIN_NOT_FOUND);
    }

    const wallet = await this._walletRepository.findByOwner(WalletOwnerType.PLATFORM, admin._id!);

    if (!wallet) {
      throw new NotFoundExecption(WALLET_ERRORS.NOT_FOUND);
    }

    return AdminPlatformWalletMapper.toDTO(wallet);
  }
}
