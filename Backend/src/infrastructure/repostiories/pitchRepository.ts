import { Model, FilterQuery } from "mongoose";
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
  constructor(protected readonly _model: Model<IPitchModel>) {
    super(_model, PitchMapper);
  }

  /* ===================== RECEIVED PITCHES ===================== */

  async findReceivedByInvestor(
    investorId: string,
    skip: number,
    limit: number,
    status?: PitchStatus,
    search?: string
  ): Promise<{ items: ReceivedPitchPopulated[]; total: number }> {
    const baseQuery: FilterQuery<IPitchModel> = {
      investorId,
      ...(status ? { status } : {}),
    };

    const items = await this._model
      .find(baseQuery)
      .populate({
        path: "projectId",
        select: "startupName logoUrl",
        ...(search && {
          match: {
            startupName: { $regex: search, $options: "i" },
          },
        }),
      })
      .populate("founderId", "userName profileImg")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<ReceivedPitchPopulated[]>();

    const filteredItems = items.filter(
      (
        pitch
      ): pitch is ReceivedPitchPopulated & {
        projectId: NonNullable<ReceivedPitchPopulated["projectId"]>;
      } => Boolean(pitch.projectId)
    );

    const total = search
      ? await this._model
          .find(baseQuery)
          .populate({
            path: "projectId",
            match: { startupName: { $regex: search, $options: "i" } },
          })
          .then((docs) => docs.filter((d) => d.projectId).length)
      : await this._model.countDocuments(baseQuery);

    return { items: filteredItems, total };
  }

  /* ===================== SENT PITCHES ===================== */

  async findSentByFounder(
    founderId: string,
    skip: number,
    limit: number,
    status?: PitchStatus,
    search?: string
  ): Promise<{ items: SentPitchPopulated[]; total: number }> {
    const baseQuery: FilterQuery<IPitchModel> = {
      founderId,
      ...(status ? { status } : {}),
    };

    const items = await this._model
      .find(baseQuery)
      .populate({
        path: "projectId",
        select: "startupName logoUrl",
        ...(search && {
          match: {
            startupName: { $regex: search, $options: "i" },
          },
        }),
      })
      .populate("investorId", "companyName profileImg")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<SentPitchPopulated[]>();

    const filteredItems = items.filter(
      (
        pitch
      ): pitch is SentPitchPopulated & {
        projectId: NonNullable<SentPitchPopulated["projectId"]>;
      } => Boolean(pitch.projectId)
    );

    const total = search
      ? await this._model
          .find(baseQuery)
          .populate({
            path: "projectId",
            match: { startupName: { $regex: search, $options: "i" } },
          })
          .then((docs) => docs.filter((d) => d.projectId).length)
      : await this._model.countDocuments(baseQuery);

    return { items: filteredItems, total };
  }

  /* ===================== DETAILS ===================== */

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
