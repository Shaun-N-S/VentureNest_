import { Model, FilterQuery } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IInvestmentOfferRepository } from "@domain/interfaces/repositories/IInvestmentOfferRepository";
import { IInvestmentOfferModel } from "@infrastructure/db/models/investmentOfferModel";
import { OfferStatus } from "@domain/enum/offerStatus";
import { InvestmentOfferEntity } from "@domain/entities/investor/investmentOfferEntity";
import { InvestmentOfferMapper } from "application/mappers/investmentOfferMapper";
import {
  InvestmentOfferDetailsPopulated,
  ReceivedInvestmentOfferPopulated,
  SentInvestmentOfferPopulated,
} from "application/dto/investor/investmentOfferDTO/investmentOfferPopulatedTypes";

export class InvestmentOfferRepository
  extends BaseRepository<InvestmentOfferEntity, IInvestmentOfferModel>
  implements IInvestmentOfferRepository
{
  constructor(protected readonly _model: Model<IInvestmentOfferModel>) {
    super(_model, InvestmentOfferMapper);
  }

  /* ===================== SENT OFFERS (INVESTOR) ===================== */

  async findSentByInvestor(
    investorId: string,
    skip: number,
    limit: number,
    status?: OfferStatus,
    search?: string
  ): Promise<{ items: SentInvestmentOfferPopulated[]; total: number }> {
    const baseQuery: FilterQuery<IInvestmentOfferModel> = {
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
      .lean<SentInvestmentOfferPopulated[]>();

    const filteredItems = items.filter(
      (
        offer
      ): offer is SentInvestmentOfferPopulated & {
        projectId: NonNullable<SentInvestmentOfferPopulated["projectId"]>;
      } => Boolean(offer.projectId)
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

  /* ===================== RECEIVED OFFERS (FOUNDER) ===================== */

  async findReceivedByFounder(
    founderId: string,
    skip: number,
    limit: number,
    status?: OfferStatus,
    search?: string
  ): Promise<{ items: ReceivedInvestmentOfferPopulated[]; total: number }> {
    const baseQuery: FilterQuery<IInvestmentOfferModel> = {
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
      .lean<ReceivedInvestmentOfferPopulated[]>();

    const filteredItems = items.filter(
      (
        offer
      ): offer is ReceivedInvestmentOfferPopulated & {
        projectId: NonNullable<ReceivedInvestmentOfferPopulated["projectId"]>;
      } => Boolean(offer.projectId)
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

  async findDetailsById(offerId: string): Promise<InvestmentOfferDetailsPopulated | null> {
    return this._model
      .findById(offerId)
      .populate("projectId", "startupName logoUrl")
      .populate("investorId", "companyName profileImg")
      .populate("founderId", "userName profileImg")
      .lean<InvestmentOfferDetailsPopulated | null>();
  }

  async updateStatus(offerId: string, status: OfferStatus): Promise<InvestmentOfferEntity | null> {
    const updated = await this._model.findByIdAndUpdate(offerId, { status }, { new: true });

    return updated ? InvestmentOfferMapper.fromMongooseDocument(updated) : null;
  }
}
