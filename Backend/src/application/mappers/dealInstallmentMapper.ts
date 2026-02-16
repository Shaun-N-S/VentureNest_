import mongoose from "mongoose";
import { DealInstallmentEntity } from "@domain/entities/deal/dealInstallmentEntity";
import { IDealInstallmentModel } from "@infrastructure/db/models/dealInstallmentModel";
import { DealInstallmentResponseDTO } from "application/dto/deal/dealInstallmentResponseDTO";

export class DealInstallmentMapper {
  static toMongooseDocument(entity: DealInstallmentEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      dealId: new mongoose.Types.ObjectId(entity.dealId),
      amount: entity.amount,
      platformFee: entity.platformFee,
      founderReceives: entity.founderReceives,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromMongooseDocument(doc: IDealInstallmentModel): DealInstallmentEntity {
    return {
      _id: doc._id.toString(),
      dealId: doc.dealId.toString(),
      amount: doc.amount,
      platformFee: doc.platformFee,
      founderReceives: doc.founderReceives,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toResponseDTO(entity: DealInstallmentEntity): DealInstallmentResponseDTO {
    return {
      installmentId: entity._id!,
      dealId: entity.dealId,
      amount: entity.amount,
      platformFee: entity.platformFee,
      founderReceives: entity.founderReceives,
      status: entity.status,
      createdAt: entity.createdAt!,
    };
  }
}
