import mongoose from "mongoose";
import { ICapTableModel } from "@infrastructure/db/models/capTableModel";
import { CapTableEntity } from "@domain/entities/investor/capTableEntity";
import { CapTableResponseDTO } from "application/dto/deal/capTableResponseDTO";

export class CapTableMapper {
  static toMongooseDocument(entity: CapTableEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      projectId: new mongoose.Types.ObjectId(entity.projectId),
      totalShares: entity.totalShares,
      shareholders: entity.shareholders.map((s) => ({
        userId: new mongoose.Types.ObjectId(s.userId),
        shares: s.shares,
        equityPercentage: s.equityPercentage,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromMongooseDocument(doc: ICapTableModel): CapTableEntity {
    return {
      _id: doc._id.toString(),
      projectId: doc.projectId.toString(),
      totalShares: doc.totalShares,
      shareholders: doc.shareholders.map((s) => ({
        userId: s.userId.toString(),
        shares: s.shares,
        equityPercentage: s.equityPercentage,
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toResponseDTO(entity: CapTableEntity): CapTableResponseDTO {
    return {
      projectId: entity.projectId,
      totalShares: entity.totalShares,
      shareholders: entity.shareholders,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }
}
