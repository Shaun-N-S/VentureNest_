import mongoose from "mongoose";
import { SubscriptionEntity } from "@domain/entities/subscription/subscriptionEntity";
import { ISubscriptionModel } from "@infrastructure/db/models/subscriptionModel";
import { SubscriptionDTO } from "application/dto/subscription/subscriptionDTO";
import { SubscriptionStatus } from "@domain/enum/subscriptionStatus";

export class SubscriptionMapper {
  static toEntity(userId: string, planId: string, durationDays: number): SubscriptionEntity {
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + durationDays);

    return {
      _id: new mongoose.Types.ObjectId().toString(),
      userId,
      planId,
      startedAt: now,
      expiresAt: expiry,
      status: SubscriptionStatus.ACTIVE,
      usage: {
        messagesUsed: 0,
        consentLettersUsed: 0,
      },
      createdAt: now,
      updatedAt: now,
    };
  }

  static toDTO(entity: SubscriptionEntity): SubscriptionDTO {
    return {
      _id: entity._id!,
      planId: entity.planId,
      startedAt: entity.startedAt,
      expiresAt: entity.expiresAt,
      status: entity.status,
      usage: entity.usage,
      createdAt: entity.createdAt ?? new Date(),
    };
  }

  static toMongooseDocument(entity: SubscriptionEntity) {
    return {
      _id: new mongoose.Types.ObjectId(entity._id),
      userId: new mongoose.Types.ObjectId(entity.userId),
      planId: new mongoose.Types.ObjectId(entity.planId),
      startedAt: entity.startedAt,
      expiresAt: entity.expiresAt,
      status: entity.status,
      usage: entity.usage,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromMongooseDocument(doc: ISubscriptionModel): SubscriptionEntity {
    return {
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      planId: doc.planId.toString(),
      startedAt: doc.startedAt,
      expiresAt: doc.expiresAt,
      status: doc.status,
      usage: doc.usage,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
