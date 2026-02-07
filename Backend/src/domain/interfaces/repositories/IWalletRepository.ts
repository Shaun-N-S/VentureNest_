import { WalletEntity } from "@domain/entities/wallet/walletEntity";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { IBaseRepository } from "./IBaseRepository";

export interface IWalletRepository extends IBaseRepository<WalletEntity> {
  findByOwner(ownerType: WalletOwnerType, ownerId: string): Promise<WalletEntity | null>;

  incrementBalance(walletId: string, amount: number): Promise<void>;

  decrementBalance(walletId: string, amount: number): Promise<void>;

  incrementLockedBalance(walletId: string, amount: number): Promise<void>;

  decrementLockedBalance(walletId: string, amount: number): Promise<void>;
}
