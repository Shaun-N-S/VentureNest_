import { ICreateWalletUseCase } from "@domain/interfaces/useCases/wallet/ICreateWalletUseCase";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";

export class CreateWalletUseCase implements ICreateWalletUseCase {
  constructor(private _walletRepository: IWalletRepository) {}

  async execute(ownerType: WalletOwnerType, ownerId: string): Promise<void> {
    const existingWallet = await this._walletRepository.findByOwner(ownerType, ownerId);

    if (existingWallet) return;

    await this._walletRepository.save({
      ownerType,
      ownerId,
      balance: 0,
      lockedBalance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
