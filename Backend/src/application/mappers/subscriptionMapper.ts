import mongoose from "mongoose";
import { SubscriptionEntity } from "@domain/entities/subscription/subscriptionEntity";
import { ISubscriptionModel } from "@infrastructure/db/models/subscriptionModel";
import { SubscriptionDTO } from "application/dto/subscription/subscriptionDTO";

export class SubscriptionMapper {
  static toMongooseDocument(entity: SubscriptionEntity) {
    return {
      _id: entity.id ? new mongoose.Types.ObjectId(entity.id) : undefined,
      ownerId: new mongoose.Types.ObjectId(entity.ownerId),
      ownerRole: entity.ownerRole,
      planId: new mongoose.Types.ObjectId(entity.planId),

      startedAt: entity.startedAt,
      expiresAt: entity.expiresAt,
      status: entity.status,

      ...(entity.usage && { usage: entity.usage }),

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromMongooseDocument(doc: ISubscriptionModel): SubscriptionEntity {
    return {
      id: doc.id.toString(),
      ownerId: doc.ownerId.toString(),
      ownerRole: doc.ownerRole,
      planId: doc.planId.toString(),

      startedAt: doc.startedAt,
      expiresAt: doc.expiresAt,
      status: doc.status,

      ...(doc.usage && { usage: doc.usage }),

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toDTO(entity: SubscriptionEntity): SubscriptionDTO {
    return {
      id: entity.id!,
      planId: entity.planId,
      startedAt: entity.startedAt,
      expiresAt: entity.expiresAt,
      status: entity.status,
      createdAt: entity.createdAt!,
    };
  }
}
