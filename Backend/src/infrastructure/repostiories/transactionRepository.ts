import { ClientSession, Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { ITransactionRepository } from "@domain/interfaces/repositories/ITransactionRepository";
import { TransactionMapper } from "application/mappers/transactionMapper";
import { ITransactionModel } from "@infrastructure/db/models/transactionModel";
import { TransactionEntity } from "@domain/entities/Transaction/transactionEntity";
import { TransactionAction } from "@domain/enum/transactionType";
import { TransactionStatus } from "@domain/enum/transactionStatus";

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

  async findAdminTransactions(
    filters: {
      reason?: string;
      action?: string;
      status?: string;
      relatedDealId?: string;
    },
    skip: number,
    limit: number
  ): Promise<TransactionEntity[]> {
    const query: any = {};

    if (filters.reason) query.reason = filters.reason;
    if (filters.action) query.action = filters.action;
    if (filters.status) query.status = filters.status;
    if (filters.relatedDealId) query.relatedDealId = filters.relatedDealId;

    const docs = await this._model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return docs.map(TransactionMapper.fromMongooseDocument);
  }

  async countAdminTransactions(filters: {
    reason?: string;
    action?: string;
    status?: string;
    relatedDealId?: string;
  }): Promise<number> {
    return this._model.countDocuments(filters);
  }

  async sumByReason(reason: string): Promise<number> {
    const result = await this._model.aggregate([
      { $match: { reason } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return result[0]?.total ?? 0;
  }

  async findByRelatedPaymentId(paymentId: string): Promise<TransactionEntity | null> {
    const doc = await this._model.findOne({ relatedPaymentId: paymentId });
    return doc ? TransactionMapper.fromMongooseDocument(doc) : null;
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    session?: ClientSession
  ): Promise<void> {
    await this._model.updateOne({ _id: id }, { $set: { status } }, session ? { session } : {});
  }
}
