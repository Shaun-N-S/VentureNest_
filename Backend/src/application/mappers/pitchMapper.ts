import mongoose from "mongoose";
import { PitchEntity } from "@domain/entities/pitch/pitchEntity";
import { IPitchModel } from "@infrastructure/db/models/pitchModel";
import { PitchResponseDTO } from "application/dto/pitch/PitchResponseDTO";

export class PitchMapper {
  static toMongooseDocument(entity: PitchEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      projectId: new mongoose.Types.ObjectId(entity.projectId),
      founderId: new mongoose.Types.ObjectId(entity.founderId),
      investorId: new mongoose.Types.ObjectId(entity.investorId),
      subject: entity.subject,
      message: entity.message,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromMongooseDocument(doc: IPitchModel): PitchEntity {
    return {
      _id: doc._id.toString(),
      projectId: doc.projectId.toString(),
      founderId: doc.founderId.toString(),
      investorId: doc.investorId.toString(),
      subject: doc.subject,
      message: doc.message,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toResponseDTO(entity: PitchEntity): PitchResponseDTO {
    return {
      pitchId: entity._id!,
      projectId: entity.projectId,
      founderId: entity.founderId,
      investorId: entity.investorId,
      subject: entity.subject,
      message: entity.message,
      status: entity.status,
      createdAt: entity.createdAt!,
    };
  }
}
