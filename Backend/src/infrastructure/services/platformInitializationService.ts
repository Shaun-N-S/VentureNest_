import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";

export class PlatformInitializationService {
  constructor(
    private readonly _walletRepo: IWalletRepository,
    private readonly _userRepo: IUserRepository
  ) {}

  async ensurePlatformWallet(): Promise<void> {
    const admin = await this._userRepo.findByEmail("admin@gmail.com");

    if (!admin) {
      throw new Error("Admin user not found for platform wallet");
    }

    const existing = await this._walletRepo.findByOwner(WalletOwnerType.PLATFORM, admin._id!);

    if (!existing) {
      await this._walletRepo.save({
        ownerType: WalletOwnerType.PLATFORM,
        ownerId: admin._id!,
        balance: 0,
        lockedBalance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(" Platform wallet created");
    }
  }
}
