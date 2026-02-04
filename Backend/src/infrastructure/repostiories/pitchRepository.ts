import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IPitchRepository } from "@domain/interfaces/repositories/IPitchRepository";
import { PitchEntity } from "@domain/entities/pitch/pitchEntity";
import { IPitchModel } from "@infrastructure/db/models/pitchModel";
import { PitchStatus } from "@domain/enum/pitchStatus";
import { PitchMapper } from "application/mappers/pitchMapper";

export class PitchRepository
  extends BaseRepository<PitchEntity, IPitchModel>
  implements IPitchRepository
{
  constructor(protected _model: Model<IPitchModel>) {
    super(_model, PitchMapper);
  }

  async findSentByFounder(founderId: string): Promise<PitchEntity[]> {
    const docs = await this._model.find({ founderId }).sort({ createdAt: -1 });

    return docs.map(PitchMapper.fromMongooseDocument);
  }

  async findReceivedByInvestor(investorId: string): Promise<PitchEntity[]> {
    const docs = await this._model.find({ investorId }).sort({ createdAt: -1 });

    return docs.map(PitchMapper.fromMongooseDocument);
  }

  async updateStatus(pitchId: string, status: PitchStatus): Promise<PitchEntity | null> {
    const updated = await this._model.findByIdAndUpdate(pitchId, { status }, { new: true });

    return updated ? PitchMapper.fromMongooseDocument(updated) : null;
  }
}
