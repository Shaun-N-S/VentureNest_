import mongoose from "mongoose";
import { DealEntity } from "@domain/entities/deal/dealEntity";
import { IDealModel } from "@infrastructure/db/models/dealModel";
import { DealResponseDTO } from "application/dto/deal/dealResponseDTO";

export class DealMapper {
  static toMongooseDocument(entity: DealEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      projectId: new mongoose.Types.ObjectId(entity.projectId),
      offerId: new mongoose.Types.ObjectId(entity.offerId),
      founderId: new mongoose.Types.ObjectId(entity.founderId),
      investorId: new mongoose.Types.ObjectId(entity.investorId),
      totalAmount: entity.totalAmount,
      amountPaid: entity.amountPaid,
      remainingAmount: entity.remainingAmount,
      equityPercentage: entity.equityPercentage,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromMongooseDocument(doc: IDealModel): DealEntity {
    return {
      _id: doc._id.toString()!,
      projectId: doc.projectId.toString(),
      offerId: doc.offerId.toString(),
      founderId: doc.founderId.toString(),
      investorId: doc.investorId.toString(),
      totalAmount: doc.totalAmount,
      amountPaid: doc.amountPaid,
      remainingAmount: doc.remainingAmount,
      equityPercentage: doc.equityPercentage,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toResponseDTO(entity: DealEntity): DealResponseDTO {
    return {
      dealId: entity._id!,
      projectId: entity.projectId,
      investorId: entity.investorId,
      totalAmount: entity.totalAmount,
      amountPaid: entity.amountPaid,
      remainingAmount: entity.remainingAmount,
      equityPercentage: entity.equityPercentage,
      status: entity.status,
      createdAt: entity.createdAt!,
    };
  }
}
