import mongoose from "mongoose";
import { IInvestmentOfferModel } from "@infrastructure/db/models/investmentOfferModel";
import { InvestmentOfferEntity } from "@domain/entities/investor/investmentOfferEntity";

export class InvestmentOfferMapper {
  static toMongooseDocument(entity: InvestmentOfferEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      pitchId: new mongoose.Types.ObjectId(entity.pitchId),
      projectId: new mongoose.Types.ObjectId(entity.projectId),
      investorId: new mongoose.Types.ObjectId(entity.investorId),
      founderId: new mongoose.Types.ObjectId(entity.founderId),
      amount: entity.amount,
      equityPercentage: entity.equityPercentage,
      terms: entity.terms,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromMongooseDocument(doc: IInvestmentOfferModel): InvestmentOfferEntity {
    return {
      _id: doc._id.toString(),
      pitchId: doc.pitchId.toString(),
      projectId: doc.projectId.toString(),
      investorId: doc.investorId.toString(),
      founderId: doc.founderId.toString(),
      amount: doc.amount,
      equityPercentage: doc.equityPercentage,
      terms: doc.terms,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
