import mongoose from "mongoose";
import { CreateNotificationDTO } from "application/dto/notification/createNotificationDTO";
import { INotificationModel } from "@infrastructure/db/models/notificationModel";
import { NotificationEntity } from "@domain/entities/notification/notificationEntity";
import { NotificationResponseDTO } from "application/dto/notification/notificationResponseDTO";

export class NotificationMapper {
  static toEntity(dto: CreateNotificationDTO): NotificationEntity {
    return {
      _id: new mongoose.Types.ObjectId().toString(),
      recipientId: dto.recipientId,
      recipientRole: dto.recipientRole,
      actorId: dto.actorId,
      actorRole: dto.actorRole,
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
    return {
      _id: doc._id.toString(),
      recipientId: doc.recipientId.toString(),
      recipientRole: doc.recipientRole,
      actorId: doc.actorId.toString(),
      actorRole: doc.actorRole,
      type: doc.type,
      entityId: doc.entityId.toString(),
      entityType: doc.entityType,
      message: doc.message,
      isRead: doc.isRead,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toResponseDTO(entity: NotificationEntity): NotificationResponseDTO {
    return {
      _id: entity._id!,
      recipientId: entity.recipientId,
      recipientRole: entity.recipientRole,
      actorId: entity.actorId,
      actorRole: entity.actorRole,
      type: entity.type,
      entityId: entity.entityId,
      entityType: entity.entityType,
      message: entity.message,
      isRead: entity.isRead,
      createdAt: entity.createdAt,
    };
  }
}
