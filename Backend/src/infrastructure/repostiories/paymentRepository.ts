import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IPaymentRepository } from "@domain/interfaces/repositories/IPaymentRepository";
import { PaymentEntity } from "@domain/entities/payment/paymentEntity";
import { IPaymentModel } from "@infrastructure/db/models/paymentModel";
import { PaymentMapper } from "application/mappers/paymentMapper";
import { PaymentPurpose } from "@domain/enum/paymentPurpose";

export class PaymentRepository
  extends BaseRepository<PaymentEntity, IPaymentModel>
  implements IPaymentRepository
{
  constructor(protected _model: Model<IPaymentModel>) {
    super(_model, PaymentMapper);
  }

  async findBySessionId(sessionId: string): Promise<PaymentEntity | null> {
    const doc = await this._model.findOne({ sessionId });
    return doc ? PaymentMapper.fromMongooseDocument(doc) : null;
  }

  async sumByPurpose(purpose: string): Promise<number> {
    const result = await this._model.aggregate([
      { $match: { purpose } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return result[0]?.total ?? 0;
  }

  async getRevenueByPurposeWithFilter(
    purpose: PaymentPurpose,
    filter: {
      fromDate?: Date;
      toDate?: Date;
      year?: number;
      month?: number;
    }
  ) {
    const match: any = {
      purpose,
      status: "SUCCESS",
    };

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
