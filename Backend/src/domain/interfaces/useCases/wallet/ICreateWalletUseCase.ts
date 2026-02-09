import { WalletOwnerType } from "@domain/enum/walletOwnerType";

export interface ICreateWalletUseCase {
  execute(ownerType: WalletOwnerType, ownerId: string): Promise<void>;
}
