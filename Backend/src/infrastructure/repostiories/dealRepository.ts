import { ClientSession, Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IDealRepository } from "@domain/interfaces/repositories/IDealRepository";
import { IDealModel } from "@infrastructure/db/models/dealModel";
import { DealEntity } from "@domain/entities/deal/dealEntity";
import { DealMapper } from "application/mappers/dealMapper";

export class DealRepository
  extends BaseRepository<DealEntity, IDealModel>
  implements IDealRepository
{
  constructor(protected _model: Model<IDealModel>) {
    super(_model, DealMapper);
  }

  async findByOfferId(offerId: string): Promise<DealEntity | null> {
    const doc = await this._model.findOne({ offerId });
    return doc ? DealMapper.fromMongooseDocument(doc) : null;
  }

  async incrementPaidAmount(
    dealId: string,
    amount: number,
    session?: ClientSession
  ): Promise<void> {
    const update = {
      $inc: {
        amountPaid: amount,
        remainingAmount: -amount,
      },
    };

    if (session) {
      await this._model.updateOne({ _id: dealId }, update, { session });
    } else {
      await this._model.updateOne({ _id: dealId }, update);
    }
  }
}
