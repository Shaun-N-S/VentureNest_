import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IPitchRepository } from "@domain/interfaces/repositories/IPitchRepository";
import { PitchEntity } from "@domain/entities/pitch/pitchEntity";
import { IPitchModel } from "@infrastructure/db/models/pitchModel";
import { PitchStatus } from "@domain/enum/pitchStatus";
import { PitchMapper } from "application/mappers/pitchMapper";
import {
  ReceivedPitchPopulated,
  SentPitchPopulated,
} from "application/dto/pitch/PitchPopulatedTypes";
import {
  InvestorReplyDTO,
  PitchDetailsPopulated,
} from "application/dto/pitch/PitchDetailsResponseDTO";

export class PitchRepository
  extends BaseRepository<PitchEntity, IPitchModel>
  implements IPitchRepository
{
  constructor(protected _model: Model<IPitchModel>) {
    super(_model, PitchMapper);
  }

  async findReceivedByInvestor(investorId: string): Promise<ReceivedPitchPopulated[]> {
    return this._model
      .find({ investorId })
      .populate("founderId", "userName profileImg")
      .populate("projectId", "startupName logoUrl")
      .sort({ createdAt: -1 })
      .lean<ReceivedPitchPopulated[]>();
  }

  async findSentByFounder(founderId: string): Promise<SentPitchPopulated[]> {
    return this._model
      .find({ founderId })
      .populate("investorId", "companyName profileImg")
      .populate("projectId", "startupName logoUrl")
      .sort({ createdAt: -1 })
      .lean<SentPitchPopulated[]>();
  }

  async findDetailsById(pitchId: string): Promise<PitchDetailsPopulated | null> {
    return this._model
      .findById(pitchId)
      .populate("projectId", "startupName logoUrl")
      .populate("founderId", "userName profileImg")
      .populate("investorId", "companyName profileImg")
      .lean<PitchDetailsPopulated | null>();
  }

  async updateStatus(pitchId: string, status: PitchStatus): Promise<PitchEntity | null> {
    const updated = await this._model.findByIdAndUpdate(pitchId, { status }, { new: true });

    return updated ? PitchMapper.fromMongooseDocument(updated) : null;
  }

  async respondToPitch(
    pitchId: string,
    reply: InvestorReplyDTO
  ): Promise<PitchDetailsPopulated | null> {
    return this._model
      .findByIdAndUpdate(
        pitchId,
        {
          investorReply: reply,
          status: PitchStatus.RESPONDED,
        },
        { new: true }
      )
      .populate("projectId", "startupName logoUrl")
      .populate("founderId", "userName profileImg")
      .populate("investorId", "companyName profileImg")
      .lean<PitchDetailsPopulated | null>();
  }
}
