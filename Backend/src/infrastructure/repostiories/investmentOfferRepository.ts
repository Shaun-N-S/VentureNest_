import { Model } from "mongoose";
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
  constructor(protected _model: Model<IInvestmentOfferModel>) {
    super(_model, InvestmentOfferMapper);
  }

  async findSentByInvestor(investorId: string): Promise<SentInvestmentOfferPopulated[]> {
    return this._model
      .find({ investorId })
      .populate("projectId", "startupName logoUrl")
      .populate("founderId", "userName profileImg")
      .sort({ createdAt: -1 })
      .lean<SentInvestmentOfferPopulated[]>();
  }

  async findReceivedByFounder(founderId: string): Promise<ReceivedInvestmentOfferPopulated[]> {
    return this._model
      .find({ founderId })
      .populate("projectId", "startupName logoUrl")
      .populate("investorId", "companyName profileImg")
      .sort({ createdAt: -1 })
      .lean<ReceivedInvestmentOfferPopulated[]>();
  }

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
