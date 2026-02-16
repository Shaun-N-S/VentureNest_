import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IDealInstallmentRepository } from "@domain/interfaces/repositories/IDealInstallmentRepository";
import { DealInstallmentEntity } from "@domain/entities/deal/dealInstallmentEntity";
import { IDealInstallmentModel } from "@infrastructure/db/models/dealInstallmentModel";
import { DealInstallmentMapper } from "application/mappers/dealInstallmentMapper";

export class DealInstallmentRepository
  extends BaseRepository<DealInstallmentEntity, IDealInstallmentModel>
  implements IDealInstallmentRepository
{
  constructor(protected _model: Model<IDealInstallmentModel>) {
    super(_model, DealInstallmentMapper);
  }

  async findByDealId(dealId: string): Promise<DealInstallmentEntity[]> {
    const docs = await this._model.find({ dealId }).sort({ createdAt: -1 });

    return docs.map(DealInstallmentMapper.fromMongooseDocument);
  }
}
