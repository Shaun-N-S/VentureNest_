import { Model } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { IInvestmentOfferRepository } from "@domain/interfaces/repositories/IInvestmentOfferRepository";
import { IInvestmentOfferModel } from "@infrastructure/db/models/investmentOfferModel";
import { OfferStatus } from "@domain/enum/offerStatus";
import { InvestmentOfferEntity } from "@domain/entities/investor/investmentOfferEntity";
import { InvestmentOfferMapper } from "application/mappers/investmentOfferMapper";

export class InvestmentOfferRepository
  extends BaseRepository<InvestmentOfferEntity, IInvestmentOfferModel>
  implements IInvestmentOfferRepository
{
  constructor(protected _model: Model<IInvestmentOfferModel>) {
    super(_model, InvestmentOfferMapper);
  }

  async findSentByInvestor(investorId: string): Promise<InvestmentOfferEntity[]> {
    const docs = await this._model.find({ investorId }).sort({ createdAt: -1 });

    return docs.map(InvestmentOfferMapper.fromMongooseDocument);
  }

  async findReceivedByFounder(founderId: string): Promise<InvestmentOfferEntity[]> {
    const docs = await this._model.find({ founderId }).sort({ createdAt: -1 });

    return docs.map(InvestmentOfferMapper.fromMongooseDocument);
  }

  async updateStatus(offerId: string, status: OfferStatus): Promise<InvestmentOfferEntity | null> {
    const updated = await this._model.findByIdAndUpdate(offerId, { status }, { new: true });

    return updated ? InvestmentOfferMapper.fromMongooseDocument(updated) : null;
  }
}
