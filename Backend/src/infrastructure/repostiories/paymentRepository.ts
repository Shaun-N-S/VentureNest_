import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IPaymentRepository } from "@domain/interfaces/repositories/IPaymentRepository";
import { PaymentEntity } from "@domain/entities/payment/paymentEntity";
import { IPaymentModel } from "@infrastructure/db/models/paymentModel";
import { PaymentMapper } from "application/mappers/paymentMapper";

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
}
