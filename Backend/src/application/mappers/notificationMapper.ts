import mongoose from "mongoose";
import { CreateNotificationDTO } from "application/dto/notification/createNotificationDTO";
import { INotificationModel } from "@infrastructure/db/models/notificationModel";
import { NotificationEntity } from "@domain/entities/notification/notificationEntity";
import { NotificationResponseDTO } from "application/dto/notification/notificationResponseDTO";
import { UserRole } from "@domain/enum/userRole";
import { Types } from "mongoose";

interface PopulatedActorDoc {
  _id: Types.ObjectId;
  userName?: string;
  companyName?: string;
  profileImg?: string;
}

function isPopulatedActor(value: unknown): value is PopulatedActorDoc {
  return typeof value === "object" && value !== null && "_id" in value;
}

export class NotificationMapper {
  static toEntity(dto: CreateNotificationDTO): NotificationEntity {
    return {
      _id: new mongoose.Types.ObjectId().toString(),

      recipientId: dto.recipientId,
      recipientRole: dto.recipientRole,

      actorId: dto.actorId,
      actorRole: dto.actorRole,

      actorModel: dto.actorRole === UserRole.INVESTOR ? "Investor" : "User",

      type: dto.type,
      entityId: dto.entityId,
      entityType: dto.entityType,
      message: dto.message,

      isRead: false,

      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static toMongooseDocument(entity: NotificationEntity) {
    return {
      _id: new mongoose.Types.ObjectId(entity._id),
      recipientId: new mongoose.Types.ObjectId(entity.recipientId),
      actorId: new mongoose.Types.ObjectId(entity.actorId),
      recipientRole: entity.recipientRole,
      actorModel: entity.actorModel,
      actorRole: entity.actorRole,
      type: entity.type,
      entityId: new mongoose.Types.ObjectId(entity.entityId),
      entityType: entity.entityType,
      message: entity.message,
      isRead: entity.isRead,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromMongooseDocument(doc: INotificationModel): NotificationEntity {
    const actorIdValue = doc.actorId;

    const actorIdString =
      actorIdValue instanceof Types.ObjectId
        ? actorIdValue.toString()
        : isPopulatedActor(actorIdValue)
          ? actorIdValue._id.toString()
          : "";

    const entity: NotificationEntity = {
      _id: doc._id.toString(),

      recipientId: doc.recipientId.toString(),
      recipientRole: doc.recipientRole,

      actorId: actorIdString,
      actorRole: doc.actorRole,
      actorModel: doc.actorModel,

      type: doc.type,
      entityId: doc.entityId.toString(),
      entityType: doc.entityType,

      message: doc.message,
      isRead: doc.isRead,

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    if (isPopulatedActor(actorIdValue)) {
      const actorBase = {
        id: actorIdValue._id.toString(),
        userName: actorIdValue.userName ?? actorIdValue.companyName ?? "Unknown",
      };

      entity.actor = actorIdValue.profileImg
        ? {
            ...actorBase,
            profileImg: actorIdValue.profileImg,
          }
        : actorBase;
    }

    return entity;
  }

  static toResponseDTO(entity: NotificationEntity): NotificationResponseDTO {
    const senderBase = {
      id: entity.actor?.id ?? entity.actorId,
      userName: entity.actor?.userName ?? "Unknown",
      role: entity.actorRole,
    };

    return {
      _id: entity._id!,

      type: entity.type,
      message: entity.message,
      isRead: entity.isRead,
      createdAt: entity.createdAt,

      sender: entity.actor?.profileImg
        ? {
            ...senderBase,
            profileImg: entity.actor.profileImg,
          }
        : senderBase,
    };
  }
}
