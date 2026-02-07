import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { TransactionMapper } from "application/mappers/transactionMapper";
import { ITransactionModel } from "@infrastructure/db/models/transactionModel";
import { TransactionEntity } from "@domain/entities/Transaction/transactionEntity";

export class TransactionRepository
  extends BaseRepository<TransactionEntity, ITransactionModel>
  implements ITransactionRepository
{
  constructor(protected _model: Model<ITransactionModel>) {
    super(_model, TransactionMapper);
  }

  async findByWallet(walletId: string): Promise<TransactionEntity[]> {
    const docs = await this._model
      .find({
        $or: [{ fromWalletId: walletId }, { toWalletId: walletId }],
      })
      .sort({ createdAt: -1 });

    return docs.map(TransactionMapper.fromMongooseDocument);
  }
}
