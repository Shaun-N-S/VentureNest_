import { WalletOwnerType } from "@domain/enum/walletOwnerType";

export interface WalletEntity {
  _id?: string;

  ownerType: WalletOwnerType;
  ownerId: string;

  balance: number;
  lockedBalance: number;

  createdAt?: Date;
  updatedAt?: Date;
}
