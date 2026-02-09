import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { TransactionMapper } from "application/mappers/transactionMapper";
import { ITransactionModel } from "@infrastructure/db/models/transactionModel";
import { TransactionEntity } from "@domain/entities/Transaction/transactionEntity";
import { TransactionAction } from "@domain/enum/transactionType";

export class TransactionRepository
  extends BaseRepository<TransactionEntity, ITransactionModel>
  implements ITransactionRepository
{
  constructor(protected _model: Model<ITransactionModel>) {
    super(_model, TransactionMapper);
  }

  async findByWallet(walletId: string, action?: TransactionAction): Promise<TransactionEntity[]> {
    const query: any = {
      $or: [{ fromWalletId: walletId }, { toWalletId: walletId }],
    };

    if (action) {
      query.action = action;
    }

    const docs = await this._model.find(query).sort({ createdAt: -1 });

    return docs.map(TransactionMapper.fromMongooseDocument);
  }
}
