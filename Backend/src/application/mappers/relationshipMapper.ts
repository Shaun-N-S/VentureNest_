import { RelationshipEntity } from "@domain/entities/follows/RelationshipEntity";
import { ConnectionStatus, RelationshipType } from "@domain/enum/connectionStatus";
import { IRelationshipModel } from "@infrastructure/db/models/relationshipModel";
import { RelationshipResDTO } from "application/dto/relationship/relationshipDTO";
import mongoose from "mongoose";

export class RelationshipMapper {
  // Mongoose → Entity
  static fromMongooseDocument(doc: IRelationshipModel): RelationshipEntity {
    return {
      _id: doc._id.toString(),
      fromUserId: doc.fromUserId.toString(),
      toUserId: doc.toUserId.toString(),
      type: doc.type,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  // Entity → Mongoose
  static toMongooseDocument(entity: RelationshipEntity) {
    return {
      _id: entity._id ? new mongoose.Types.ObjectId(entity._id) : undefined,
      fromUserId: new mongoose.Types.ObjectId(entity.fromUserId),
      toUserId: new mongoose.Types.ObjectId(entity.toUserId),
      type: entity.type,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  // Entity → Response DTO
  static toDTO(entity: RelationshipEntity): RelationshipResDTO {
    return {
      _id: entity._id!,
      fromUserId: entity.fromUserId,
      toUserId: entity.toUserId,
      type: entity.type,
      status: entity.status,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  // DTO → Entity (If needed)
  static createToEntity(dto: {
    fromUserId: string;
    toUserId: string;
    type: RelationshipType;
  }): RelationshipEntity {
    const now = new Date();
    return {
      fromUserId: dto.fromUserId,
      toUserId: dto.toUserId,
      type: dto.type,
      status:
        dto.type === RelationshipType.FOLLOW ? ConnectionStatus.NONE : ConnectionStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };
  }
}
