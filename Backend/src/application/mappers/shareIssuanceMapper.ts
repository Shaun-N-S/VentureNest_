import mongoose from "mongoose";
import { IShareIssuanceModel } from "@infrastructure/db/models/shareIssuanceModel";
import { ShareIssuanceEntity } from "@domain/entities/investor/shareIssuanceEntity";
import { ShareIssuanceResponseDTO } from "application/dto/deal/shareIssuanceResponseDTO";

export class ShareIssuanceMapper {
  static toMongooseDocument(entity: ShareIssuanceEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      projectId: new mongoose.Types.ObjectId(entity.projectId),
      dealId: new mongoose.Types.ObjectId(entity.dealId),
      investorId: new mongoose.Types.ObjectId(entity.investorId),
      sharesIssued: entity.sharesIssued,
      equityPercentage: entity.equityPercentage,
      issuedAt: entity.issuedAt,
    };
  }

  static fromMongooseDocument(doc: IShareIssuanceModel): ShareIssuanceEntity {
    return {
      _id: doc._id.toString(),
      projectId: doc.projectId.toString(),
      dealId: doc.dealId.toString(),
      investorId: doc.investorId.toString(),
      sharesIssued: doc.sharesIssued,
      equityPercentage: doc.equityPercentage,
      issuedAt: doc.issuedAt,
    };
  }

  static toResponseDTO(entity: ShareIssuanceEntity): ShareIssuanceResponseDTO {
    return {
      projectId: entity.projectId,
      dealId: entity.dealId,
      investorId: entity.investorId,
      sharesIssued: entity.sharesIssued,
      equityPercentage: entity.equityPercentage,
      issuedAt: entity.issuedAt,
    };
  }
}
