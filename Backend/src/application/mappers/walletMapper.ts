import mongoose from "mongoose";
import { WalletEntity } from "@domain/entities/wallet/walletEntity";
import { IWalletModel } from "@infrastructure/db/models/walletModel";
import { WalletDTO } from "application/dto/wallet/walletDTO";

export class WalletMapper {
  static toMongooseDocument(entity: WalletEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      ownerType: entity.ownerType,
      ownerId: new mongoose.Types.ObjectId(entity.ownerId),
      balance: entity.balance,
      lockedBalance: entity.lockedBalance,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromMongooseDocument(doc: IWalletModel): WalletEntity {
    return {
      _id: doc._id.toString(),
      ownerType: doc.ownerType,
      ownerId: doc.ownerId.toString(),
      balance: doc.balance,
      lockedBalance: doc.lockedBalance,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toDTO(entity: WalletEntity): WalletDTO {
    return {
      _id: entity._id!,
      ownerType: entity.ownerType,
      ownerId: entity.ownerId,
      balance: entity.balance,
      lockedBalance: entity.lockedBalance,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }
}
