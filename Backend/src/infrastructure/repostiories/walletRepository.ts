import { ClientSession, Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { WalletEntity } from "@domain/entities/wallet/walletEntity";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { WalletMapper } from "application/mappers/walletMapper";
import { IWalletModel } from "@infrastructure/db/models/walletModel";

export class WalletRepository
  extends BaseRepository<WalletEntity, IWalletModel>
  implements IWalletRepository
{
  constructor(protected _model: Model<IWalletModel>) {
    super(_model, WalletMapper);
  }

  async findByOwner(ownerType: WalletOwnerType, ownerId: string): Promise<WalletEntity | null> {
    const doc = await this._model.findOne({ ownerType, ownerId });
    return doc ? WalletMapper.fromMongooseDocument(doc) : null;
  }

  async incrementBalance(walletId: string, amount: number, session?: ClientSession): Promise<void> {
    const update = { $inc: { balance: amount } };

    if (session) {
      await this._model.updateOne({ _id: walletId }, update, { session });
    } else {
      await this._model.updateOne({ _id: walletId }, update);
    }
  }

  async decrementBalance(walletId: string, amount: number, session?: ClientSession): Promise<void> {
    const update = { $inc: { balance: -amount } };

    if (session) {
      await this._model.updateOne({ _id: walletId }, update, { session });
    } else {
      await this._model.updateOne({ _id: walletId }, update);
    }
  }

  async incrementLockedBalance(
    walletId: string,
    amount: number,
    session?: ClientSession
  ): Promise<void> {
    const update = { $inc: { lockedBalance: amount } };

    if (session) {
      await this._model.updateOne({ _id: walletId }, update, { session });
    } else {
      await this._model.updateOne({ _id: walletId }, update);
    }
  }

  async decrementLockedBalance(
    walletId: string,
    amount: number,
    session?: ClientSession
  ): Promise<void> {
    const update = { $inc: { lockedBalance: -amount } };

    if (session) {
      await this._model.updateOne({ _id: walletId }, update, { session });
    } else {
      await this._model.updateOne({ _id: walletId }, update);
    }
  }
}
