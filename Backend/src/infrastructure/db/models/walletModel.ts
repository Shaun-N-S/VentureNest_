import { Document, model } from "mongoose";
import walletSchema from "../schema/walletSchema";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";

export interface IWalletModel extends Document {
  ownerType: WalletOwnerType;
  ownerId: string;
  balance: number;
  lockedBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export const walletModel = model<IWalletModel>("Wallet", walletSchema);
