import { ClientSession, Model, Types } from "mongoose";
import { BaseRepository } from "./baseRepository";
import {
  AdminTransactionListItem,
  ITransactionRepository,
} from "@domain/interfaces/repositories/ITransactionRepository";
import { TransactionMapper } from "application/mappers/transactionMapper";
import { ITransactionModel } from "@infrastructure/db/models/transactionModel";
import { TransactionEntity } from "@domain/entities/Transaction/transactionEntity";
import { TransactionAction, TransactionReason } from "@domain/enum/transactionType";
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

  /**
   * Admin transaction list. Pagination and the reason/action/status/relatedDealId
   * filters behave exactly as before; the pipeline additionally resolves a
   * `displayName` for each row using $lookup on existing collections only:
   *   - INVESTMENT / PLATFORM_FEE : relatedDealId -> deals -> projects (startupName)
   *   - WALLET_TOPUP             : toWalletId  -> wallets -> users / investors
   *   - WITHDRAWAL               : fromWalletId -> wallets -> projects (+founder) / users / investors
   *   - SUBSCRIPTION             : relatedPaymentId -> payments -> users / investors
   *   - REFUND / legacy SUBSCRIPTION rows -> displayName = null (caller shows "System")
   */
  async findAdminTransactions(
    filters: {
      reason?: string;
      action?: string;
      status?: string;
      relatedDealId?: string;
    },
    skip: number,
    limit: number
  ): Promise<AdminTransactionListItem[]> {
    const match: Record<string, unknown> = {};

    if (filters.reason) match.reason = filters.reason;
    if (filters.action) match.action = filters.action;
    if (filters.status) match.status = filters.status;
    if (filters.relatedDealId && Types.ObjectId.isValid(filters.relatedDealId)) {
      match.relatedDealId = new Types.ObjectId(filters.relatedDealId);
    }

    const rows = await this._model.aggregate<AdminTransactionListItem>([
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      // ---- Deal route: INVESTMENT, PLATFORM_FEE ----
      { $lookup: { from: "deals", localField: "relatedDealId", foreignField: "_id", as: "deal" } },
      { $unwind: { path: "$deal", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "projects",
          localField: "deal.projectId",
          foreignField: "_id",
          as: "dealProject",
        },
      },
      { $unwind: { path: "$dealProject", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "investors",
          localField: "deal.investorId",
          foreignField: "_id",
          as: "dealInvestor",
        },
      },
      { $unwind: { path: "$dealInvestor", preserveNullAndEmptyArrays: true } },

      // ---- Subscription route: Transaction -> Payment -> User / Investor ----
      {
        $lookup: {
          from: "payments",
          localField: "relatedPaymentId",
          foreignField: "_id",
          as: "subPayment",
        },
      },
      { $unwind: { path: "$subPayment", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "subPayment.ownerId",
          foreignField: "_id",
          as: "subUser",
        },
      },
      { $unwind: { path: "$subUser", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "investors",
          localField: "subPayment.ownerId",
          foreignField: "_id",
          as: "subInvestor",
        },
      },
      { $unwind: { path: "$subInvestor", preserveNullAndEmptyArrays: true } },

      // ---- Wallet-owner route: WALLET_TOPUP (toWallet), WITHDRAWAL (fromWallet) ----
      {
        $addFields: {
          _partyWalletId: {
            $switch: {
              branches: [
                { case: { $eq: ["$reason", "WALLET_TOPUP"] }, then: "$toWalletId" },
                { case: { $eq: ["$reason", "WITHDRAWAL"] }, then: "$fromWalletId" },
              ],
              default: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "wallets",
          localField: "_partyWalletId",
          foreignField: "_id",
          as: "partyWallet",
        },
      },
      { $unwind: { path: "$partyWallet", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "partyWallet.ownerId",
          foreignField: "_id",
          as: "partyUser",
        },
      },
      { $unwind: { path: "$partyUser", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "investors",
          localField: "partyWallet.ownerId",
          foreignField: "_id",
          as: "partyInvestor",
        },
      },
      { $unwind: { path: "$partyInvestor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "projects",
          localField: "partyWallet.ownerId",
          foreignField: "_id",
          as: "partyProject",
        },
      },
      { $unwind: { path: "$partyProject", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "partyProject.userId",
          foreignField: "_id",
          as: "partyProjectFounder",
        },
      },
      { $unwind: { path: "$partyProjectFounder", preserveNullAndEmptyArrays: true } },

      // ---- Compose displayName / relatedProjectName / relatedEntityType ----
      {
        $addFields: {
          relatedProjectName: {
            $ifNull: ["$dealProject.startupName", { $ifNull: ["$partyProject.startupName", null] }],
          },
          displayName: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$reason", "INVESTMENT"] },
                  then: {
                    $ifNull: [
                      "$dealProject.startupName",
                      { $ifNull: ["$dealInvestor.userName", null] },
                    ],
                  },
                },
                {
                  case: { $eq: ["$reason", "PLATFORM_FEE"] },
                  then: { $ifNull: ["$dealProject.startupName", null] },
                },
                {
                  case: { $eq: ["$reason", "WALLET_TOPUP"] },
                  then: {
                    $ifNull: [
                      "$partyUser.userName",
                      { $ifNull: ["$partyInvestor.userName", null] },
                    ],
                  },
                },
                {
                  case: { $eq: ["$reason", "WITHDRAWAL"] },
                  then: {
                    $ifNull: [
                      "$partyProject.startupName",
                      {
                        $ifNull: [
                          "$partyProjectFounder.userName",
                          {
                            $ifNull: [
                              "$partyUser.userName",
                              { $ifNull: ["$partyInvestor.userName", null] },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
                {
                  case: { $eq: ["$reason", "SUBSCRIPTION"] },
                  then: {
                    $ifNull: ["$subUser.userName", { $ifNull: ["$subInvestor.userName", null] }],
                  },
                },
              ],
              default: null,
            },
          },
          relatedEntityType: {
            $switch: {
              branches: [
                { case: { $in: ["$reason", ["INVESTMENT", "PLATFORM_FEE"]] }, then: "PROJECT" },
                {
                  case: { $ne: [{ $ifNull: ["$partyProject._id", null] }, null] },
                  then: "PROJECT",
                },
                { case: { $ne: [{ $ifNull: ["$partyUser._id", null] }, null] }, then: "USER" },
                {
                  case: { $ne: [{ $ifNull: ["$partyInvestor._id", null] }, null] },
                  then: "INVESTOR",
                },
                { case: { $ne: [{ $ifNull: ["$subUser._id", null] }, null] }, then: "USER" },
                {
                  case: { $ne: [{ $ifNull: ["$subInvestor._id", null] }, null] },
                  then: "INVESTOR",
                },
              ],
              default: "SYSTEM",
            },
          },
        },
      },

      {
        $project: {
          _id: { $toString: "$_id" },
          fromWalletId: { $toString: "$fromWalletId" },
          toWalletId: { $toString: "$toWalletId" },
          relatedDealId: { $toString: "$relatedDealId" },
          amount: 1,
          action: 1,
          reason: 1,
          status: 1,
          createdAt: 1,
          displayName: 1,
          relatedProjectName: 1,
          relatedEntityType: 1,
        },
      },
    ]);

    return rows;
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

  async findByWalletPaginated(
    walletId: string,
    action?: TransactionAction,
    skip: number = 0,
    limit: number = 10
  ): Promise<TransactionEntity[]> {
    const query: any = {
      $or: [{ fromWalletId: walletId }, { toWalletId: walletId }],
    };

    if (action) query.action = action;

    const docs = await this._model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return docs.map(TransactionMapper.fromMongooseDocument);
  }

  async countByWallet(walletId: string, action?: TransactionAction): Promise<number> {
    const query: any = {
      $or: [{ fromWalletId: walletId }, { toWalletId: walletId }],
    };

    if (action) query.action = action;

    return this._model.countDocuments(query);
  }

  async getRevenueByReasonWithFilter(
    reason: TransactionReason,
    filter: {
      fromDate?: Date;
      toDate?: Date;
      year?: number;
      month?: number;
    }
  ) {
    const match: any = {
      reason,
      status: "SUCCESS",
    };

    // Date filters
    if (filter.fromDate && filter.toDate) {
      match.createdAt = {
        $gte: filter.fromDate,
        $lte: filter.toDate,
      };
    } else if (filter.year) {
      match.createdAt = {
        $gte: new Date(`${filter.year}-01-01`),
        $lte: new Date(`${filter.year}-12-31`),
      };
    }

    return this._model.aggregate([
      { $match: match },

      ...(filter.month
        ? [
            {
              $addFields: {
                month: { $month: "$createdAt" },
              },
            },
            {
              $match: { month: filter.month },
            },
          ]
        : []),

      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$amount" },
        },
      },

      { $sort: { _id: 1 } },
    ]);
  }
}
